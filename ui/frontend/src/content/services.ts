/**
 * The four steps Next Solutions follows on every custom job.
 * Products and services themselves live in products.ts.
 */
export const processSteps = [
  {
    title: "Understand",
    body: "We sit with your team, see how the work happens today, and write down what needs to change.",
  },
  {
    title: "Design",
    body: "You see the layout or report format before anything is built, and sign off on it.",
  },
  {
    title: "Build and test",
    body: "We build it on a copy of your data and check it against real entries.",
  },
  {
    title: "Go live and support",
    body: "We install it, train your staff, and stay on call when something needs fixing.",
  },
] as const;
