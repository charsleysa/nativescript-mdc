import { Color } from 'tns-core-modules/color';
import {
    backgroundColorProperty,
    borderTopColorProperty,
    borderTopWidthProperty,
    borderTopRightRadiusProperty,
    Length
} from 'tns-core-modules/ui/core/view';
import { Background } from 'tns-core-modules/ui/styling/background';
import { layout } from 'tns-core-modules/utils/utils';

import { elevationProperty, rippleColorProperty, elevationHighlightedProperty } from '../core/cssproperties';
import { getRippleColor, themer } from '../core/core';
import { getColor } from '../core/ios/utils';
import { CardViewBase, interactableProperty } from './cardView-common';

// use custom class to get the same behavior as android which is
// highlight even if clicked on subview (which is not a control)
class Card extends MDCCard {
    touchesBeganWithEvent(touches, event) {
        super.touchesBeganWithEvent(touches, event);
        if (this.interactable) {
            this.highlighted = true;
        }
    }
    touchesEndedWithEvent(touches, event) {
        super.touchesEndedWithEvent(touches, event);
        this.highlighted = false;
    }
}

export class CardView extends CardViewBase {
    nativeViewProtected: MDCCard;

    public createNativeView() {
        const view = Card.new();
        const colorScheme = themer.appColorScheme;
        if (colorScheme) {
            MDCCardsColorThemer.applySemanticColorSchemeToCard(colorScheme, view);
        }
        view.enableRippleBehavior = true;
        return view;
    }
    _setNativeClipToBounds() {
        // this.ios.clipsToBounds = true;
    }

    [elevationProperty.setNative](value: number) {
        this.nativeViewProtected.setShadowElevationForState(value, UIControlState.Normal);
        if (this.elevationHighlighted == null) {
            this.nativeViewProtected.setShadowElevationForState(value * 2, UIControlState.Highlighted);
        }
    }

    [elevationProperty.getDefault]() {
        return this.nativeViewProtected.shadowElevationForState(UIControlState.Normal);
    }

    [elevationHighlightedProperty.setNative](value: number) {
        this.nativeViewProtected.setShadowElevationForState(value, UIControlState.Highlighted);
    }

    [elevationHighlightedProperty.getDefault]() {
        return this.nativeViewProtected.shadowElevationForState(UIControlState.Highlighted);
    }

    [interactableProperty.setNative](value: boolean) {
        this.nativeViewProtected.interactable = value;
    }

    [interactableProperty.getDefault](): boolean {
        return this.nativeViewProtected.interactable;
    }

    [rippleColorProperty.setNative](color: Color) {
        this.nativeViewProtected.rippleView.rippleColor = getRippleColor(color);
    }

    [rippleColorProperty.getDefault]() {
        return this.nativeViewProtected.rippleView.rippleColor;
    }

    [backgroundColorProperty.getDefault](): Color {
        return getColor(this.nativeViewProtected.backgroundColor);
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.backgroundColor = value.ios;
    }

    [borderTopColorProperty.getDefault](): Color {
        return getColor(this.nativeViewProtected.borderColorForState(UIControlState.Normal));
    }

    [borderTopColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setBorderColorForState(value.ios, UIControlState.Normal);
    }

    [borderTopWidthProperty.getDefault](): Length {
        return { unit: 'dip', value: this.nativeViewProtected.borderWidthForState(UIControlState.Normal) };
    }

    [borderTopWidthProperty.setNative](value: Length) {
        this.nativeViewProtected.setBorderWidthForState(layout.toDeviceIndependentPixels(Length.toDevicePixels(value, 0)), UIControlState.Normal);
    }

    [borderTopRightRadiusProperty.getDefault](): Length {
        return { unit: 'dip', value: this.nativeViewProtected.cornerRadius };
    }

    [borderTopRightRadiusProperty.setNative](value: Length) {
        this.nativeViewProtected.cornerRadius = layout.toDeviceIndependentPixels(Length.toDevicePixels(value, 0));
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }
}
