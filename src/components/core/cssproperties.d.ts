import { CssProperty } from 'tns-core-modules/ui/core/properties';
import { Color, Length } from 'tns-core-modules/ui/core/view';
import { Style } from 'tns-core-modules/ui/styling/style';
export declare const cssProperty: (target: Object, key: string | symbol) => void;
export declare const rippleColorProperty: CssProperty<Style, Color>;
export declare const elevationProperty: CssProperty<Style, Length>;
export declare const elevationHighlightedProperty: CssProperty<Style, Length>;
export declare const variantProperty: CssProperty<Style, string>;
