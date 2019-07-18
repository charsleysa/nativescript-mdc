import { Background } from 'tns-core-modules/ui/styling/background';
import { TextFieldBase } from './textField-common';
declare module 'tns-core-modules/ui/text-field/text-field' {
    interface TextField {
        _redrawNativeBackground(value: android.graphics.drawable.Drawable | Background): void;
    }
}
export declare function initTextInputEditText(): void;
export declare function getDefaultHintTextColorStateList(pressedColor: number, color?: number): globalAndroid.content.res.ColorStateList;
export declare class TextField extends TextFieldBase {
    editText: com.google.android.material.textfield.TextInputEditText;
    layoutView: com.google.android.material.textfield.TextInputLayout;
    constructor();
    readonly nativeTextViewProtected: com.google.android.material.textfield.TextInputEditText;
    drawingBackground: boolean;
    readonly nativeViewProtected: com.google.android.material.textfield.TextInputEditText | com.google.android.material.textfield.TextInputLayout;
    createNativeView(): com.google.android.material.textfield.TextInputLayout;
    _redrawNativeBackground(value: android.graphics.drawable.Drawable | Background): void;
    requestFocus(): boolean;
    clearFocus(): void;
}
