import { SnackBarBase, SnackBarOptions } from './snackBar-common';
export { DismissReasons, SnackBarAction } from './snackBar-common';
export declare class SnackBar extends SnackBarBase {
    private static readonly SNACKBAR_TEXT_ID;
    private _snackbar;
    private _snackbarCallback;
    constructor(options?: SnackBarOptions);
    initSnack(options: SnackBarOptions, resolve?: Function): void;
    show(): Promise<{}>;
    dismiss(): Promise<{}>;
    private _setBackgroundColor;
    private _setTextColor;
}
export declare function showSnack(options: SnackBarOptions): any;
