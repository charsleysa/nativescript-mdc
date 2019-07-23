import { Color } from 'tns-core-modules/color';
import * as utils from 'tns-core-modules/utils/utils';
import { Background } from 'tns-core-modules/ui/styling/background';
import {
    backgroundColorProperty,
    borderTopRightRadiusProperty,
    Length
} from 'tns-core-modules/ui/core/view';

import { getEnabledColorStateList, getRippleColorStateList, createStateListAnimator } from '../core/android/utils';
import { elevationHighlightedProperty, elevationProperty, rippleColorProperty } from '../core/cssproperties';
import { getRippleColor } from '../core/core';
import { ButtonBase } from './button-common';

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
        } else if (this.variant === 'outlined') {
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

    [backgroundColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getBackgroundTintList().getDefaultColor());
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setBackgroundTintList(getEnabledColorStateList(value.android, this.variant));
    }

    [borderTopRightRadiusProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getCornerRadius() };
    }

    [borderTopRightRadiusProperty.setNative](value: Length) {
        this.nativeViewProtected.setCornerRadius(Length.toDevicePixels(value));
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }
}
