export type VerticalChartProps = {
  chartData: {
    name: string;
    data: number[];
    color: string;
  }[];
  categories: string[];
  chartHeight: number;
};

export type HorizontalChartProps = {
  chartData: {
    name: string;
    data: number[];
    color: string;
  }[];
  categories: string[];
  xAxisTitle: string;
  yAxisTitle: string;
  barHeight: string;
  clickHandle: (barId: number) => void;
};

export type PieDonutChartProps = {
  chartData: any[];
  labels: string[];
  headingText: string;
  height?: number;
  color: string[]
  tooltip:any[];
};

export type RadialCharProps = {
  chartData: {
    label: string[];
    color: string[];
  };
  reviewText: string;
};

export type LineChartProps = {
  headingText: string;
  chartData: {
    // data: string;
    name: string;
    yaxis: number[];
    xaxis: string[];
    color: string[];
    tooltip:any[];
  };
  showMinAndMaxValues?: boolean;
  formatText: string;
  height?: number;
};

export type VerticalBarChartProps = {
  chartData: {
    name: string;
    data: number[];
    color: string;
  }[];
  headingText: string;
  categories: string[];
  height?: number;
};

export type HorizontalBarChartProps = {
  chartData: {
    name: string;
    data: number[];
    color: string;
  };
  categories: string[];
  headingText: string;
  height?: number;
};
