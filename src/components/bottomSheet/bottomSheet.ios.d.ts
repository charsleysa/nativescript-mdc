import { View } from 'tns-core-modules/ui/core/view';
import { ShowBottomSheetOptions, ViewWithBottomSheetBase } from './bottomSheet-common';
declare module 'tns-core-modules/ui/core/view/view' {
    interface View {
        _setLayoutFlags(left: number, top: number, right: number, bottom: number): any;
    }
}
export declare class ViewWithBottomSheet extends ViewWithBottomSheetBase {
    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions): void;
    protected _hideNativeBottomSheet(parent: View, whenClosedCallback: () => void): void;
}
export declare function overrideBottomSheet(): void;
export declare function install(): void;
