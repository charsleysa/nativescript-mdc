import { RippleBase } from './ripple-common';
export declare class Ripple extends RippleBase {
    nativeViewProtected: UIView;
    rippleController: MDCRippleTouchController;
    constructor();
    readonly ios: UIView;
    createNativeView(): UIView;
}
