import { BottomNavigationBase, BottomNavigationTabBase } from './bottomNavigation-common';
import BottomNavigationView = android.support.design.widget.BottomNavigationView;
export declare class BottomNavigation extends BottomNavigationBase {
    nativeViewProtected: BottomNavigationView;
    readonly android: any;
    createNativeView(): Object;
    initNativeView(): void;
    createTabs(tabs: BottomNavigationTab[]): void;
    private setTabColors;
    private getResourceId;
    private getField;
    private setField;
    protected selectTabNative(index: number): void;
}
export declare class BottomNavigationTab extends BottomNavigationTabBase {
    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>);
}
