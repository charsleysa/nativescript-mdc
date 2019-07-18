import { View } from 'tns-core-modules/ui/page/page';
import { MDCPageBase } from './page-common';
declare module 'tns-core-modules/ui/page' {
    interface Page {
        updateActionBar(): any;
    }
}
import AppBarLayout = com.google.android.material.appbar.AppBarLayout;
import CoordinatorLayout = androidx.coordinatorlayout.widget.CoordinatorLayout;
export declare class MDCPage extends MDCPageBase {
    appBarLayout: AppBarLayout;
    nativeViewProtected: CoordinatorLayout;
    contentLayout: CoordinatorLayout;
    createNativeView(): CoordinatorLayout;
    onLoaded(): void;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
}
export declare function overridePage(): void;
export declare function install(): void;
