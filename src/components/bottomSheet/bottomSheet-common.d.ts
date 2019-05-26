import { View } from 'tns-core-modules/ui/core/view';
import { EventData, ViewBase } from 'tns-core-modules/ui/frame/frame';
declare module 'tns-core-modules/ui/core/view/view' {
    interface View {
        showBottomSheet(view: ViewBase, options: ShowBottomSheetOptions): ViewBase;
        showBottomSheet(moduleName: string, options: ShowBottomSheetOptions): ViewBase;
        _setupAsRootView(context: any): void;
        callLoaded(): void;
        callUnloaded(): void;
        _removeFromFrameStack(): void;
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
export declare abstract class ViewWithBottomSheetBase extends View {
    protected _closeBottomSheetCallback: Function;
    protected abstract _hideNativeBottomSheet(parent: any, whenClosedCallback: any): any;
    protected _bottomSheetContext: any;
    _raiseShownBottomSheetEvent(): void;
    _bottomSheetClosed(): void;
    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions): void;
    protected _raiseShowingBottomSheetEvent(): void;
    closeBottomSheet(...args: any[]): void;
    showBottomSheet(view: ViewBase, options: ShowBottomSheetOptions): ViewBase;
    showBottomSheet(moduleName: string, options: ShowBottomSheetOptions): ViewBase;
}
