import { ActivityIndicatorBase } from './activityIndicator-common';
export declare class ActivityIndicator extends ActivityIndicatorBase {
    nativeViewProtected: android.widget.ProgressBar;
    readonly android: android.widget.ProgressBar;
    createNativeView(): globalAndroid.widget.ProgressBar;
}
