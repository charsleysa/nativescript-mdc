import { CardViewBase } from './cardView-common';
export declare class CardView extends CardViewBase {
    nativeViewProtected: android.support.design.card.MaterialCardView;
    readonly android: android.support.design.card.MaterialCardView;
    private getSelectedItemDrawable;
    private createRoundRectShape;
    private createForegroundShapeDrawable;
    private createStateListAnimator;
    createNativeView(): globalAndroid.support.design.card.MaterialCardView;
    setRippleDrawable(view: android.support.design.card.MaterialCardView): void;
}
