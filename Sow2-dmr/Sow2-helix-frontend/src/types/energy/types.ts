export type EnergyCardType = {
  iconColor: string;
  iconBackground: string;
  rangeColor: string;
  consumption: string;
};

export type ConsumptionEnergyType = {
  iconColor: string;
  iconBackground: string;
  text: string;
};
export const enum CardTypeValue {
  Good = "good",
  Average = "average",
  Bad = "bad",
}

export type ImpactCardType = {
  cardText: string;
  cardType: CardTypeValue;
};
