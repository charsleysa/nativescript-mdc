import { Style } from 'tns-core-modules/ui/editable-text-base/editable-text-base';
import { TextFieldBase } from './textField.common';
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
    variant: string;
    createNativeView(): MDCTextField;
    dismissSoftInput(): void;
    readonly ios: MDCTextField;
    blur(): void;
}
