import { Color } from 'tns-core-modules/color/color';
import { ViewBase } from 'tns-core-modules/ui/page/page';
import { applyMixins } from './material.common';
export { applyMixins };
export declare class Themer {
    getOrcreateAppColorScheme(): void;
    getAppColorScheme(): void;
    setPrimaryColor(value: string): void;
    setPrimaryColorVariant(value: string): void;
}
export declare const themer: Themer;
export declare function getRippleColor(color: string | Color): number;
export declare function createStateListAnimator(view: ViewBase, nativeView: android.view.View): void;
export declare function getAttrColor(context: android.content.Context, name: string): number;
export declare function createRippleDrawable(view: android.view.View, rippleColor: number, radius?: number): globalAndroid.graphics.drawable.StateListDrawable | globalAndroid.graphics.drawable.RippleDrawable;
export declare function install(): void;
export declare function isPostLollipop(): boolean;
export declare function isPostLollipopMR1(): boolean;
