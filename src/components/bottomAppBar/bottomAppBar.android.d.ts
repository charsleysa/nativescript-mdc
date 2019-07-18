import { Page } from 'tns-core-modules/ui/page/page';
import { Background } from 'tns-core-modules/ui/styling/background';
import { AndroidActionItemSettings } from './bottomAppBar';
import { ActionItemBase, BottomAppBarBase, MainActionButtonBase, View } from './bottomAppBar-common';
export * from './bottomAppBar-common';
import FloatingActionButton = com.google.android.material.floatingactionbutton.FloatingActionButton;
declare module 'tns-core-modules/ui/frame' {
    interface Frame {
        _getNavBarVisible(page: Page): boolean;
    }
}
export declare class ActionItem extends ActionItemBase {
    private _androidPosition;
    private _itemId;
    constructor();
    android: AndroidActionItemSettings;
    _getItemId(): any;
}
export declare class NavigationButton extends ActionItem {
}
export declare class MainActionButton extends MainActionButtonBase {
    constructor();
}
export declare class BottomAppBar extends BottomAppBarBase {
    nativeViewProtected: com.google.android.material.bottomappbar.BottomAppBar;
    floatingActionButton: FloatingActionButton;
    constructor();
    readonly android: com.google.android.material.bottomappbar.BottomAppBar;
    _addChildFromBuilder(name: string, value: any): void;
    createNativeView(): com.google.android.material.bottomappbar.BottomAppBar;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    update(): void;
    _onAndroidItemSelected(itemId: number): boolean;
    _updateMainActionButton(): void;
    _updateNavigationButton(): void;
    _addActionItems(): void;
    private static _setOnClickListener;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
    _redrawNativeBackground(value: Background): void;
}
