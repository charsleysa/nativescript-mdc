import { Color } from 'tns-core-modules/color';
import { layout } from 'tns-core-modules/utils/utils';
import {
    backgroundColorProperty,
    borderTopColorProperty,
    borderTopWidthProperty,
    borderTopRightRadiusProperty,
    Length
} from 'tns-core-modules/ui/core/view';
import { Background } from 'tns-core-modules/ui/styling/background';

import { isPostLollipop, createStateListAnimator, createRippleDrawable, getAttrColor, isPostLollipopMR1 } from '../core/android/utils';
import { elevationProperty, rippleColorProperty, elevationHighlightedProperty } from '../core/cssproperties';
import { getRippleColor } from '../core/core';
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
        return getRippleColor(this.style['rippleColor'] ? this.style['rippleColor'] : new Color(getAttrColor(this._context, 'colorOnSurface')));
    }

    setRippleDrawable(view: com.google.android.material.card.MaterialCardView) {
        if (!this.rippleDrawable) {
            this.rippleDrawable = createRippleDrawable(view, this.getRippleColor(), Number(this.style.backgroundInternal.borderTopRightRadius) || 0);
        }

        const currentDrawable = view.getForeground();
        const drawableArray = Array.create(android.graphics.drawable.Drawable, 2);
        drawableArray[0] = this.rippleDrawable;
        drawableArray[1] = currentDrawable;
        const newForeground = new android.graphics.drawable.LayerDrawable(drawableArray);
        view.setForeground(newForeground);
        view.requestLayout();
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
        this.nativeViewProtected.setClickable(value);
    }

    [interactableProperty.getDefault]() {
        return this.nativeViewProtected.isClickable();
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

    [backgroundColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getCardBackgroundColor().getDefaultColor());
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setCardBackgroundColor(value.android);
        this.setRippleDrawable(this.nativeViewProtected);
    }

    [borderTopColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getStrokeColor());
    }

    [borderTopColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setStrokeColor(value.android);
        this.setRippleDrawable(this.nativeViewProtected);
    }

    [borderTopWidthProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getStrokeWidth() };
    }

    [borderTopWidthProperty.setNative](value: Length) {
        this.nativeViewProtected.setStrokeWidth(Length.toDevicePixels(value));
        this.setRippleDrawable(this.nativeViewProtected);
    }

    [borderTopRightRadiusProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getRadius() };
    }

    [borderTopRightRadiusProperty.setNative](value: Length) {
        this.nativeViewProtected.setRadius(Length.toDevicePixels(value));
        this.setRippleDrawable(this.nativeViewProtected);
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }
}
