import { View } from 'tns-core-modules/ui/core/view';
import { ShowBottomSheetOptions, ViewWithBottomSheetBase } from './bottomSheet-common';
export declare class ViewWithBottomSheet extends ViewWithBottomSheetBase {
    private _bottomSheetControllerDelegate;
    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions): void;
    protected _hideNativeBottomSheet(parent: View, whenClosedCallback: () => void): void;
}
export declare function overrideBottomSheet(): void;
export declare function install(): void;
declare module 'tns-core-modules/ui/core/view/view' {
    interface View {
        _setLayoutFlags(left: number, top: number, right: number, bottom: number): any;
    }
}
export declare namespace ios {
    class BottomSheetUILayoutViewController extends UIViewController {
        owner: WeakRef<View>;
        static initWithOwner(owner: WeakRef<View>): BottomSheetUILayoutViewController;
        private initLayoutGuide;
        private layoutView;
        private layoutParent;
        viewDidLayoutSubviews(): void;
        viewWillAppear(animated: boolean): void;
        viewDidDisappear(animated: boolean): void;
    }
    class MDCBottomSheetControllerDelegateImpl extends NSObject implements MDCBottomSheetControllerDelegate {
        static ObjCProtocols: {
            prototype: MDCBottomSheetControllerDelegate;
        }[];
        private owner;
        private closedCallback;
        static initWithOwnerAndCallback(owner: WeakRef<ViewWithBottomSheet>, whenClosedCallback: Function): MDCBottomSheetControllerDelegateImpl;
        bottomSheetControllerDidDismissBottomSheet(controller: MDCBottomSheetController): void;
    }
}
