import { Background } from 'tns-core-modules/ui/styling/background';
import { ButtonBase } from './button-common';
export declare class Button extends ButtonBase {
    nativeViewProtected: MDCButton;
    readonly ios: MDCButton;
    createNativeView(): MDCButton;
    setCornerRadius(value: any): void;
    _redrawNativeBackground(value: Background): void;
    _setNativeClipToBounds(): void;
}
