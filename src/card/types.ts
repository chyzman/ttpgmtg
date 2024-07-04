import { MtgCard } from "../api";

export class MtgCardHandler {
  private card: MtgCard;


  constructor(card: MtgCard) {
    this.card = card;
  }
}

export function autoSizeText(text: string, min: number = 20, max: number = 48) {
  return Math.max(min, Math.min(max, max / (text.length / 3)));
}

export function parseNumber(str: string): Numbers | undefined {
  return (Numbers as any)[str as keyof typeof Numbers];
}

enum Numbers {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
  five = 5,
  six = 6,
  seven = 7,
  eight = 8,
  nine = 9,
  ten = 10,
  eleven = 11,
  twelve = 12,
  thirteen = 13,
  fourteen = 14,
  fifteen = 15,
  sixteen = 16,
  seventeen = 17,
  eighteen = 18,
  nineteen = 19,
  twenty = 20
}
