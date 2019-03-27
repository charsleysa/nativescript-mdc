import { View } from 'tns-core-modules/ui/core/view';
export interface SnackBarOptions {
    actionText: string;
    snackText: string;
    hideDelay: number;
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
    CONSECUTIVE = "Consecutive",
    UNKNOWN = "Unknown"
}
