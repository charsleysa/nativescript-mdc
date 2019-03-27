import { BottomNavigationBase, BottomNavigationTabBase } from './bottomNavigation-common';
export declare class BottomNavigation extends BottomNavigationBase {
    readonly android: any;
    createNativeView(): Object;
    initNativeView(): void;
    createTabs(tabs: BottomNavigationTab[]): void;
    private setTabColors;
    private enableItemShiftMode;
    private getResourceId;
    private getField;
    private setField;
    protected selectTabNative(index: number): void;
}
export declare class BottomNavigationTab extends BottomNavigationTabBase {
    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>);
}
