import { colorProperty, Color } from 'tns-core-modules/ui/core/view';
import { screen } from 'tns-core-modules/platform/platform';

import { themer } from '../core/core';
import { ActivityIndicatorBase, busyProperty } from './activityIndicator-common';

declare module '@nativescript/core/ui/core/view' {
    interface View {
        _onSizeChanged();
    }
}
export class ActivityIndicator extends ActivityIndicatorBase {
    nativeViewProtected: MDCActivityIndicator;
    autoSize = true;

    get ios(): MDCActivityIndicator {
        return this.nativeViewProtected;
    }
    createNativeView() {
        const view = MDCActivityIndicator.new();
        const colorScheme = this.colorThemer || themer.appColorScheme;
        if (colorScheme) {
            MDCActivityIndicatorColorThemer.applySemanticColorSchemeToActivityIndicator(colorScheme, view);
        }
        return view;
    }
    colorThemer: MDCSemanticColorScheme;
    getColorThemer() {
        if (!this.colorThemer) {
            this.colorThemer = MDCSemanticColorScheme.new();
        }
        return this.colorThemer;
    }

    [busyProperty.getDefault](): boolean {
        if ((<any>this.nativeViewProtected).isAnimating) {
            return (<any>this.nativeViewProtected).isAnimating();
        }
        else {
            return this.nativeViewProtected.animating;
        }
    }
    [busyProperty.setNative](value: boolean) {
        let nativeView = this.nativeViewProtected;
        if (value) {
            nativeView.startAnimating();
        } else {
            nativeView.stopAnimating();
        }
    }

    [colorProperty.getDefault](): UIColor {
        return null;
    }
    [colorProperty.setNative](value: UIColor | Color) {
        this.getColorThemer().primaryColor = value instanceof Color ? value.ios : value;
        MDCActivityIndicatorColorThemer.applySemanticColorSchemeToActivityIndicator(this.getColorThemer(), this.nativeViewProtected);
    }
}
