import { TextFieldBase } from './textField-common';
export declare class TextField extends TextFieldBase {
    editText: android.support.design.widget.TextInputEditText;
    layoutView: android.support.design.widget.TextInputLayout;
    nativeViewProtected: android.support.design.widget.TextInputLayout;
    constructor();
    readonly nativeTextViewProtected: globalAndroid.support.design.widget.TextInputEditText;
    createNativeView(): globalAndroid.support.design.widget.TextInputLayout;
    focus(): boolean;
    blur(): void;
}
