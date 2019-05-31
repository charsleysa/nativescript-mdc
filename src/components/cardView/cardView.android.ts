import * as application from 'tns-core-modules/application/application';
import { Color, Length } from 'tns-core-modules/ui/page/page';
import { ad, layout } from 'tns-core-modules/utils/utils';
import { backgroundColorProperty, backgroundInternalProperty } from 'tns-core-modules/ui/core/view/view';

import { elevationProperty, rippleColorProperty } from '../core/cssproperties';
import { createStateListAnimator, createRippleDrawable, getAttrColor, getRippleColor, isPostLollipopMR1 } from '../core/material';
import { CardViewBase, borderColorProperty, borderRadiusProperty, borderWidthProperty, interactableProperty } from './cardView-common';

export class CardView extends CardViewBase {
    nativeViewProtected: android.support.design.card.MaterialCardView;
    rippleDrawable: android.graphics.drawable.Drawable;

    get android(): android.support.design.card.MaterialCardView {
        return this.nativeViewProtected;
    }

    public createNativeView() {
        // const newContext = new android.view.ContextThemeWrapper(this._context, ad.resources.getId('@style/Widget.MaterialComponents.CardView'));
        const view = new android.support.design.card.MaterialCardView(this._context);
        if (android.os.Build.VERSION.SDK_INT >= 21) {
            createStateListAnimator(this, view);
        }
        view.setClickable(true); // Give it same default as iOS
        this.setRippleDrawable(view);
        return view;
    }

    getRippleColor() {
        return getRippleColor(this.style['rippleColor'] ? this.style['rippleColor'] : new Color(getAttrColor(this._context, 'colorControlHighlight')));
    }

    setRippleDrawable(view: android.support.design.card.MaterialCardView) {
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

    [backgroundColorProperty.setNative](value: Color) {
        try {
            this.nativeViewProtected.setCardBackgroundColor(value !== undefined ? value.android : new Color('#FFFFFF').android);
        } catch (error) {
            // do nothing, catch bad color value
            console.log('nativescript-mdc --- invalid background-color value:', error);
        }
    }

    [backgroundInternalProperty.setNative](value: any) {
        if (value) {
            try {
                this.nativeViewProtected.setCardBackgroundColor(
                    new Color(value.color !== undefined ? value.color + '' : '#FFFFFF').android
                );
            } catch (error) {
                // do nothing, catch bad color value
                console.log('nativescript-mdc --- invalid background-color value:', error);
            }
        }
    }

    [borderColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setStrokeColor(value !== undefined ? value.android : new Color('#FFFFFF').android);
        this.setRippleDrawable(this.nativeViewProtected);
    }

    [borderColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getStrokeColor());
    }

    [borderRadiusProperty.setNative](value: number) {
        this.nativeViewProtected.setRadius(layout.toDevicePixels(value));
        this.setRippleDrawable(this.nativeViewProtected);
    }

    [borderRadiusProperty.getDefault](): number {
        return layout.toDeviceIndependentPixels(this.nativeViewProtected.getRadius());
    }

    [borderWidthProperty.setNative](value: number) {
        this.nativeViewProtected.setStrokeWidth(layout.toDevicePixels(value));
        this.setRippleDrawable(this.nativeViewProtected);
    }

    [borderWidthProperty.getDefault](): number {
        return layout.toDeviceIndependentPixels(this.nativeViewProtected.getStrokeWidth());
    }

    [elevationProperty.setNative](value: number) {
        android.support.v4.view.ViewCompat.setElevation(this.nativeViewProtected, value);
        // Refresh state list animator if elevation changes
        if (android.os.Build.VERSION.SDK_INT >= 21) {
            createStateListAnimator(this, this.nativeViewProtected);
        }
    }

    [elevationProperty.getDefault](): number {
        return android.support.v4.view.ViewCompat.getElevation(this.nativeViewProtected);
    }

    [interactableProperty.setNative](value: boolean) {
        this.nativeViewProtected.setEnabled(value);
    }

    [interactableProperty.getDefault]() {
        return this.nativeViewProtected.isEnabled();
    }

    [rippleColorProperty.setNative](color: Color) {
        // if (android.os.Build.VERSION.SDK_INT >= 23) {
        //     (this.nativeViewProtected.getForeground() as any).setColor(android.content.res.ColorStateList.valueOf(color.android));
        // } else {
        //     this.setRippleDrawable(this.nativeViewProtected);
        // }
        this.setRippleDrawable(this.nativeViewProtected);
        const rippleColor = getRippleColor(color);
        if (isPostLollipopMR1()) {
            (this.rippleDrawable as android.graphics.drawable.RippleDrawable).setColor(android.content.res.ColorStateList.valueOf(rippleColor));
        } else {
            (this.rippleDrawable as any).rippleShape.getPaint().setColor(rippleColor);
        }
    }
}
