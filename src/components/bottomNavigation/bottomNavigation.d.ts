import { EventData } from 'tns-core-modules/data/observable/observable';
import { AddChildFromBuilder, View } from 'tns-core-modules/ui/core/view/view';

import { BottomNavigationBase, BottomNavigationTabBase, OnTabSelectedEventData } from './bottomNavigation-common';

export { OnTabSelectedEventData };

export declare class BottomNavigation extends BottomNavigationBase {

    readonly android: any; /* com.google.android.material.bottomnavigation.BottomNavigationView */

    readonly ios: any; /* MDCBottomNavigationBar */

    private _delegate;

    constructor();

    public createTabs(tabs: BottomNavigationTab[]): void;

    protected selectTabNative(index: number): void;
}

export declare class BottomNavigationTab extends BottomNavigationTabBase {
    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>);
}
