import React from "react";
import Highcharts from "highcharts";
import * as HighchartsReactModule from "highcharts-react-official";

type UnknownRecord = Record<string, unknown>;

const mod = HighchartsReactModule as unknown as UnknownRecord;
const modDefault = mod.default as UnknownRecord | undefined;

// Safely resolve the HighchartsReact component across ESM/CJS environments
const HighchartsReactComponent = (
  mod.HighchartsReact ||
  modDefault?.HighchartsReact ||
  modDefault?.default ||
  mod.default ||
  mod
) as React.ComponentType<{
  options: Highcharts.Options;
  highcharts: typeof Highcharts;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}>;

export interface ChartProps {
  options: Highcharts.Options;
  highcharts?: typeof Highcharts;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Chart: React.FC<ChartProps> = ({
  options,
  highcharts = Highcharts,
  containerProps,
}) => {
  const Component = HighchartsReactComponent;
  return (
    <Component
      highcharts={highcharts}
      options={options}
      containerProps={containerProps}
    />
  );
};

export default Chart;
