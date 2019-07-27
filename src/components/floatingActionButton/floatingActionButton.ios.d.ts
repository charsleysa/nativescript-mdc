import { FloatingActionButtonBase } from './floatingActionButton-common';
export declare class FloatingActionButton extends FloatingActionButtonBase {
    nativeViewProtected: MDCFloatingButton;
    private _templateImageWasCreated;
    readonly ios: MDCFloatingButton;
    createNativeView(): MDCFloatingButton;
    private setTintColor;
    _setNativeImage(nativeImage: UIImage): void;
}
