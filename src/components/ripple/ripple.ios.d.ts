import { RippleBase } from './ripple-common';
export declare class Ripple extends RippleBase {
    constructor();
    inkTouchController: MDCInkTouchController;
    readonly ios: MDCInkView;
    createNativeView(): UIView;
}
