import { ActivityIndicatorBase } from './activityIndicator-common';
declare module '@nativescript/core/ui/core/view' {
    interface View {
        _onSizeChanged(): any;
    }
}
export declare class ActivityIndicator extends ActivityIndicatorBase {
    nativeViewProtected: MDCActivityIndicator;
    autoSize: boolean;
    readonly ios: MDCActivityIndicator;
    createNativeView(): MDCActivityIndicator;
    colorThemer: MDCSemanticColorScheme;
    getColorThemer(): MDCSemanticColorScheme;
}
