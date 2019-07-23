import { Background } from 'tns-core-modules/ui/styling/background';
import { ButtonBase } from './button-common';
export declare class Button extends ButtonBase {
    nativeViewProtected: com.google.android.material.button.MaterialButton;
    isLoading: boolean;
    readonly android: com.google.android.material.button.MaterialButton;
    createNativeView(): com.google.android.material.button.MaterialButton;
    _redrawNativeBackground(value: Background): void;
}
