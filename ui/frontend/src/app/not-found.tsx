import { ButtonLink } from "@/components/ui/Button";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <PageIntro
      title="This page does not exist"
      lede="The link may be old, or the address mistyped. Everything we offer is a click away from the home page."
    >
      <ButtonLink href="/" size="lg">
        Go to the home page
      </ButtonLink>
    </PageIntro>
  );
}
