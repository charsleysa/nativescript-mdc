import { Color } from 'tns-core-modules/ui/page/page';
import { layout } from 'tns-core-modules/utils/utils';
import { backgroundInternalProperty } from 'tns-core-modules/ui/core/view/view';
import { Background } from 'tns-core-modules/ui/styling/background';

import { isPostLollipop } from '../core/android/utils';
import { elevationProperty, rippleColorProperty, elevationHighlightedProperty } from '../core/cssproperties';
import { createStateListAnimator, createRippleDrawable, getAttrColor, getRippleColor, isPostLollipopMR1 } from '../core/core';
import { CardViewBase, interactableProperty } from './cardView-common';

export class CardView extends CardViewBase {
    nativeViewProtected: com.google.android.material.card.MaterialCardView;
    rippleDrawable: android.graphics.drawable.Drawable;

    get android(): com.google.android.material.card.MaterialCardView {
        return this.nativeViewProtected;
    }

    public createNativeView() {
        const view = new com.google.android.material.card.MaterialCardView(this._context);
        if (isPostLollipop()) {
            createStateListAnimator(this, view);
        }
        view.setClickable(true); // Give it same default as iOS
        this.setRippleDrawable(view);
        return view;
    }

    getRippleColor() {
        return getRippleColor(this.style['rippleColor'] ? this.style['rippleColor'] : new Color(getAttrColor(this._context, 'colorControlHighlight')));
    }

    setRippleDrawable(view: com.google.android.material.card.MaterialCardView) {
        if (!this.rippleDrawable) {
            this.rippleDrawable = createRippleDrawable(view, this.getRippleColor(), layout.toDevicePixels(Number(this.borderRadius) || 0));
        }

        const currentDrawable = view.getForeground();
        const drawableArray = Array.create(android.graphics.drawable.Drawable, 2);
        drawableArray[0] = this.rippleDrawable;
        drawableArray[1] = currentDrawable;
        const newForeground = new android.graphics.drawable.LayerDrawable(drawableArray);
        view.setForeground(newForeground);
        view.requestLayout();
    }

    [backgroundInternalProperty.setNative](value: Background) {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.setCardBackgroundColor(new Color(value.color != null ? value.color + '' : '#FFFFFF').ios);
            this.nativeViewProtected.setStrokeWidth(value.borderTopWidth);
            this.nativeViewProtected.setStrokeColor(value.borderTopColor ? value.borderTopColor.android : -1);
            this.nativeViewProtected.setRadius(value.borderTopRightRadius);
            this.setRippleDrawable(this.nativeViewProtected);
        }
    }

    [elevationProperty.setNative](value: number) {
        androidx.core.view.ViewCompat.setElevation(this.nativeViewProtected, value);
        // Refresh state list animator if elevation changes
        if (isPostLollipop()) {
            createStateListAnimator(this, this.nativeViewProtected);
        }
    }

    [elevationProperty.getDefault](): number {
        return androidx.core.view.ViewCompat.getElevation(this.nativeViewProtected);
    }

    [elevationHighlightedProperty.setNative](value: number) {
        // Refresh state list animator if elevation changes
        if (isPostLollipop()) {
            createStateListAnimator(this, this.nativeViewProtected);
        }
    }

    [elevationHighlightedProperty.getDefault](): number {
        return androidx.core.view.ViewCompat.getElevation(this.nativeViewProtected) * 2;
    }

    [interactableProperty.setNative](value: boolean) {
        this.nativeViewProtected.setEnabled(value);
    }

    [interactableProperty.getDefault]() {
        return this.nativeViewProtected.isEnabled();
    }

    [rippleColorProperty.setNative](color: Color) {
        this.setRippleDrawable(this.nativeViewProtected);
        const rippleColor = getRippleColor(color);
        if (isPostLollipopMR1()) {
            (this.rippleDrawable as android.graphics.drawable.RippleDrawable).setColor(android.content.res.ColorStateList.valueOf(rippleColor));
        } else {
            (this.rippleDrawable as any).rippleShape.getPaint().setColor(rippleColor);
        }
    }
}
