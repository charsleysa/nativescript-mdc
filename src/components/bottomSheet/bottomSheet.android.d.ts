import { View } from 'tns-core-modules/ui/core/view';
import { ShowBottomSheetOptions, ViewWithBottomSheetBase } from './bottomSheet-common';
export declare class ViewWithBottomSheet extends ViewWithBottomSheetBase {
    _bottomSheetFragment: com.google.android.material.bottomsheet.BottomSheetDialogFragment;
    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions): void;
    protected _hideNativeBottomSheet(parent: View, whenClosedCallback: () => void): void;
}
export declare function overrideBottomSheet(): void;
export declare function install(): void;
