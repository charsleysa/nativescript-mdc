import { Background } from 'tns-core-modules/ui/styling/background';
import { backgroundInternalProperty, Color, fontInternalProperty, Length } from 'tns-core-modules/ui/page/page';
import { Font } from 'tns-core-modules/ui/styling/font';

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
        } else if (this.variant === 'outline') {
            view.applyOutlinedThemeWithScheme(themer.appScheme);
        } else {
            view.applyContainedThemeWithScheme(themer.appScheme);
        }

        // view.addTargetActionForControlEvents(this['_tapHandler'], 'tap', UIControlEvents.TouchUpInside);
        return view;
    }

    [rippleColorProperty.setNative](color: Color) {
        ((this.nativeViewProtected as any).rippleView as MDCStatefulRippleView).rippleColor = getRippleColor(color);
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

    setCornerRadius(value) {
        const newValue = Length.toDevicePixels(typeof value === 'string' ? Length.parse(value) : value, 0);
        const shapeScheme = MDCShapeScheme.new();
        shapeScheme.smallComponentShape = MDCShapeCategory.alloc().initCornersWithFamilyAndSize(MDCShapeCornerFamily.Rounded, newValue);
        MDCButtonShapeThemer.applyShapeSchemeToButton(shapeScheme, this.nativeViewProtected);
    }

    [backgroundInternalProperty.getDefault](): Background {
        const color = getColor(this.nativeViewProtected.backgroundColorForState(UIControlState.Normal));
        const cornerTreatment = (themer.appScheme.shapeScheme as MDCShapeScheme).smallComponentShape.topRightCorner;
        const cornerRadius = (cornerTreatment.class() === MDCRoundedCornerTreatment.class())
            ? (cornerTreatment as MDCRoundedCornerTreatment).radius
            : (cornerTreatment.class() === MDCRoundedCornerTreatment.class())
                ? (cornerTreatment as MDCCutCornerTreatment).cut
                : 0;

        const background = this.style.backgroundInternal.withColor(color);
        background.borderTopLeftRadius = cornerRadius;
        background.borderTopRightRadius = cornerRadius;
        background.borderBottomLeftRadius = cornerRadius;
        background.borderBottomRightRadius = cornerRadius;

        return background;
    }

    [backgroundInternalProperty.setNative](value: Background) {
        if (this.nativeViewProtected) {
            if (value.color) {
                this.nativeViewProtected.setBackgroundColorForState(value.color.ios, UIControlState.Normal);
                if (this.variant === 'outline') {
                    this.nativeViewProtected.setBackgroundColorForState(new Color('transparent').ios, UIControlState.Disabled);
                }
            }
            this.setCornerRadius(value.borderTopRightRadius);
        }
    }
    _setNativeClipToBounds() {
        // const backgroundInternal = this.style.backgroundInternal;
        // this.nativeViewProtected.clipsToBounds =
        //     this.nativeViewProtected instanceof UIScrollView ||
        //     backgroundInternal.hasBorderWidth() ||
        //     backgroundInternal.hasBorderRadius();
    }

    [fontInternalProperty.setNative](value: Font | UIFont) {
        if (!(value instanceof Font) || !this.formattedText) {
            const nativeView = this.nativeViewProtected;
            const font = value instanceof Font ? value.getUIFont(nativeView.font) : value;
            nativeView.setTitleFontForState(font, UIControlState.Normal);
        }
    }
}
