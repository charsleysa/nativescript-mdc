import { Background } from 'tns-core-modules/ui/styling/background';
import { Length } from 'tns-core-modules/ui/core/view';
import { ButtonBase } from './button-common';
export declare class Button extends ButtonBase {
    nativeViewProtected: MDCButton;
    readonly ios: MDCButton;
    createNativeView(): MDCButton;
    setCornerRadius(value: Length): void;
    _redrawNativeBackground(value: Background): void;
    _setNativeClipToBounds(): void;
}
