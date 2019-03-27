import { FloatingActionButtonBase } from './floatingActionButton-common';
export declare class FloatingActionButton extends FloatingActionButtonBase {
    nativeViewProtected: MDCFloatingButton;
    _setNativeImage(nativeImage: UIImage): void;
    createNativeView(): MDCFloatingButton;
}
