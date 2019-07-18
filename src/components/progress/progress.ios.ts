import { Color, heightProperty } from 'tns-core-modules/ui/core/view';
import { screen } from 'tns-core-modules/platform/platform';

import { themer } from '../core/core';
import { progressBackgroundColorProperty, ProgressBase, progressColorProperty } from './progress-common';

export class Progress extends ProgressBase {
    nativeViewProtected: MDCProgressView;

    constructor() {
        super();
        this.effectiveMinHeight = 2 * screen.mainScreen.scale;
    }

    public createNativeView() {
        const result = MDCProgressView.new();
        result.applyThemeWithScheme(themer.appScheme);
        return result;
    }

    [progressColorProperty.setNative](color: Color) {
        this.nativeViewProtected.progressTintColor = color ? color.ios : null;
    }
    [progressBackgroundColorProperty.setNative](color: Color) {
        this.nativeViewProtected.trackTintColor = color ? color.ios : null;
    }
}
