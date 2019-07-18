import { Color } from 'tns-core-modules/ui/page/page';
import { backgroundInternalProperty } from 'tns-core-modules/ui/core/view/view';
import { Background } from 'tns-core-modules/ui/styling/background';
import { layout } from 'tns-core-modules/utils/utils';

import { elevationProperty, rippleColorProperty, elevationHighlightedProperty } from '../core/cssproperties';
import { getRippleColor, themer } from '../core/core';
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

    [backgroundInternalProperty.setNative](value: Background) {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.backgroundColor = new Color(value.color != null ? value.color + '' : '#FFFFFF').ios;
            this.nativeViewProtected.setBorderWidthForState(layout.toDeviceIndependentPixels(value.borderTopWidth), UIControlState.Normal);
            this.nativeViewProtected.setBorderColorForState(value.borderTopColor ? value.borderTopColor.ios : null, UIControlState.Normal);
            this.nativeViewProtected.cornerRadius = layout.toDeviceIndependentPixels(value.borderTopRightRadius);
        }
    }

    [backgroundInternalProperty.getDefault]() {
        return this.nativeViewProtected.backgroundColor;
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
}
