import { BottomNavigationBase, BottomNavigationTabBase } from './bottomNavigation-common';
export declare class MDCBottomNavigationBarDelegate {
}
export declare class BottomNavigation extends BottomNavigationBase {
    nativeViewProtected: MDCBottomNavigationBar;
    private _delegate;
    readonly ios: any;
    createNativeView(): MDCBottomNavigationBar;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    layoutNativeView(left: number, top: number, right: number, bottom: number): void;
    createTabs(tabs: BottomNavigationTab[]): void;
    protected selectTabNative(index: number): void;
}
export declare class BottomNavigationTab extends BottomNavigationTabBase {
    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>);
}
