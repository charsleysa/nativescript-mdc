import * as utils from 'tns-core-modules/utils/utils';
import { backgroundInternalProperty, Color, Length } from 'tns-core-modules/ui/page/page';
import { Background } from 'tns-core-modules/ui/styling/background';

import { ButtonBase } from './button-common';
import { elevationHighlightedProperty, elevationProperty, rippleColorProperty } from '../core/cssproperties';
import { getEnabledColorStateList, getRippleColorStateList } from '../core/android/utils';
import { getRippleColor, createStateListAnimator } from '../core/core';

let PRE_LOLLIPOP: boolean = undefined;

function isPreLollipop() {
    if (PRE_LOLLIPOP === undefined) {
        PRE_LOLLIPOP = android.os.Build.VERSION.SDK_INT < 21;
    }
    return PRE_LOLLIPOP;
}

export class Button extends ButtonBase {
    nativeViewProtected: com.google.android.material.button.MaterialButton;

    public isLoading: boolean;

    get android(): com.google.android.material.button.MaterialButton {
        return this.nativeViewProtected;
    }

    public createNativeView() {
        let style = 'AppThemeMaterialButton';
        if (this.variant === 'text') {
            style = 'AppThemeTextMaterialButton';
        } else if (this.variant === 'outline') {
            style = 'AppThemeOutlinedMaterialButton';
        } else if (this.variant === 'flat') {
            style = 'AppThemeFlatMaterialButton';
        }
        const view = new com.google.android.material.button.MaterialButton(new android.view.ContextThemeWrapper(this._context, utils.ad.resources.getId(':style/' + style)));
        return view;
    }
    [rippleColorProperty.setNative](color: Color) {
        if (isPreLollipop()) {
            this.nativeViewProtected.setRippleColor(getRippleColorStateList(getRippleColor(color)));
        } else {
            this.nativeViewProtected.setRippleColor(android.content.res.ColorStateList.valueOf(color.android));
        }
    }

    [elevationProperty.setNative](value: number) {
        androidx.core.view.ViewCompat.setElevation(this.nativeViewProtected, value);
    }
    [elevationHighlightedProperty.setNative](value: number) {
        if (!this.nativeViewProtected) {
            return;
        }
        if (android.os.Build.VERSION.SDK_INT >= 21) {
            createStateListAnimator(this, this.nativeViewProtected);
        }
    }

    setCornerRadius(value) {
        const newValue = Length.toDevicePixels(typeof value === 'string' ? Length.parse(value) : value, 0);
        this.nativeViewProtected.setCornerRadius(newValue);
    }

    [backgroundInternalProperty.getDefault](): Background {
        const color = new Color(this.nativeViewProtected.getBackgroundTintList().getDefaultColor());
        const cornerRadius = this.nativeViewProtected.getCornerRadius();

        const background = this.style.backgroundInternal.withColor(color);
        background.borderTopLeftRadius = cornerRadius;
        background.borderTopRightRadius = cornerRadius;
        background.borderBottomLeftRadius = cornerRadius;
        background.borderBottomRightRadius = cornerRadius;

        return background;
    }
    [backgroundInternalProperty.setNative](value: android.graphics.drawable.Drawable | Background) {
        if (this.nativeViewProtected) {
            if (value instanceof android.graphics.drawable.Drawable) {
                this.nativeViewProtected.setBackgroundDrawable(value);
            } else {
                if (value.color) {
                    this.nativeViewProtected.setBackgroundTintList(getEnabledColorStateList(value.color.android, this.variant));
                }
                this.setCornerRadius(value.borderTopRightRadius);
            }
        }
    }
}
