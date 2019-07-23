import { Background } from 'tns-core-modules/ui/styling/background';
import { TextFieldBase } from './textField-common';
declare module 'tns-core-modules/ui/text-field/text-field' {
    interface TextField {
        _redrawNativeBackground(value: android.graphics.drawable.Drawable | Background): void;
    }
}
export declare function getDefaultHintTextColorStateList(pressedColor: number, color?: number): globalAndroid.content.res.ColorStateList;
export declare class TextField extends TextFieldBase {
    editText: com.google.android.material.textfield.TextInputEditText;
    nativeViewProtected: com.google.android.material.textfield.TextInputLayout;
    readonly nativeTextViewProtected: com.google.android.material.textfield.TextInputEditText;
    readonly android: com.google.android.material.textfield.TextInputLayout;
    constructor();
    createNativeView(): com.google.android.material.textfield.TextInputLayout;
    requestFocus(): boolean;
    clearFocus(): void;
    setCorners(): void;
    _redrawNativeBackground(value: Background): void;
}
