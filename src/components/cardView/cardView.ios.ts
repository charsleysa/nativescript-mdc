import { Color, Length } from 'tns-core-modules/ui/page/page';
import { backgroundColorProperty, backgroundInternalProperty } from 'tns-core-modules/ui/core/view/view';

import { elevationProperty, rippleColorProperty } from '../core/cssproperties';
import { getRippleColor, themer } from '../core/material';
import { getColor } from '../core/ios/utils';
import { CardViewBase, borderRadiusProperty, borderColorProperty, borderWidthProperty, interactableProperty } from './cardView-common';

export class CardView extends CardViewBase {
    nativeViewProtected: MDCCard;

    public createNativeView() {
        const view = MDCCard.new();
        const colorScheme = themer.getAppColorScheme();
        if (colorScheme) {
            MDCCardsColorThemer.applySemanticColorSchemeToCard(colorScheme, view);
        }
        return view;
    }
    _setNativeClipToBounds() {
        // this.ios.clipsToBounds = true;
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.backgroundColor = value !== undefined ? value.ios : new Color('#FFFFFF').ios;
    }

    [backgroundColorProperty.getDefault]() {
        return this.nativeViewProtected.backgroundColor;
    }

    [backgroundInternalProperty.setNative](value) {
        this.nativeViewProtected.backgroundColor = new Color(value.color !== undefined ? value.color + '' : '#FFFFFF').ios;
    }

    [backgroundInternalProperty.getDefault]() {
        return this.nativeViewProtected.backgroundColor;
    }

    [borderColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setBorderColorForState(value !== undefined ? value.ios : new Color('#FFFFFF').ios, UIControlState.Normal);
    }

    [borderColorProperty.getDefault](): Color {
        return getColor(this.nativeViewProtected.borderColorForState(UIControlState.Normal));
    }

    [borderRadiusProperty.setNative](value: number) {
        this.nativeViewProtected.cornerRadius = value;
    }

    [borderRadiusProperty.getDefault](): number {
        return this.nativeViewProtected.cornerRadius;
    }

    [borderWidthProperty.setNative](value: number) {
        this.nativeViewProtected.setBorderWidthForState(value, UIControlState.Normal);
    }

    [borderWidthProperty.getDefault](): number {
        return this.nativeViewProtected.borderWidthForState(UIControlState.Normal);
    }

    [elevationProperty.setNative](value: number) {
        this.nativeViewProtected.setShadowElevationForState(value, UIControlState.Normal);
        this.nativeViewProtected.setShadowElevationForState(value * 2, UIControlState.Highlighted);
    }

    [elevationProperty.getDefault]() {
        return this.nativeViewProtected.shadowElevationForState(UIControlState.Normal);
    }

    [interactableProperty.setNative](value: boolean) {
        this.nativeViewProtected.interactable = value;
    }

    [interactableProperty.getDefault](): boolean {
        return this.nativeViewProtected.interactable;
    }

    [rippleColorProperty.setNative](color: Color) {
        this.nativeViewProtected.inkView.inkColor = getRippleColor(color);
    }

    [rippleColorProperty.getDefault]() {
        return this.nativeViewProtected.inkView.inkColor;
    }
}
