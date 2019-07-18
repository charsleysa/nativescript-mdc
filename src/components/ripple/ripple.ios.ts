import { Color } from 'tns-core-modules/ui/page/page';

import { rippleColorProperty } from '../core/cssproperties';
import { getRippleColor, themer } from '../core/core';
import { getColor } from '../core/ios/utils';
import { RippleBase } from './ripple-common';

export class Ripple extends RippleBase {
    public nativeViewProtected: UIView;
    public rippleController: MDCRippleTouchController;

    constructor() {
        super();
    }

    get ios() {
        return this.nativeViewProtected;
    }

    public createNativeView() {
        const view = UIView.alloc().init();
        this.rippleController = MDCRippleTouchController.alloc().initWithView(view);

        const colorScheme = themer.appColorScheme as MDCSemanticColorScheme;
        this.rippleController.rippleView.rippleColor = getRippleColor(getColor(colorScheme.primaryColor));

        return view;
    }

    [rippleColorProperty.setNative](color: Color) {
        this.rippleController.rippleView.rippleColor = getRippleColor(color);
    }
}
