import { CardViewBase } from './cardView-common';
export declare class CardView extends CardViewBase {
    nativeViewProtected: android.support.design.card.MaterialCardView;
    rippleDrawable: android.graphics.drawable.Drawable;
    readonly android: android.support.design.card.MaterialCardView;
    createNativeView(): globalAndroid.support.design.card.MaterialCardView;
    getRippleColor(): any;
    setRippleDrawable(view: android.support.design.card.MaterialCardView): void;
}
