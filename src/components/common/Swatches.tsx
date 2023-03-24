import React from "react";

import { Interactive, Interaction } from "./Interactive";
import { Pointer } from "./Pointer";
import { hsvaToHslaString, hexToHsva } from "../../utils/convert";
import { formatClassName } from "../../utils/format";
import { clamp } from "../../utils/clamp";
import { round } from "../../utils/round";
import { HsvaColor } from "../../types";
import * as R from "remeda";

export type SwatchPresetColor = { color: string; title?: string } | string;
export interface SwatchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "color"> {
  selectedColor?: string;
  color: string;
  colors?: SwatchPresetColor[];
  onChange?: (hsva: HsvaColor) => void;
}

const Swatch = (props: SwatchProps) => {
  const { className, style, onChange } = props;
  const colors = R.take(props.colors || [], 28);

  const handleClick = (hex: string) => {
    onChange && onChange(hexToHsva(hex));
  };
  return (
    <div className={formatClassName(["react-colorful__swatches", className])} style={style}>
      {colors.map((color, i) => {
        const hex = typeof color === "string" ? color : color.color;
        const isWhite = (hex && hex.toLowerCase() === "#ffffff") || hex.toLowerCase() === "#fff";
        const title = typeof color === "string" ? undefined : color.title;
        const style = {
          backgroundColor: hex,
          border: `1px solid ${isWhite ? "#aaa" : hex}`,
        };
        return (
          <button
            key={i}
            className="react-colorful__swatch-button"
            style={style}
            onClick={() => handleClick(hex)}
            title={title}
          />
        );
      })}
    </div>
  );
};

Swatch.displayName = "Swatch";

export default Swatch;
