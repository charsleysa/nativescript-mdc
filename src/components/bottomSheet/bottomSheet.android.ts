import { View } from 'tns-core-modules/ui/core/view';
import { fromObject } from 'tns-core-modules/data/observable/observable';

import { ShowBottomSheetOptions, ViewWithBottomSheetBase } from './bottomSheet-common';
import { applyMixins } from '../core/core';

interface BottomSheetDataOptions {
    owner: View;
    options: ShowBottomSheetOptions;
    shownCallback: () => void;
    dismissCallback: () => void;
}
const DOMID = '_domId';
const bottomSheetMap = new Map<number, BottomSheetDataOptions>();

function saveBottomSheet(options: BottomSheetDataOptions) {
    bottomSheetMap.set(options.owner._domId, options);
}

function removeBottomSheet(domId: number) {
    bottomSheetMap.delete(domId);
}

function getBottomSheetOptions(domId: number): BottomSheetDataOptions {
    return bottomSheetMap.get(domId);
}

declare module 'tns-core-modules/ui/core/view' {
    interface View {
        _bottomSheetFragment: com.google.android.material.bottomsheet.BottomSheetDialogFragment;
    }
}

let BottomSheetDialogFragment: BottomSheetDialogFragment;

interface BottomSheetDialogFragment {
    new (): com.google.android.material.bottomsheet.BottomSheetDialogFragment;
}
function initializeBottomSheetDialogFragment() {
    if (BottomSheetDialogFragment) {
        return;
    }

    class BottomSheetDialogFragmentImpl extends com.google.android.material.bottomsheet.BottomSheetDialogFragment {
        public owner: View;
        private _shownCallback: () => void;
        private _dismissCallback: () => void;

        constructor() {
            super();
            return global.__native(this);
        }

        public onCreateDialog(savedInstanceState: android.os.Bundle): android.app.Dialog {
            const ownerId = this.getArguments().getInt(DOMID);
            const options = getBottomSheetOptions(ownerId);
            this.owner = options.owner;
            this._dismissCallback = options.dismissCallback;
            this._shownCallback = options.shownCallback;
            this.owner._bottomSheetFragment = this;

            const dialog = super.onCreateDialog(savedInstanceState) as com.google.android.material.bottomsheet.BottomSheetDialog;
            if (options.options) {
                const creationOptions = options.options;
                if (creationOptions.dismissOnBackgroundTap !== undefined) {
                    dialog.setCanceledOnTouchOutside(creationOptions.dismissOnBackgroundTap);
                }
            }

            return dialog;
        }

        public onCreateView(inflater: android.view.LayoutInflater, container: android.view.ViewGroup, savedInstanceState: android.os.Bundle): android.view.View {
            const owner = this.owner;
            owner._setupAsRootView(this.getActivity());
            owner._isAddedToNativeVisualTree = true;

            return owner.nativeViewProtected;
        }

        public onStart(): void {
            super.onStart();

            const owner = this.owner;
            if (owner && !owner.isLoaded) {
                owner.callLoaded();
            }

            this._shownCallback();
        }

        public onDismiss(dialog: android.content.DialogInterface): void {
            super.onDismiss(dialog);
            const manager = this.getFragmentManager();
            if (manager) {
                removeBottomSheet(this.owner._domId);
                this._dismissCallback();
            }

            const owner = this.owner;
            if (owner && owner.isLoaded) {
                owner.callUnloaded();
            }
        }

        public onDestroy(): void {
            super.onDestroy();
            const owner = this.owner;
            owner._isAddedToNativeVisualTree = false;
            owner._tearDownUI(true);
        }
    }

    BottomSheetDialogFragment = BottomSheetDialogFragmentImpl;
}

export class ViewWithBottomSheet extends ViewWithBottomSheetBase {
    protected _hideNativeBottomSheet(parent: View, whenClosedCallback: () => void) {
        const manager = this._bottomSheetFragment.getFragmentManager();
        if (manager) {
            this._bottomSheetFragment.dismissAllowingStateLoss();
        }

        this._bottomSheetFragment = null;
        whenClosedCallback();
    }

    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions) {
        super._showNativeBottomSheet(parent, options);

        initializeBottomSheetDialogFragment();

        const df = new BottomSheetDialogFragment();
        const args = new android.os.Bundle();
        args.putInt(DOMID, this._domId);
        df.setArguments(args);

        const bottomSheetOptions: BottomSheetDataOptions = {
            owner: this,
            options: options,
            shownCallback: () => {
                this.bindingContext = fromObject(options.context);
                this._raiseShownBottomSheetEvent();
            },
            dismissCallback: () => this.closeBottomSheet()
        };

        saveBottomSheet(bottomSheetOptions);

        this._bottomSheetFragment = df;
        this._raiseShowingBottomSheetEvent();

        this._bottomSheetFragment.show((<any>parent)._getRootFragmentManager(), this._domId.toString());
    }
}

export function overrideBottomSheet() {
    const NSView = require('tns-core-modules/ui/core/view').View;
    console.log('about to override bottom sheet');
    applyMixins(NSView, [ViewWithBottomSheetBase, ViewWithBottomSheet]);
}
export function install() {
    // overridePage();
    overrideBottomSheet();
}
