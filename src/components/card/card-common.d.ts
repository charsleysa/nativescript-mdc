import { Color } from 'tns-core-modules/color/color';
import { ContentView, Property } from 'tns-core-modules/ui/content-view/content-view';
export { backgroundColorProperty, backgroundInternalProperty } from 'tns-core-modules/ui/core/view/view';
export declare class CardCommon extends ContentView {
    elevation: number;
    radius: number;
    ripple: boolean;
    strokeColor: string;
    strokeWidth: number;
}
export declare const radiusProperty: Property<CardCommon, number>;
export declare const elevationProperty: Property<CardCommon, number>;
export declare const rippleProperty: Property<CardCommon, boolean>;
export declare const strokeColorProperty: Property<CardCommon, Color>;
export declare const strokeWidthProperty: Property<CardCommon, number>;
