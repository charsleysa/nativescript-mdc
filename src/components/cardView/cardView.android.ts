import * as application from 'tns-core-modules/application/application';
import { Color, Length } from 'tns-core-modules/ui/page/page';
import { ad, layout } from 'tns-core-modules/utils/utils';
import { backgroundColorProperty, backgroundInternalProperty } from 'tns-core-modules/ui/core/view/view';

import { elevationProperty, rippleColorProperty } from '../core/cssproperties';
import { CardViewBase, borderColorProperty, borderRadiusProperty, borderWidthProperty, interactableProperty } from './cardView-common';

let BACKGROUND_DEFAULT_STATE_1: number[] = [android.R.attr.state_window_focused, android.R.attr.state_enabled];
let BACKGROUND_DEFAULT_STATE_2: number[] = [android.R.attr.state_enabled];
let BACKGROUND_SELECTED_STATE: number[] = [android.R.attr.state_window_focused, android.R.attr.state_enabled, android.R.attr.state_pressed];
let BACKGROUND_CHECKED_STATE: number[] = [android.R.attr.state_window_focused, android.R.attr.state_enabled, android.R.attr.state_checked];
let BACKGROUND_FOCUSED_STATE: number[] = [android.R.attr.state_focused, android.R.attr.state_window_focused, android.R.attr.state_enabled];
let BACKGROUND_DISABLED_STATE: number[] = [-android.R.attr.state_enabled];

export class CardView extends CardViewBase {
    nativeViewProtected: android.support.design.card.MaterialCardView;

    get android(): android.support.design.card.MaterialCardView {
        return this.nativeViewProtected;
    }
    private getSelectedItemDrawable(context: android.content.Context) {
        const ta = this._context.obtainStyledAttributes([ad.resources.getId(':attr/selectableItemBackground')]);
        const selectedItemDrawable = ta.getDrawable(0);
        ta.recycle();
        return selectedItemDrawable;
    }

    private createRoundRectShape() {
        const radius = this.borderRadius;
        const radii = Array.create('float', 8);
        for (let index = 0; index < 8; index++) {
            radii[index] = radius;
        }
        return new android.graphics.drawable.shapes.RoundRectShape(radii, null, null);
    }
    private createForegroundShapeDrawable() {
        const shape = this.createRoundRectShape();
        return new android.graphics.drawable.ShapeDrawable(shape);
    }
    // private createCompatRippleDrawable(rippleColor) {
    //     const rippleDrawable = new android.graphics.drawable.StateListDrawable()
    //     const foregroundShape = this.createForegroundShapeDrawable()
    //     foregroundShape.getPaint().setColor(rippleColor)
    //     rippleDrawable.addState([android.R.attr.state_pressed], foregroundShape)
    //     return rippleDrawable
    // }
    private createStateListAnimator(view: android.view.View) {
        const elevation = android.support.v4.view.ViewCompat.getElevation(view);
        const translationZ = android.support.v4.view.ViewCompat.getTranslationZ(view);
        const elevationSelected = elevation * 2; // for now to be the same as iOS
        const translationSelectedZ = translationZ * 2;
        const animationDuration = 100;
        const listAnimator = new android.animation.StateListAnimator();
        let animators = new java.util.ArrayList<android.animation.Animator>();
        let set = new android.animation.AnimatorSet();
        let animator = android.animation.ObjectAnimator.ofFloat(view, 'translationZ', [translationSelectedZ]);
        animators.add(animator);
        animator = android.animation.ObjectAnimator.ofFloat(view, 'elevation', [elevationSelected]);
        // animator.setDuration(0)
        animators.add(animator);
        set.playTogether(animators);
        set.setDuration(animationDuration);
        listAnimator.addState(BACKGROUND_SELECTED_STATE, set);

        animators.clear();
        set = new android.animation.AnimatorSet();
        animator = android.animation.ObjectAnimator.ofFloat(view, 'translationZ', [translationSelectedZ]);
        // animator.setDuration(animationDuration)
        animators.add(animator);
        animator = android.animation.ObjectAnimator.ofFloat(view, 'elevation', [elevationSelected]);
        // animator.setDuration(0)
        animators.add(animator);
        set.playTogether(animators);
        set.setDuration(animationDuration);
        listAnimator.addState(BACKGROUND_FOCUSED_STATE, set);

        animators.clear();
        set = new android.animation.AnimatorSet();
        animator = android.animation.ObjectAnimator.ofFloat(view, 'translationZ', [translationZ]);
        // animator.setDuration(animationDuration)
        // animator.setStartDelay(animationDuration)
        animators.add(animator);
        animator = android.animation.ObjectAnimator.ofFloat(view, 'elevation', [elevation]);
        // animator.setDuration(0)
        animators.add(animator);
        set.playTogether(animators);
        set.setDuration(animationDuration);
        set.setStartDelay(animationDuration);
        listAnimator.addState(BACKGROUND_DEFAULT_STATE_2, set);

        animators.clear();
        set = new android.animation.AnimatorSet();
        animator = android.animation.ObjectAnimator.ofFloat(view, 'translationZ', [translationZ]);
        // animator.setDuration(0)
        animators.add(animator);
        animator = android.animation.ObjectAnimator.ofFloat(view, 'elevation', [elevation]);
        animator.setDuration(0);
        animators.add(animator);
        set.playTogether(animators);
        set.setDuration(animationDuration);
        set.setStartDelay(animationDuration);
        listAnimator.addState([], set);

        view.setStateListAnimator(listAnimator);
    }

    public createNativeView() {
        // const newContext = new android.view.ContextThemeWrapper(this._context, ad.resources.getId('@style/Widget.MaterialComponents.CardView'));
        const view = new android.support.design.card.MaterialCardView(this._context);
        if (android.os.Build.VERSION.SDK_INT >= 21) {
            this.createStateListAnimator(view);
        }
        view.setClickable(true); // Give it same default as iOS
        this.setRippleDrawable(view);
        return view;
    }

    setRippleDrawable(view: android.support.design.card.MaterialCardView) {
        if (android.os.Build.VERSION.SDK_INT >= 23) {
            const currentDrawable = view.getForeground();
            const rippleDrawable = this.getSelectedItemDrawable(this._context);
            const drawableArray = Array.create(android.graphics.drawable.Drawable, 2);
            drawableArray[0] = rippleDrawable;
            drawableArray[1] = currentDrawable;
            const newForeground = new android.graphics.drawable.LayerDrawable(drawableArray);
            view.setForeground(newForeground);
            view.requestLayout();
        } else {
            //       view.setBackground(
            //         this.createCompatRippleDrawable(
            //           this.getRippleColor(this.style["rippleColor"] || 'red')
            //         )
            //       );
        }
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
            this.createStateListAnimator(this.nativeViewProtected);
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
        if (android.os.Build.VERSION.SDK_INT >= 23) {
            (this.nativeViewProtected.getForeground() as any).setColor(android.content.res.ColorStateList.valueOf(color.android));
        } else {
            this.setRippleDrawable(this.nativeViewProtected);
        }
    }
}
