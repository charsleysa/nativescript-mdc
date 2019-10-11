import { View } from 'tns-core-modules/ui/core/view';
import { createViewFromEntry } from 'tns-core-modules/ui/builder/builder';
import { eachDescendant, EventData, Frame, ViewBase } from 'tns-core-modules/ui/frame/frame';

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
    /**
     * The context (optional, may be undefined) passed to the view when shown modally.
     */
    context?: any;

    /**
     * A callback to call when you want to close the modally shown view.
     * Pass in any kind of arguments and you will receive when the callback parameter
     * of View.showModal is executed.
     */
    closeCallback?: Function;
}

export const shownInBottomSheetEvent = 'shownInBottomSheet';
export const showingInBottomSheetEvent = 'showingInBottomSheet';

export interface ShowBottomSheetOptions {
    context?: any; // Any context you want to pass to the view shown in bottom sheet. This same context will be available in the arguments of the shownInBottomSheet event handler.
    dismissOnBackgroundTap?: boolean; // An optional parameter specifying whether to dismiss the sheet when clicking on background.
    closeCallback?: Function; //  A function that will be called when the view is closed. Any arguments provided when calling shownInBottomSheet.closeCallback will be available here.
}

export const _rootBottomSheetViews = new Array<ViewBase>();

export abstract class ViewWithBottomSheetBase extends View {
    protected _closeBottomSheetCallback: Function;
    private _bottomSheetContext: any;
    private _bottomSheet: View;
    public _bottomSheetParent: View;

    protected _raiseShownBottomSheetEvent() {
        const args: ShownBottomSheetData = {
            eventName: shownInBottomSheetEvent,
            object: this,
            context: this._bottomSheetContext,
            closeCallback: this._closeBottomSheetCallback
        };
        this.notify(args);
    }
    protected _raiseShowingBottomSheetEvent() {
        const args: ShownBottomSheetData = {
            eventName: showingInBottomSheetEvent,
            object: this,
            context: this._bottomSheetContext,
            closeCallback: this._closeBottomSheetCallback
        };
        this.notify(args);
    }

    public _bottomSheetClosed(): void {
        eachDescendant(this, (child: ViewWithBottomSheetBase) => {
            child._bottomSheetClosed();
            return true;
        });
    }

    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions) {
        _rootBottomSheetViews.push(this);

        (parent as ViewWithBottomSheetBase)._bottomSheet = this;
        this._bottomSheetParent = parent;
        this._bottomSheetContext = options.context;
        const that = this;
        this._closeBottomSheetCallback = function(...originalArgs) {
            if (that._closeBottomSheetCallback) {
                const modalIndex = _rootBottomSheetViews.indexOf(that);
                _rootBottomSheetViews.splice(modalIndex);
                that._bottomSheetParent = null;
                that._bottomSheetContext = null;
                that._closeBottomSheetCallback = null;
                that._bottomSheetClosed();
                (parent as ViewWithBottomSheetBase)._bottomSheet = null;

                const whenClosedCallback = () => {
                    if (typeof options.closeCallback === 'function') {
                        options.closeCallback.apply(undefined, originalArgs);
                    }
                };

                that._hideNativeBottomSheet(parent, whenClosedCallback);
            }
        };
    }

    protected abstract _hideNativeBottomSheet(parent, whenClosedCallback);

    public closeBottomSheet(...args: any[]): void {
        let closeCallback = this._closeBottomSheetCallback;
        if (closeCallback) {
            closeCallback.apply(undefined, arguments);
        } else {
            let parent = this.parent as ViewWithBottomSheetBase;
            if (parent) {
                parent.closeBottomSheet(...args);
            }
        }
    }

    public showBottomSheet(view: ViewBase, options: ShowBottomSheetOptions): ViewBase;
    public showBottomSheet(moduleName: string, options: ShowBottomSheetOptions): ViewBase;
    public showBottomSheet(viewOrModuleName: string | ViewBase, options: ShowBottomSheetOptions): ViewBase {
        const view = viewOrModuleName instanceof ViewBase
            ? (viewOrModuleName as ViewWithBottomSheetBase)
            : <ViewWithBottomSheetBase>createViewFromEntry({ moduleName: viewOrModuleName as string });

        view._showNativeBottomSheet(this, options);
        return view;
    }
}
