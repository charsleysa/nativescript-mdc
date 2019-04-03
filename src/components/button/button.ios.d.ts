import { ButtonBase } from './button-common';
export declare class Button extends ButtonBase {
    nativeViewProtected: MDCButton;
    readonly ios: MDCButton;
    applyShapeScheme(): void;
    createNativeView(): MDCButton;
    shapeScheme: MDCShapeScheme;
    private getShapeScheme;
    private setBottomLeftCornerRadius;
    private setBottomRightCornerRadius;
    private setTopLeftCornerRadius;
    private setTopRightCornerRadius;
    _setNativeClipToBounds(): void;
}
