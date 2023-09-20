export type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

export type CardsType = {
  cardIcon: string;
  cardText: string;
  cardCount: string;
  cardDescription: string;
  cardType: string;
  key: string;
}[];

export type CompanyFilterType = {
  displayText: string;
  isChecked: boolean;
}[];

export type TicketFilterDataType = {
  displayText: string;
  id: number;
}[];

export type FiltersType = {
  filterDrawer: boolean;
  calendarFilter: boolean;
  companyFilter: boolean;
  countryFilter: boolean;
  exportFilter: boolean;
  ticketFilter: boolean;
};

export type CardDrawersType = {
  isDrawerOpen: boolean;
  id: number;
}[];

export type DatesFilterType = {
  barOne: boolean;
  barTwo: boolean;
  barThree: boolean;
};

export type ExpandChartType = {
  ticketsByPriority: boolean;
  tickets: boolean;
  comparisonSheet: boolean;
  customerMetrics: boolean;
};

export type TicketsStepFilterType = string[];
