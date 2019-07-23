import { AddChildFromBuilder, View } from 'tns-core-modules/ui/core/view/view';
import { CssProperty, Property } from 'tns-core-modules/ui/core/properties/properties';
import { EventData } from 'tns-core-modules/data/observable/observable';
import { Style } from 'tns-core-modules/ui/styling/style/style';
import { Color } from 'tns-core-modules/color/color';
export interface OnTabSelectedEventData extends EventData {
    oldIndex: number;
    newIndex: number;
}
export declare abstract class BottomNavigationBase extends View implements AddChildFromBuilder {
    tabs: BottomNavigationTabBase[];
    selectedTabIndex: number;
    titleVisibility: 'selected' | 'always' | 'never';
    activeColor: string | Color;
    inactiveColor: string | Color;
    selectTab(index: number): void;
    onTabSelected(index: number): void;
    _addChildFromBuilder(name: string, value: any): void;
    protected abstract selectTabNative(index: number): void;
}
declare module 'tns-core-modules/ui/styling/style' {
    interface Style {
        activeColor: Color;
        inactiveColor: Color;
    }
}
export declare const tabsProperty: Property<BottomNavigationBase, BottomNavigationTabBase[]>;
export declare const titleVisibilityProperty: Property<BottomNavigationBase, string>;
export declare const activeColorProperty: CssProperty<Style, Color>;
export declare const inactiveColorProperty: CssProperty<Style, Color>;
export declare class BottomNavigationTabBase {
    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>);
    private _title;
    title: string;
    private _icon;
    icon: string;
    private _selectedIcon;
    selectedIcon: string;
    private _selectable;
    selectable: boolean;
    private _parent?;
    parent: WeakRef<BottomNavigationBase>;
}
