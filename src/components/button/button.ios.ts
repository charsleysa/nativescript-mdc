import { Color } from 'tns-core-modules/color';
import { Background } from 'tns-core-modules/ui/styling/background';
import { Font } from 'tns-core-modules/ui/styling/font';
import {
    backgroundColorProperty,
    borderTopRightRadiusProperty,
    fontInternalProperty,
    Length
} from 'tns-core-modules/ui/core/view';

import { elevationHighlightedProperty, elevationProperty, rippleColorProperty } from '../core/cssproperties';
import { themer, getRippleColor } from '../core/core';
import { getColor } from '../core/ios/utils';
import { ButtonBase } from './button-common';

export class Button extends ButtonBase {
    nativeViewProtected: MDCButton;

    get ios(): MDCButton {
        return this.nativeViewProtected;
    }

    public createNativeView() {
        const view = MDCButton.new();

        if (this.variant === 'text') {
            view.applyTextThemeWithScheme(themer.appScheme);
        } else if (this.variant === 'flat') {
            view.applyContainedThemeWithScheme(themer.appScheme);
            view.setElevationForState(MDCShadowElevationNone, UIControlState.Normal);
            view.setElevationForState(MDCShadowElevationNone, UIControlState.Highlighted);
            view.setElevationForState(MDCShadowElevationNone, UIControlState.Disabled);
        } else if (this.variant === 'outlined') {
            view.applyOutlinedThemeWithScheme(themer.appScheme);
        } else {
            view.applyContainedThemeWithScheme(themer.appScheme);
        }

        // view.addTargetActionForControlEvents(this['_tapHandler'], 'tap', UIControlEvents.TouchUpInside);
        return view;
    }

    [rippleColorProperty.setNative](color: Color) {
        this.nativeViewProtected.inkColor = getRippleColor(color);
    }

    [elevationProperty.setNative](value: number) {
        this.nativeViewProtected.setElevationForState(value, UIControlState.Normal);
        if (this.elevationHighlighted === undefined) {
            this.nativeViewProtected.setElevationForState(value * 2, UIControlState.Highlighted);
        }
    }
    [elevationHighlightedProperty.setNative](value: number) {
        this.nativeViewProtected.setElevationForState(value, UIControlState.Highlighted);
    }

    [fontInternalProperty.setNative](value: Font | UIFont) {
        if (!(value instanceof Font) || !this.formattedText) {
            const nativeView = this.nativeViewProtected;
            const font = value instanceof Font ? value.getUIFont(nativeView.font) : value;
            nativeView.setTitleFontForState(font, UIControlState.Normal);
        }
    }

    [backgroundColorProperty.getDefault](): Color {
        return getColor(this.nativeViewProtected.backgroundColorForState(UIControlState.Normal));
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setBackgroundColorForState(value.ios, UIControlState.Normal);
        if (this.variant === 'outline') {
            this.nativeViewProtected.setBackgroundColorForState(new Color('transparent').ios, UIControlState.Disabled);
        }
    }

    [borderTopRightRadiusProperty.getDefault](): Length {
        const cornerTreatment = (themer.appScheme.shapeScheme as MDCShapeScheme).smallComponentShape.topRightCorner;
        const cornerRadius = (cornerTreatment.class() === MDCRoundedCornerTreatment.class())
            ? (cornerTreatment as MDCRoundedCornerTreatment).radius
            : (cornerTreatment.class() === MDCRoundedCornerTreatment.class())
                ? (cornerTreatment as MDCCutCornerTreatment).cut
                : 0;
        return { unit: 'px', value: cornerRadius };
    }

    [borderTopRightRadiusProperty.setNative](value: Length) {
        this.setCornerRadius(value);
    }

    setCornerRadius(value) {
        const newValue = Length.toDevicePixels(typeof value === 'string' ? Length.parse(value) : value, 0);
        const shapeScheme = MDCShapeScheme.new();
        shapeScheme.smallComponentShape = MDCShapeCategory.alloc().initCornersWithFamilyAndSize(MDCShapeCornerFamily.Rounded, newValue);
        MDCButtonShapeThemer.applyShapeSchemeToButton(shapeScheme, this.nativeViewProtected);
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }

    _setNativeClipToBounds() {
        // const backgroundInternal = this.style.backgroundInternal;
        // this.nativeViewProtected.clipsToBounds =
        //     this.nativeViewProtected instanceof UIScrollView ||
        //     backgroundInternal.hasBorderWidth() ||
        //     backgroundInternal.hasBorderRadius();
    }
}
