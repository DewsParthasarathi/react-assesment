import React from "react";
import Highcharts from "highcharts";
import * as HighchartsReactModule from "highcharts-react-official";

type UnknownRecord = Record<string, unknown>;

const mod = HighchartsReactModule as unknown as UnknownRecord;
const modDefault = mod.default as UnknownRecord | undefined;

// Safely resolve the HighchartsReact component across ESM/CJS environments
// Patch Highcharts SVGRenderer.prototype.html and SVGElement.prototype.updateTransform
// to ensure coordinates and rotation origins are valid finite numbers instead of NaN.
if (typeof Highcharts === "object" && Highcharts) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svgProto = (Highcharts.SVGElement?.prototype || {}) as Record<string, any>;
  const origUpdateTransform = svgProto.updateTransform;

  if (typeof origUpdateTransform === "function" && !svgProto._sanitizedTransform) {
    svgProto._sanitizedTransform = true;
    svgProto.updateTransform = function (attrib = "transform") {
      if (!Number.isFinite(this.translateX)) this.translateX = 0;
      if (!Number.isFinite(this.translateY)) this.translateY = 0;
      if (!Number.isFinite(this.rotation)) this.rotation = 0;
      if (!Number.isFinite(this.scaleX)) this.scaleX = 1;
      if (!Number.isFinite(this.scaleY)) this.scaleY = 1;
      if (this.x !== undefined && !Number.isFinite(this.x)) this.x = 0;
      if (this.y !== undefined && !Number.isFinite(this.y)) this.y = 0;
      if (this.rotationOriginX !== undefined && !Number.isFinite(this.rotationOriginX)) {
        this.rotationOriginX = undefined;
      }
      if (this.rotationOriginY !== undefined && !Number.isFinite(this.rotationOriginY)) {
        this.rotationOriginY = undefined;
      }

      origUpdateTransform.call(this, attrib);

      const target = this.foreignObject?.element || this.element;
      if (target && typeof target.getAttribute === "function") {
        const val = target.getAttribute(attrib);
        if (val && val.includes("NaN")) {
          target.setAttribute(attrib, val.replace(/NaN/g, "0"));
        }
      }
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renProto = (Highcharts.SVGRenderer?.prototype || {}) as Record<string, any>;
  const origHtml = renProto.html;
  if (typeof origHtml === "function" && !renProto._sanitizedHtml) {
    renProto._sanitizedHtml = true;
    renProto.html = function (str: string, x?: number, y?: number) {
      const safeX = typeof x === "number" && Number.isFinite(x) ? Math.round(x) : 0;
      const safeY = typeof y === "number" && Number.isFinite(y) ? Math.round(y) : 0;
      return origHtml.call(this, str, safeX, safeY);
    };
  }
}

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
  immutable?: boolean;
  allowChartUpdate?: boolean;
  updateArgs?: [boolean, boolean, boolean];
}>;

export interface ChartProps {
  options: Highcharts.Options;
  highcharts?: typeof Highcharts;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  immutable?: boolean;
  allowChartUpdate?: boolean;
  updateArgs?: [boolean, boolean, boolean];
}

export const Chart: React.FC<ChartProps> = ({
  options,
  highcharts = Highcharts,
  containerProps,
  immutable = true,
  allowChartUpdate = true,
  updateArgs = [true, true, true],
}) => {
  const Component = HighchartsReactComponent;
  return (
    <Component
      highcharts={highcharts}
      options={options}
      containerProps={containerProps}
      immutable={immutable}
      allowChartUpdate={allowChartUpdate}
      updateArgs={updateArgs}
    />
  );
};

export default Chart;
