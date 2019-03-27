import { View } from 'tns-core-modules/ui/core/view';
import { BottomSheetOptions, ViewWithBottomSheetBase } from './bottomSheet-common';
export { BottomSheetOptions };
declare module 'tns-core-modules/ui/core/view' {
    interface View {
        _bottomSheetFragment: android.support.design.widget.BottomSheetDialogFragment;
    }
}
export declare class ViewWithBottomSheet extends ViewWithBottomSheetBase {
    protected _hideNativeBottomSheet(parent: View, whenClosedCallback: () => void): void;
    protected _showNativeBottomSheet(parent: View, options: BottomSheetOptions): void;
}
export declare function overrideBottomSheet(): void;
export declare function install(): void;
