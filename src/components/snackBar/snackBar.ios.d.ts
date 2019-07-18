import { SnackBarBase, SnackBarOptions } from './snackBar-common';
export { DismissReasons, SnackBarAction } from './snackBar-common';
export declare class SnackBar extends SnackBarBase {
    private _snackbarManager;
    private _isDismissedManual;
    constructor(options?: SnackBarOptions);
    private _setBackgroundColor;
    private _setTextColor;
    simple(message: string, textColor?: string, backgroundColor?: string, maxLines?: number, isRTL?: boolean): Promise<any>;
    private _shown;
    private _message;
    show(): Promise<{}>;
    initSnack(options: SnackBarOptions, resolve?: Function): void;
    dismiss(): Promise<any>;
}
export declare function showSnack(options: SnackBarOptions): any;
