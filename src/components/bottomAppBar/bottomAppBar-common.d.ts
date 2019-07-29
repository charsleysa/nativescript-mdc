export * from 'tns-core-modules/ui/core/view';
import { View, ViewBase, Property } from 'tns-core-modules/ui/core/view';
import { BottomAppBar as BottomAppBarDefinition, ActionItems as ActionItemsDefinition, ActionItem as ActionItemDefinition, MainActionButton as MainActionButtonDefinition, NavigationButton, IOSActionItemSettings, AndroidActionItemSettings } from './bottomAppBar';
declare module 'tns-core-modules/data/observable' {
    interface Observable {
        _emit(eventNames: string): void;
    }
}
declare module 'tns-core-modules/ui/core/view-base/view-base' {
    interface ViewBase {
        _defaultPaddingTop: number;
        _defaultPaddingRight: number;
        _defaultPaddingBottom: number;
        _defaultPaddingLeft: number;
        _isPaddingRelative: boolean;
    }
}
export declare class BottomAppBarBase extends View implements BottomAppBarDefinition {
    private _actionItems;
    private _mainActionButton;
    private _navigationButton;
    mainActionButton: MainActionButtonBase;
    navigationButton: NavigationButton;
    actionItems: ActionItems;
    readonly ios: any;
    readonly android: any;
    readonly _childrenCount: number;
    constructor();
    update(): void;
    _addArrayFromBuilder(name: string, value: Array<any>): void;
    eachChildView(callback: (child: View) => boolean): void;
    eachChild(callback: (child: ViewBase) => boolean): void;
    _isEmpty(): boolean;
}
export declare class ActionItems implements ActionItemsDefinition {
    private _items;
    private _bottomAppBar;
    constructor(bottomAppBar: BottomAppBarDefinition);
    addItem(item: ActionItemDefinition): void;
    removeItem(item: ActionItemDefinition): void;
    getItems(): Array<ActionItemDefinition>;
    getVisibleItems(): Array<ActionItemDefinition>;
    getItemAt(index: number): ActionItemDefinition;
    setItems(items: Array<ActionItemDefinition>): void;
    private invalidate;
}
export declare class ActionItemBase extends ViewBase implements ActionItemDefinition {
    static tapEvent: string;
    private _bottomAppBar;
    private _actionView;
    ios: IOSActionItemSettings;
    android: AndroidActionItemSettings;
    text: string;
    icon: string;
    visibility: string;
    actionView: View;
    bottomAppBar: BottomAppBarDefinition;
    onLoaded(): void;
    _raiseTap(): void;
    _addChildFromBuilder(name: string, value: any): void;
    _onVisibilityChanged(visibility: string): void;
    eachChild(callback: (child: ViewBase) => boolean): void;
}
export declare class MainActionButtonBase extends ViewBase implements MainActionButtonDefinition {
    static tapEvent: string;
    private _bottomAppBar;
    text: string;
    icon: string;
    visibility: string;
    bottomAppBar: BottomAppBarDefinition;
    _raiseTap(): void;
    _onVisibilityChanged(visibility: string): void;
}
export declare function isVisible(item: ActionItemDefinition | MainActionButtonBase): boolean;
export declare function traceMissingIcon(icon: string): void;
export declare const actionItemTextProperty: Property<ActionItemBase, string>;
export declare const actionItemIconProperty: Property<ActionItemBase, string>;
export declare const actionItemVisibilityProperty: Property<ActionItemBase, string>;
export declare const mainActionButtonTextProperty: Property<MainActionButtonBase, string>;
export declare const mainActionButtonIconProperty: Property<MainActionButtonBase, string>;
export declare const mainActionButtonVisibilityProperty: Property<MainActionButtonBase, string>;
