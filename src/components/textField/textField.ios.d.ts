import { Style } from 'tns-core-modules/ui/styling/style';
import { TextFieldBase } from './textField-common';
declare module 'tns-core-modules/ui/text-field/text-field' {
    interface TextField {
        _updateAttributedPlaceholder(): any;
    }
}
export declare class TextField extends TextFieldBase {
    nativeViewProtected: MDCTextField;
    private _controller;
    readonly style: Style & {
        variant: 'outline' | 'underline' | 'filled';
    };
    clearFocus(): void;
    requestFocus(): void;
    _getTextInsetsForBounds(insets: UIEdgeInsets): UIEdgeInsets;
    createNativeView(): MDCTextField;
    readonly ios: MDCTextField;
    blur(): void;
}
