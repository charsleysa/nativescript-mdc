import { SnackBarOptions } from './snackBar-common';
export declare class SnackBar {
    private _snackbar;
    private _isDismissedManual;
    simple(snackText: string): Promise<{}>;
    action(options: SnackBarOptions): Promise<{}>;
    dismiss(options: any): Promise<{}>;
}
