/**
 * Which TallyPrime edition fits a business. Pure rules, no UI.
 *
 * Silver: one concurrent user on one computer.
 * Gold: several concurrent users on one office network (LAN).
 * More than one location working live on the same books needs a conversation:
 * Gold with cloud access, or TallyPrime Server for larger teams.
 */

import type { EditionId } from "@/content/tally";

export type UsersAtOnce = "one" | "several";
export type Locations = "one" | "several";

export type LicenceAnswers = {
  usersAtOnce: UsersAtOnce;
  locations: Locations;
};

export type LicenceAdvice =
  | { kind: "edition"; edition: EditionId; reason: string }
  | { kind: "consult"; reason: string };

export function adviseLicence(answers: LicenceAnswers): LicenceAdvice {
  if (answers.locations === "several") {
    return {
      kind: "consult",
      reason:
        "Several locations working on the same books usually need Gold with cloud access, or TallyPrime Server for larger teams. The right setup depends on how many people work at each place.",
    };
  }

  if (answers.usersAtOnce === "several") {
    return {
      kind: "edition",
      edition: "gold",
      reason: "Gold lets everyone on your office network work in Tally at the same time.",
    };
  }

  return {
    kind: "edition",
    edition: "silver",
    reason: "Silver covers one person at a time, and upgrades to Gold later without losing data.",
  };
}
