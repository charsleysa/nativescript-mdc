import { View } from 'tns-core-modules/ui/core/view';
import { DismissReasons, SnackBarOptions } from './snackBar-common';
export declare class SnackBar {
    private static SNACKBAR_TEXT_ID;
    private _snackbar;
    constructor();
    simple(snackText: string, textColor?: string, backgroundColor?: string, maxLines?: number, isRTL?: boolean, view?: View): Promise<any>;
    action(options: SnackBarOptions): Promise<{}>;
    dismiss(): Promise<{}>;
    _getReason(value: number): DismissReasons;
    private _setBackgroundColor;
    private _setTextColor;
}
