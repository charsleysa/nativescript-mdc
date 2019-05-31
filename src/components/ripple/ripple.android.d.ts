import { RippleBase } from './ripple-common';
export declare class Ripple extends RippleBase {
    nativeViewProtected: android.view.View;
    rippleDrawable: android.graphics.drawable.Drawable;
    createNativeView(): org.nativescript.widgets.StackLayout;
    getRippleColor(): any;
    setRippleDrawable(view: android.view.View): void;
}
