import { CardViewBase } from './cardView-common';
export declare class CardView extends CardViewBase {
    nativeViewProtected: com.google.android.material.card.MaterialCardView;
    rippleDrawable: android.graphics.drawable.Drawable;
    readonly android: com.google.android.material.card.MaterialCardView;
    createNativeView(): com.google.android.material.card.MaterialCardView;
    getRippleColor(): any;
    setRippleDrawable(view: com.google.android.material.card.MaterialCardView): void;
}
