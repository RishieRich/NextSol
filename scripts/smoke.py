"""End-to-end smoke test of the site's interactive journeys, against a running build.

Usage:
    python scripts/smoke.py http://localhost:4173 [screenshot-dir]

Checks:
  1. Every route loads with one h1 and no console errors.
  2. The ERP slider moves on its next button and on ArrowRight.
  3. The products mega-menu opens by keyboard and closes on Escape, returning focus.
  4. The services filter changes the visible cards.
  5. The quick guide reaches a recommendation and opens WhatsApp with the product name.
  6. The TallyPrime invoice switches between standard and customised.
  7. Each customisation tab shows its own preview, including by keyboard.
  8. The licence advisor recommends Silver, Gold, and a consultation correctly.
  9. The enquiry form blocks empty input, then opens WhatsApp with the message filled in.
 10. The mobile menu opens and closes.
 11. With reduced motion the slider does not autoplay and all content is visible.
 12. With JavaScript disabled all home text is visible.
 With a screenshot dir, also saves a frame sequence of the hero loading.

WhatsApp (wa.me) is stubbed, so nothing leaves the machine.
Needs Playwright for Python and a Chrome binary (CHROME_PATH, default /opt/google/chrome/chrome).
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import expect, sync_playwright

PAGES = [
    "/",
    "/about/",
    "/services/",
    "/tally-prime/",
    "/tally-on-mobile/",
    "/tally-on-cloud/",
    "/saral-billing/",
    "/saral-payroll-software/",
    "/portfolio/",
    "/contact/",
    "/tools/",
    "/tools/gst-calculator/",
    "/tools/gst-invoice-generator/",
    "/tools/gstin-checker/",
    "/tools/msme-payment-interest/",
    "/tools/amount-in-words/",
]

ERP_SLIDER = '[aria-roledescription="carousel"][aria-label="ERP and billing software"]'

# Text that is on the page for people but cannot be seen: cumulative opacity under 0.6 or visibility hidden.
# Skips decorative (aria-hidden), visually-hidden and closed content.
HIDDEN_TEXT_JS = """
() => {
  const bad = [];
  const selector = 'main h1, main h2, main h3, main p, main li, main a, main button, main dt, main dd, main td, main th, footer p, footer a';
  for (const el of document.querySelectorAll(selector)) {
    if (!el.textContent.trim()) continue;
    if (el.closest('[aria-hidden="true"], .visually-hidden, [hidden], [inert], details:not([open]) > :not(summary)')) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    let opacity = 1;
    for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.visibility === 'hidden') { opacity = 0; break; }
      opacity *= parseFloat(style.opacity);
    }
    if (opacity < 0.6) bad.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}" at ${opacity.toFixed(2)}`);
  }
  return bad;
}
"""


def main() -> int:
    base = sys.argv[1].rstrip("/")
    shots = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    if shots:
        shots.mkdir(parents=True, exist_ok=True)
    chrome = os.environ.get("CHROME_PATH", "/opt/google/chrome/chrome")
    results: list[tuple[str, bool, str]] = []

    def check(name: str, fn) -> None:
        try:
            detail = fn() or ""
            results.append((name, True, detail))
        except Exception as error:  # noqa: BLE001 - report every failure, keep going
            results.append((name, False, str(error).splitlines()[0]))

    def stub_whatsapp(context) -> None:
        context.route("https://wa.me/**", lambda route: route.fulfill(status=200, body="stub"))
        context.route("https://api.whatsapp.com/**", lambda route: route.fulfill(status=200, body="stub"))

    def scroll_through(page) -> None:
        height = page.evaluate("document.documentElement.scrollHeight")
        for y in range(0, height, 500):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(60)
        page.wait_for_timeout(600)

    def selected_slide(slider) -> int:
        current = slider.locator('button[aria-current="true"]')
        expect(current).to_have_count(1)
        label = current.get_attribute("aria-label") or ""
        return int(label.rsplit(" ", 1)[-1])

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome, args=["--no-sandbox"])
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        stub_whatsapp(ctx)
        page = ctx.new_page()
        errors: list[str] = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        # A navigation cancels in-flight prefetches (net::ERR_ABORTED); only real failures count.
        page.on(
            "requestfailed",
            lambda r: errors.append(f"request failed: {r.url} ({r.failure})")
            if "ERR_ABORTED" not in (r.failure or "") and "wa.me" not in r.url
            else None,
        )
        page.on("response", lambda r: errors.append(f"{r.status} {r.url}") if r.status >= 400 else None)

        def pages_load():
            for path in PAGES:
                response = page.goto(f"{base}{path}", wait_until="networkidle")
                assert response and response.ok, f"{path} returned {response.status if response else 'nothing'}"
                expect(page.locator("h1")).to_have_count(1)
            assert not errors, f"console errors: {errors[:3]}"
            return f"{len(PAGES)} routes, one h1 each, no console errors"

        check("pages load", pages_load)

        def old_route_gone():
            response = page.request.get(f"{base}/tally/")
            assert response.status == 404, f"/tally/ returned {response.status}"
            return "/tally/ is gone (404)"

        check("old /tally/ route", old_route_gone)

        def erp_slider():
            page.goto(f"{base}/", wait_until="networkidle")
            slider = page.locator(ERP_SLIDER)
            slider.scroll_into_view_if_needed()
            slider.hover()  # pauses autoplay so only our input moves it
            start = selected_slide(slider)
            slider.get_by_role("button", name="Next slide").click()
            expect(slider.locator('button[aria-current="true"]')).to_have_attribute("aria-label", f"Go to slide {start + 1}")
            slider.get_by_role("button", name="Next slide").focus()
            page.keyboard.press("ArrowRight")
            expect(slider.locator('button[aria-current="true"]')).to_have_attribute("aria-label", f"Go to slide {start + 2}")
            if shots:
                page.wait_for_timeout(500)
                slider.screenshot(path=str(shots / "erp-slider.png"))
            return f"slide {start} -> {start + 1} (button) -> {start + 2} (ArrowRight)"

        check("ERP slider", erp_slider)

        def mega_menu():
            page.goto(f"{base}/", wait_until="networkidle")
            button = page.get_by_role("button", name="Products & Services")
            button.focus()
            page.keyboard.press("ArrowDown")
            expect(button).to_have_attribute("aria-expanded", "true")
            menu = page.locator(f"#{button.get_attribute('aria-controls')}")
            expect(menu).to_be_visible()
            expect(menu.get_by_role("link").first).to_be_focused()
            if shots:
                page.wait_for_timeout(600)
                page.screenshot(path=str(shots / "mega-menu.png"))
            page.keyboard.press("Escape")
            expect(menu).to_be_hidden()
            expect(button).to_have_attribute("aria-expanded", "false")
            expect(button).to_be_focused()
            return "ArrowDown opens with focus on the first link, Escape closes and returns focus"

        check("mega-menu", mega_menu)

        def services_filter():
            page.goto(f"{base}/services/", wait_until="networkidle")
            cards = page.locator("main ul li[id]")
            total = cards.count()
            assert total > 5, f"only {total} cards"
            chip = page.get_by_role("button", name=re.compile(r"^IT and hardware"))
            chip.click()
            expect(chip).to_have_attribute("aria-pressed", "true")
            page.wait_for_timeout(700)
            shown = cards.count()
            assert 0 < shown < total, f"{shown} of {total} after filtering"
            expect(page.get_by_role("status").filter(has_text="Showing")).to_have_text(f"Showing {shown} of {total}")
            if shots:
                page.screenshot(path=str(shots / "services-filtered.png"))
            page.get_by_role("button", name=re.compile(r"^All")).click()
            page.wait_for_timeout(700)
            assert cards.count() == total, "All did not bring every card back"
            return f"{total} cards, {shown} under IT and hardware, back to {total}"

        check("services filter", services_filter)

        def guide():
            page.goto(f"{base}/", wait_until="networkidle")
            page.mouse.wheel(0, 700)
            fab = page.get_by_role("button", name="Find the right software")
            expect(fab).to_be_visible(timeout=8000)
            fab.click()
            dialog = page.get_by_role("dialog", name="Quick guide: find the right software")
            expect(dialog).to_be_visible()
            for answer in ["Accounting and GST", "Two or more people", "One place"]:
                option = dialog.get_by_role("button", name=answer, exact=True)
                expect(option).to_be_visible(timeout=3000)
                option.click()
            expect(dialog).to_contain_text("TallyPrime Gold", timeout=3000)
            if shots:
                page.wait_for_timeout(400)
                dialog.screenshot(path=str(shots / "guide-result.png"))
            dialog.get_by_label("Your name").fill("Pawan")
            with ctx.expect_page() as popup_info:
                dialog.get_by_role("button", name="Send on WhatsApp").click()
            url = popup_info.value.url
            popup_info.value.close()
            text = parse_qs(urlparse(url).query).get("text", [""])[0]
            assert "wa.me" in url, f"unexpected target {url[:80]}"
            assert "TallyPrime" in text and "Pawan" in text, f"message missing product or name: {text!r}"
            page.keyboard.press("Escape")
            expect(dialog).to_be_hidden()
            return "3 answers -> TallyPrime Gold -> WhatsApp with product and name"

        check("quick guide", guide)

        def invoice_toggle():
            page.goto(f"{base}/tally-prime/", wait_until="networkidle")
            paper = page.locator("[data-mode]").filter(has=page.locator("table")).first
            paper.scroll_into_view_if_needed()
            expect(paper).to_have_attribute("data-mode", "custom")
            page.get_by_role("button", name="Standard Tally").click()
            expect(paper).to_have_attribute("data-mode", "standard")
            page.get_by_role("button", name="Customised by us").click()
            expect(paper).to_have_attribute("data-mode", "custom")
            return "standard and customised both render"

        check("invoice toggle", invoice_toggle)

        def explorer_tabs():
            tabs = page.get_by_role("tab")
            expect(tabs).to_have_count(5)
            expected = {
                "Production report": "Production against plan",
                "Barcode billing": "Scan",
                "Negative stock control": "Entry blocked",
                "Outstanding report": "Outstanding by party",
                "Invoice format": "Tax Invoice",
            }
            panel = page.get_by_role("tabpanel")
            for tab, text in expected.items():
                page.get_by_role("tab", name=tab).click()
                expect(page.get_by_role("tab", name=tab)).to_have_attribute("aria-selected", "true")
                expect(panel).to_contain_text(text)
            page.get_by_role("tab", name="Invoice format").focus()
            page.keyboard.press("ArrowDown")
            expect(page.get_by_role("tab", name="Production report")).to_be_focused()
            expect(page.get_by_role("tab", name="Production report")).to_have_attribute("aria-selected", "true")
            return "5 tabs, mouse and arrow keys"

        check("customisation explorer", explorer_tabs)

        def advisor():
            page.goto(f"{base}/", wait_until="networkidle")
            section = page.locator("section", has=page.get_by_role("heading", name=re.compile(r"^Silver or Gold")))
            expect(section).to_contain_text("TallyPrime Silver")
            section.get_by_text("Two or more people").click()
            expect(section).to_contain_text("TallyPrime Gold")
            expect(section).to_contain_text("₹67,500")
            section.get_by_text("More than one location").click()
            expect(section).to_contain_text("plan it together")
            return "Silver, Gold and consult paths"

        check("licence advisor", advisor)

        def enquiry():
            page.goto(f"{base}/contact/", wait_until="networkidle")
            page.get_by_role("button", name="Send on WhatsApp").click()
            expect(page.get_by_text("Enter your name.")).to_be_visible()
            expect(page.get_by_text("Choose what you need help with.")).to_be_visible()
            expect(page.get_by_label("Your name")).to_be_focused()
            page.get_by_label("Your name").fill("Pawan")
            page.get_by_label("Business name").fill("Pawan Engineering")
            page.get_by_label("Mobile number").fill("98250 00000")
            page.get_by_label("What do you need?").select_option("Tally customisation")
            page.get_by_label("Anything we should know?").fill("Need a production report.")
            with ctx.expect_page() as popup_info:
                page.get_by_role("button", name="Send on WhatsApp").click()
            url = popup_info.value.url
            popup_info.value.close()
            text = parse_qs(urlparse(url).query).get("text", [""])[0]
            assert "wa.me" in url, f"unexpected target {url[:80]}"
            assert "Tally customisation" in text and "Pawan Engineering" in text, f"message missing fields: {text!r}"
            expect(page.get_by_role("status").filter(has_text="WhatsApp")).to_contain_text("WhatsApp is open")
            return "errors shown, then WhatsApp opened with the message"

        check("enquiry form", enquiry)

        def mobile_menu():
            mobile = browser.new_context(viewport={"width": 390, "height": 844})
            m = mobile.new_page()
            m.goto(f"{base}/", wait_until="networkidle")
            m.get_by_role("button", name="Open menu").click()
            expect(m.locator("#mobile-menu")).to_be_visible()
            m.wait_for_timeout(600)
            if shots:
                m.screenshot(path=str(shots / "mobile-menu.png"))
            m.keyboard.press("Escape")
            expect(m.locator("#mobile-menu")).to_be_hidden()
            mobile.close()
            return "opens, Escape closes"

        check("mobile menu", mobile_menu)

        def reduced_motion():
            calm = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
            r = calm.new_page()
            r.goto(f"{base}/", wait_until="networkidle")
            slider = r.locator(ERP_SLIDER)
            slider.scroll_into_view_if_needed()
            r.mouse.move(5, 5)  # keep the pointer off the slider so hover cannot be the reason it stays put
            start = selected_slide(slider)
            r.wait_for_timeout(6000)  # longer than the 4.5 s autoplay delay
            after = selected_slide(slider)
            assert after == start, f"slider moved from {start} to {after} under reduced motion"
            scroll_through(r)
            hidden = r.evaluate(HIDDEN_TEXT_JS)
            calm.close()
            assert not hidden, f"{len(hidden)} hidden: {hidden[:3]}"
            return "slider stayed on its slide for 6 s, all text visible"

        check("reduced motion", reduced_motion)

        def no_js():
            # Page scripts are off, so the motion-ready class never lands; Playwright's evaluate still runs.
            plain = browser.new_context(viewport={"width": 1440, "height": 900}, java_script_enabled=False)
            n = plain.new_page()
            n.goto(f"{base}/", wait_until="load")
            assert not n.evaluate("document.documentElement.classList.contains('motion-ready')"), "motion-ready set without JS"
            hidden = n.evaluate(HIDDEN_TEXT_JS)
            if shots:
                n.screenshot(path=str(shots / "home-no-js.png"))
            plain.close()
            assert not hidden, f"{len(hidden)} hidden: {hidden[:3]}"
            return "every text element visible with scripts off"

        check("no JavaScript", no_js)

        if shots:

            def hero_frames():
                film = browser.new_context(viewport={"width": 1440, "height": 900})
                f = film.new_page()
                f.goto(f"{base}/", wait_until="commit")
                taken = []
                elapsed = 0
                for at in [100, 300, 500, 800, 1200, 1800]:
                    f.wait_for_timeout(at - elapsed)
                    elapsed = at
                    path = shots / f"hero-load-{at:04d}ms.png"
                    f.screenshot(path=str(path))
                    taken.append(path.name)
                film.close()
                return f"{len(taken)} frames"

            check("hero load frames", hero_frames)

        browser.close()

    width = max(len(name) for name, _, _ in results)
    for name, ok, detail in results:
        print(f"{'PASS' if ok else 'FAIL'}  {name.ljust(width)}  {detail}")
    return 0 if all(ok for _, ok, _ in results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
