export type CardIdentifier =
  | MtgCardIdentifierId
  | MtgCardIdentifierIllustrationId
  | MtgCardIdentifierMtgoId
  | MtgCardIdentifierMultiverseId
  | MtgCardIdentifierNameSet
  | MtgCardIdentifierOracleId
  | MtgCardIdentifierCollectorNumberSet;

export interface MtgCardIdentifierId {
  id: string;
}

export interface MtgCardIdentifierIllustrationId {
  illustration_id: string;
}

export interface MtgCardIdentifierMtgoId {
  mtgo_id: number;
}

export interface MtgCardIdentifierMultiverseId {
  multiverse_id: number;
}

export interface MtgCardIdentifierNameSet {
  name: string;
  set?: string;
}

export interface MtgCardIdentifierOracleId {
  oracle_id: string;
}

export interface MtgCardIdentifierCollectorNumberSet {
  collector_number: string;
  set: string;
}
