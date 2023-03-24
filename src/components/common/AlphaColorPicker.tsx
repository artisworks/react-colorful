import React, { useRef } from "react";

import { Hue } from "./Hue";
import { Saturation } from "./Saturation";
import { Alpha } from "./Alpha";

import { ColorModel, ColorPickerBaseProps, AnyColor, HsvaColor } from "../../types";
import { useColorManipulation } from "../../hooks/useColorManipulation";
import { useStyleSheet } from "../../hooks/useStyleSheet";
import { formatClassName } from "../../utils/format";
import Swatches from "./Swatches";
import { hexToHsva, hsvaToHex } from "../../utils/convert";
import { HexColorInput } from "../HexColorInput";

interface Props<T extends AnyColor> extends Partial<ColorPickerBaseProps<T>> {
  colorModel: ColorModel<T>;
  swatchColors?: string[];
  toggleOptions?: {
    label: string;
    isToggled: boolean;
    onToggle: () => void;
  }[];
  onSave?: (hexColor: string) => void;
  onCancel?: () => void;
}

export const AlphaColorPicker = <T extends AnyColor>({
  className,
  colorModel,
  swatchColors,
  toggleOptions,
  onSave,
  onCancel,
  color = colorModel.defaultColor,
  onChange,
  ...rest
}: Props<T>): JSX.Element => {
  const nodeRef = useRef<HTMLDivElement>(null);
  useStyleSheet(nodeRef);

  const [hsva, updateHsva] = useColorManipulation<T>(colorModel, color, onChange);
  const [hex, setHex] = React.useState(hsvaToHex(hsva));

  const nodeClassName = formatClassName(["react-colorful", className]);

  const handleColorChange = (newColor: Partial<HsvaColor>) => {
    updateHsva(newColor);
    setHex(hsvaToHex(hsva));
  };

  return (
    <div {...rest} ref={nodeRef} className={nodeClassName}>
      <Saturation hsva={hsva} onChange={handleColorChange} />
      <Hue hue={hsva.h} onChange={handleColorChange} />
      <Swatches
        color={hex}
        colors={swatchColors}
        onChange={(newColor) => {
          updateHsva(newColor);
          setHex(hsvaToHex(newColor));
        }}
      />
      {toggleOptions && (
        <div className="react-colorful__toggle-options">
          {toggleOptions.map((option) => (
            <div
              onClick={option.onToggle}
              key={option.label}
              className="react-colorful__toggle-option"
            >
              <label>{option.label}</label>
              <input type="checkbox" checked={option.isToggled} onChange={option.onToggle} />
            </div>
          ))}
        </div>
      )}
      <div className="react-colorful__hex-input-container">
        <HexColorInput
          color={hex}
          prefixed
          onChange={(hex) => {
            setHex(hex);
            updateHsva(hexToHsva(hex));
          }}
        />
      </div>

      <div className="react-colorful__action-buttons">
        <button onClick={() => onSave && onSave(hex)}>Save</button>
        <button onClick={() => onCancel && onCancel()}>Cancel</button>
      </div>
    </div>
  );
};
