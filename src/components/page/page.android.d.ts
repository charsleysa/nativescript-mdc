import { View } from 'tns-core-modules/ui/page/page';
import { MDCPageBase } from './page-common';
declare module 'tns-core-modules/ui/page' {
    interface Page {
        updateActionBar(): any;
    }
}
export declare class MDCPage extends MDCPageBase {
    appBarLayout: com.google.android.material.appbar.AppBarLayout;
    nativeViewProtected: androidx.coordinatorlayout.widget.CoordinatorLayout;
    contentLayout: androidx.coordinatorlayout.widget.CoordinatorLayout;
    createNativeView(): androidx.coordinatorlayout.widget.CoordinatorLayout;
    onLoaded(): void;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
}
export declare function overridePage(): void;
export declare function install(): void;
