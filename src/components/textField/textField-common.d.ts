import { CssProperty } from 'tns-core-modules/ui/core/properties';
import { TextField as NTextField } from 'tns-core-modules/ui/text-field/text-field';
import { Style } from 'tns-core-modules/ui/styling/style';
import { Color } from 'tns-core-modules/color/color';
export declare abstract class TextFieldBase extends NTextField {
    constructor();
    abstract requestFocus(): any;
    abstract clearFocus(): any;
    helper: string;
    maxLength: number;
    errorColor: Color;
    floating: boolean;
    placeholderColor: Color;
    variant: string;
    error: string;
    strokeColor: Color;
    floatingColor: Color;
}
export declare const errorColorProperty: CssProperty<Style, Color>;
export declare const helperProperty: CssProperty<Style, string>;
export declare const errorProperty: CssProperty<Style, string>;
export declare const maxLengthProperty: CssProperty<Style, number>;
export declare const floatingProperty: CssProperty<Style, boolean>;
export declare const floatingColorProperty: CssProperty<Style, Color>;
export declare const strokeColorProperty: CssProperty<Style, Color>;
