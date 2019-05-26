import { View } from 'tns-core-modules/ui/core/view';
import { ShowBottomSheetOptions, ViewWithBottomSheetBase } from './bottomSheet-common';
export { ShowBottomSheetOptions as BottomSheetOptions };
declare module 'tns-core-modules/ui/core/view' {
    interface View {
        _bottomSheetFragment: android.support.design.widget.BottomSheetDialogFragment;
    }
}
export declare class ViewWithBottomSheet extends ViewWithBottomSheetBase {
    protected _hideNativeBottomSheet(parent: View, whenClosedCallback: () => void): void;
    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions): void;
}
export declare function overrideBottomSheet(): void;
export declare function install(): void;
