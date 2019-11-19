import { Background } from 'tns-core-modules/ui/styling/background';
import { IOSActionItemSettings } from './bottomAppBar';
import { ActionItemBase, BottomAppBarBase, MainActionButtonBase } from './bottomAppBar-common';
export * from './bottomAppBar-common';
declare module '@nativescript/core/ui/core/view/view' {
    interface View {
        _isPresentationLayerUpdateSuspeneded(): boolean;
        _nativeBackgroundState: string;
        _setNativeViewFrame(nativeView: UIView, frame: CGRect): void;
    }
}
export declare class ActionItem extends ActionItemBase {
    private _ios;
    ios: IOSActionItemSettings;
}
export declare class NavigationButton extends ActionItem {
}
export declare class MainActionButton extends MainActionButtonBase {
    constructor();
}
export declare class BottomAppBar extends BottomAppBarBase {
    nativeViewProtected: MDCBottomAppBarView;
    readonly ios: MDCBottomAppBarView;
    constructor();
    createNativeView(): MDCBottomAppBarView;
    _addChildFromBuilder(name: string, value: any): void;
    update(): void;
    private updateMainActionButton;
    private populateMenuItems;
    private createBarButtonItem;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    layoutNativeView(left: number, top: number, right: number, bottom: number): void;
    _redrawNativeBackground(value: Background): void;
}
