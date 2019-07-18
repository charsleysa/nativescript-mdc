import { ButtonBase } from './button-common';
export declare class Button extends ButtonBase {
    nativeViewProtected: MDCButton;
    readonly ios: MDCButton;
    createNativeView(): MDCButton;
    setCornerRadius(value: any): void;
    _setNativeClipToBounds(): void;
}
