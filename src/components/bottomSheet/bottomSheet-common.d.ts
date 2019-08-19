import { View } from 'tns-core-modules/ui/core/view';
import { EventData, ViewBase } from 'tns-core-modules/ui/frame/frame';
declare module 'tns-core-modules/ui/core/view/view' {
    interface View {
        showBottomSheet(view: ViewBase, options: ShowBottomSheetOptions): ViewBase;
        showBottomSheet(moduleName: string, options: ShowBottomSheetOptions): ViewBase;
        _setupAsRootView(context: any): void;
        callLoaded(): void;
        callUnloaded(): void;
    }
}
export interface ShownBottomSheetData extends EventData {
    context?: any;
    closeCallback?: Function;
}
export declare const shownInBottomSheetEvent = "shownInBottomSheet";
export declare const showingInBottomSheetEvent = "showingInBottomSheet";
export interface ShowBottomSheetOptions {
    context?: any;
    dismissOnBackgroundTap?: boolean;
    closeCallback?: Function;
    ios?: {
        trackingScrollView?: string;
    };
}
export declare const _rootBottomSheetViews: ViewBase[];
export declare abstract class ViewWithBottomSheetBase extends View {
    protected _closeBottomSheetCallback: Function;
    private _bottomSheetContext;
    private _bottomSheet;
    _bottomSheetParent: View;
    protected _raiseShownBottomSheetEvent(): void;
    protected _raiseShowingBottomSheetEvent(): void;
    _bottomSheetClosed(): void;
    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions): void;
    protected abstract _hideNativeBottomSheet(parent: any, whenClosedCallback: any): any;
    closeBottomSheet(...args: any[]): void;
    showBottomSheet(view: ViewBase, options: ShowBottomSheetOptions): ViewBase;
    showBottomSheet(moduleName: string, options: ShowBottomSheetOptions): ViewBase;
}
