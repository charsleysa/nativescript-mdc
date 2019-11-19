import { View } from 'tns-core-modules/ui/core/view';
import { MDCPageBase } from './page-common';
declare module '@nativescript/core/ui/action-bar' {
    interface ActionBar {
        readonly _getActualSize: {
            width: number;
            height: number;
        };
    }
}
declare module '@nativescript/core/ui/page' {
    interface Page {
        hasActionBar: boolean;
    }
}
export declare class MDCPage extends MDCPageBase {
    onLoaded(): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    _addViewToNativeVisualTree(child: View, atIndex: number): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
}
export declare function overridePage(): void;
export declare function install(): void;
