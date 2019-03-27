import { Color, Property } from 'tns-core-modules/ui/core/view';
import { CssProperty } from 'tns-core-modules/ui/core/properties';
import { Style } from 'tns-core-modules/ui/styling/style';
import { Slider as NSSlider } from 'tns-core-modules/ui/slider';
export declare abstract class SliderBase extends NSSlider {
    rippleColor: Color | string;
    trackBackgroundColor: Color | string;
    elevation: number;
    constructor();
}
export declare const thumbColorProperty: Property<SliderBase, Color>;
export declare const trackFillColorProperty: Property<SliderBase, Color>;
export declare const thumbHollowAtStartProperty: Property<SliderBase, boolean>;
export declare const trackBackgroundColorProperty: CssProperty<Style, Color>;
