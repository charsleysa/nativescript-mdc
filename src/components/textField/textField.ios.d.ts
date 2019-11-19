import { Background } from 'tns-core-modules/ui/styling/background';
import { TextFieldBase } from './textField-common';
declare module '@nativescript/core/ui/text-field/text-field' {
    interface TextField {
        _updateAttributedPlaceholder(): any;
    }
}
export declare class TextField extends TextFieldBase {
    nativeViewProtected: MDCTextField;
    private _controller;
    readonly ios: MDCTextField;
    createNativeView(): MDCTextField;
    _getTextInsetsForBounds(insets: UIEdgeInsets): UIEdgeInsets;
    clearFocus(): void;
    requestFocus(): void;
    blur(): void;
    _redrawNativeBackground(value: Background): void;
}
