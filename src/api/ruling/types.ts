export type MtgRulings = {
  data: MtgRuling[];
  has_more: boolean;
}

export interface MtgRuling {
  comment: string;
  oracle_id: string;
  published_at: Date;
  source: string;
}
