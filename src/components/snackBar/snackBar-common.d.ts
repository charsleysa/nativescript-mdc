import { View } from 'tns-core-modules/ui/core/view';
export interface SnackBarOptions {
    actionText?: string;
    message: string;
    hideDelay?: number;
    actionTextColor?: string;
    textColor?: string;
    backgroundColor?: string;
    maxLines?: number;
    isRTL?: boolean;
    view?: View;
}
export declare enum DismissReasons {
    SWIPE = "Swipe",
    ACTION = "Action",
    TIMEOUT = "Timeout",
    MANUAL = "Manual",
    CONSECUTIVE = "Consecutive"
}
export declare enum SnackBarAction {
    NONE = "None",
    DISMISS = "Dismiss"
}
export declare abstract class SnackBarBase {
    _options: SnackBarOptions;
    constructor(options?: SnackBarOptions);
    simple(message: string, textColor?: string, backgroundColor?: string, maxLines?: number, isRTL?: boolean, view?: View): Promise<any>;
    action(options: SnackBarOptions): any;
    showSnack(options: SnackBarOptions): any;
    abstract show(): any;
    abstract dismiss(): any;
    abstract initSnack(options: SnackBarOptions, resolve?: Function): any;
}
