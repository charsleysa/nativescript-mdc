import { ButtonBase } from './button-common';
export declare class Button extends ButtonBase {
    nativeViewProtected: com.google.android.material.button.MaterialButton;
    isLoading: boolean;
    readonly android: com.google.android.material.button.MaterialButton;
    createNativeView(): com.google.android.material.button.MaterialButton;
    setCornerRadius(value: any): void;
}
