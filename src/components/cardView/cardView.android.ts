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

import { isPostLollipop, createStateListAnimator, createRippleDrawable, getAttrColor, getDrawableForState, isPostLollipopMR1, state } from '../core/android/utils';
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
        view.setEnabled(true);
        view.setClickable(true); // Give it same default as iOS
        this.setRippleDrawable(view);
        return view;
    }

    getRippleColor() {
        return getRippleColor(this.style['rippleColor'] ? this.style['rippleColor'] : new Color(getAttrColor(this._context, 'colorOnSurface')));
    }

    setRippleDrawable(view: com.google.android.material.card.MaterialCardView) {
        if (this.interactable !== true) {
            this.rippleDrawable = undefined;
            return;
        }

        const foregroundDrawable = view.getForeground();

        if (foregroundDrawable instanceof android.graphics.drawable.LayerDrawable) {
            this.rippleDrawable = foregroundDrawable.getDrawable(0);
        } else {
            if (!this.rippleDrawable) {
                this.rippleDrawable = createRippleDrawable(this.getRippleColor(), Number(this.style.backgroundInternal.borderTopRightRadius) || 0);
            }

            const currentDrawable = view.getForeground();
            const drawableArray = Array.create(android.graphics.drawable.Drawable, 2);
            drawableArray[0] = this.rippleDrawable;
            drawableArray[1] = currentDrawable;
            const newForeground = new android.graphics.drawable.LayerDrawable(drawableArray);
            view.setForeground(newForeground);
            view.requestLayout();
        }
    }

    updateRippleColor() {
        if (this.rippleDrawable == null) {
            return;
        }

        const rippleColor = getRippleColor(this.rippleColor);
        if (this.rippleDrawable instanceof android.graphics.drawable.RippleDrawable) {
            this.rippleDrawable.setColor(android.content.res.ColorStateList.valueOf(rippleColor));
        } else if (this.rippleDrawable instanceof com.google.android.material.shape.MaterialShapeDrawable && (this.rippleDrawable as any).setFillColor != null) {
            (this.rippleDrawable as any).setFillColor(rippleColor);
        } else if (this.rippleDrawable instanceof android.graphics.drawable.StateListDrawable) {
            const rippleShape = getDrawableForState(this.rippleDrawable, state.pressed) as android.graphics.drawable.ShapeDrawable;
            rippleShape.getPaint().setColor(rippleColor);
        }

        this.nativeViewProtected.requestLayout();
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
        this.setRippleDrawable(this.nativeViewProtected);
        this.updateRippleColor();
    }

    [interactableProperty.getDefault]() {
        return this.nativeViewProtected.isClickable();
    }

    [rippleColorProperty.setNative](color: Color) {
        this.setRippleDrawable(this.nativeViewProtected);
        this.updateRippleColor();
    }

    [backgroundColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getCardBackgroundColor().getDefaultColor());
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setCardBackgroundColor(value.android);
        this.setRippleDrawable(this.nativeViewProtected);
        this.updateRippleColor();
    }

    [borderTopColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getStrokeColor());
    }

    [borderTopColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setStrokeColor(value.android);
        this.setRippleDrawable(this.nativeViewProtected);
        this.updateRippleColor();
    }

    [borderTopWidthProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getStrokeWidth() };
    }

    [borderTopWidthProperty.setNative](value: Length) {
        this.nativeViewProtected.setStrokeWidth(Length.toDevicePixels(value));
        this.setRippleDrawable(this.nativeViewProtected);
        this.updateRippleColor();
    }

    [borderTopRightRadiusProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getRadius() };
    }

    [borderTopRightRadiusProperty.setNative](value: Length) {
        this.nativeViewProtected.setRadius(Length.toDevicePixels(value));
        this.setRippleDrawable(this.nativeViewProtected);
        this.updateRippleColor();
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }
}
