/** Amounts in words, Indian system (Crore, Lakh, Thousand, Hundred), as printed on invoices and cheques. */

const ones = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function belowHundred(n: number): string {
  if (n < 20) return ones[n] ?? "";
  const unit = n % 10;
  return `${tens[Math.floor(n / 10)]}${unit ? ` ${ones[unit]}` : ""}`;
}

function belowThousand(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${ones[hundreds]} Hundred` : "", rest ? belowHundred(rest) : ""].filter(Boolean).join(" ");
}

/** Whole rupees in words, without "Rupees" or "Only". */
export function integerInWords(n: number): string {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`Cannot spell ${n}`);
  if (n === 0) return "Zero";
  const crore = Math.floor(n / 10_000_000);
  const lakh = Math.floor((n % 10_000_000) / 100_000);
  const thousand = Math.floor((n % 100_000) / 1000);
  const rest = n % 1000;
  return [
    crore ? `${integerInWords(crore)} Crore` : "",
    lakh ? `${belowHundred(lakh)} Lakh` : "",
    thousand ? `${belowHundred(thousand)} Thousand` : "",
    rest ? belowThousand(rest) : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** 11780000 paise -> "Rupees One Lakh Seventeen Thousand Eight Hundred Only". */
export function amountInWords(paise: number): string {
  if (!Number.isInteger(paise) || paise < 0) throw new RangeError(`Cannot spell ${paise} paise`);
  const fraction = paise % 100;
  const paisePart = fraction ? ` and ${belowHundred(fraction)} Paise` : "";
  return `Rupees ${integerInWords(Math.floor(paise / 100))}${paisePart} Only`;
}
