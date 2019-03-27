import { RippleBase } from './ripple-common';
export declare class Ripple extends RippleBase {
    nativeViewProtected: android.view.View;
    ripple: android.graphics.drawable.RippleDrawable;
    createNativeView(): org.nativescript.widgets.StackLayout;
    rippleDrawable: android.graphics.drawable.Drawable;
    getRippleColor(): any;
    setRippleDrawable(view: android.view.View): void;
}
