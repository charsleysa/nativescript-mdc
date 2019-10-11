import { fromObject } from 'tns-core-modules/data/observable/observable';
import { ios as iosView, traceCategories, traceError, traceMessageType, traceWrite, View, ViewBase } from 'tns-core-modules/ui/core/view';
import { layout } from 'tns-core-modules/utils/utils';

import { ShowBottomSheetOptions, ViewWithBottomSheetBase, shownInBottomSheetEvent, showingInBottomSheetEvent } from './bottomSheet-common';
import { applyMixins } from '../core/core';

export class ViewWithBottomSheet extends ViewWithBottomSheetBase {
    private _bottomSheetControllerDelegate: ios.MDCBottomSheetControllerDelegateImpl;

    protected _showNativeBottomSheet(parent: View, options: ShowBottomSheetOptions) {
        const parentWithController = iosView.getParentWithViewController(parent);
        if (!parentWithController) {
            traceWrite(`Could not find parent with viewController for ${parent} while showing bottom sheet view.`, traceCategories.ViewHierarchy, traceMessageType.error);
            return;
        }

        const parentController = parentWithController.viewController;
        if (parentController.presentedViewController) {
            traceWrite('Parent is already presenting view controller. Close the current bottom sheet page before showing another one!', traceCategories.ViewHierarchy, traceMessageType.error);
            return;
        }

        if (!parentController.view || !parentController.view.window) {
            traceWrite('Parent page is not part of the window hierarchy.', traceCategories.ViewHierarchy, traceMessageType.error);
            return;
        }

        this._setupAsRootView({});

        super._showNativeBottomSheet(parentWithController, options);
        let controller = this.viewController;
        if (!controller) {
            const nativeView = this.ios || this.nativeViewProtected;
            controller = ios.BottomSheetUILayoutViewController.initWithOwner(new WeakRef(this));

            if (nativeView instanceof UIView) {
                controller.view.addSubview(nativeView);
            }

            this.viewController = controller;
        }

        controller.modalPresentationStyle = UIModalPresentationStyle.Custom;

        this.horizontalAlignment = 'stretch';
        this.verticalAlignment = 'stretch';

        this._raiseShowingBottomSheetEvent();
        const bottomSheet = MDCBottomSheetController.alloc().initWithContentViewController(controller);
        bottomSheet.trackingScrollView = controller.view;
        this._bottomSheetControllerDelegate = ios.MDCBottomSheetControllerDelegateImpl.initWithOwnerAndCallback(new WeakRef(this), this._closeBottomSheetCallback);
        bottomSheet.delegate = this._bottomSheetControllerDelegate;
        bottomSheet.isScrimAccessibilityElement = true;
        bottomSheet.scrimAccessibilityLabel = 'close';
        bottomSheet.dismissOnBackgroundTap = options.dismissOnBackgroundTap !== false;
        bottomSheet.shouldFlashScrollIndicatorsOnAppearance = true;

        (<any>controller).animated = true;
        parentController.presentViewControllerAnimatedCompletion(bottomSheet, true, null);
        if (!this.backgroundColor) {
            this.backgroundColor = 'white';
            controller.view.backgroundColor = UIColor.whiteColor;
        } else {
            controller.view.backgroundColor = this.style.backgroundColor.ios;
        }
        const transitionCoordinator = bottomSheet.transitionCoordinator;
        if (transitionCoordinator) {
            UIViewControllerTransitionCoordinator.prototype.animateAlongsideTransitionCompletion.call(transitionCoordinator, null, () => {
                (this.bindingContext = fromObject(options.context)), this._raiseShownBottomSheetEvent();
            });
        } else {
            // Apparently iOS 9+ stops all transitions and animations upon application suspend and transitionCoordinator becomes null here in this case.
            // Since we are not waiting for any transition to complete, i.e. transitionCoordinator is null, we can directly raise our shownInBottomSheet event.
            // Take a look at https://github.com/NativeScript/NativeScript/issues/2173 for more info and a sample project.
            this.bindingContext = fromObject(options.context);
            this._raiseShownBottomSheetEvent();
        }
    }

    protected _hideNativeBottomSheet(parent: View, whenClosedCallback: () => void) {
        if (!parent || !parent.viewController) {
            traceError('Trying to hide bottomsheet view but no parent with viewController specified.');
            return;
        }

        // modal view has already been closed by UI, probably as a popover
        if (parent.viewController.presentedViewController == null || parent.viewController.presentedViewController.beingDismissed) {
            whenClosedCallback();

            return;
        }

        const parentController = parent.viewController;
        const animated = (<any>this.viewController).animated;
        parentController.dismissViewControllerAnimatedCompletion(animated, whenClosedCallback);
    }
}

export function overrideBottomSheet() {
    const NSView = require('tns-core-modules/ui/core/view').View;
    applyMixins(NSView, [ViewWithBottomSheetBase, ViewWithBottomSheet]);
    NSView.shownInBottomSheetEvent = shownInBottomSheetEvent;
    NSView.showingInBottomSheetEvent = showingInBottomSheetEvent;
}
export function install() {
    overrideBottomSheet();
}

declare module 'tns-core-modules/ui/core/view/view' {
    interface View {
        _setLayoutFlags(left: number, top: number, right: number, bottom: number);
    }
}

export namespace ios {

    export class BottomSheetUILayoutViewController extends UIViewController {
        public owner: WeakRef<View>;
        public view: UIScrollView;

        public static initWithOwner(owner: WeakRef<View>): BottomSheetUILayoutViewController {
            const controller = <BottomSheetUILayoutViewController>BottomSheetUILayoutViewController.new();
            controller.owner = owner;
            return controller;
        }

        private getSafeAreaInsets() {
            const safeAreaInsets = this.view.safeAreaInsets;
            const insets = { left: 0, top: 0, right: 0, bottom: 0 };
            if (safeAreaInsets) {
                insets.left = layout.round(layout.toDevicePixels(safeAreaInsets.left));
                insets.top = layout.round(layout.toDevicePixels(safeAreaInsets.top));
                insets.right = layout.round(layout.toDevicePixels(safeAreaInsets.right));
                insets.bottom = layout.round(layout.toDevicePixels(safeAreaInsets.bottom));
            }
            return insets;
        }

        private initLayoutGuide() {
            const rootView = this.view;
            const layoutGuide = UILayoutGuide.alloc().init();
            rootView.addLayoutGuide(layoutGuide);
            NSLayoutConstraint.activateConstraints(<any>[
                layoutGuide.topAnchor.constraintEqualToAnchor(this.topLayoutGuide.bottomAnchor),
                layoutGuide.bottomAnchor.constraintEqualToAnchor(this.bottomLayoutGuide.topAnchor),
                layoutGuide.leadingAnchor.constraintEqualToAnchor(rootView.leadingAnchor),
                layoutGuide.trailingAnchor.constraintEqualToAnchor(rootView.trailingAnchor)
            ]);
            return layoutGuide;
        }

        private layoutView(owner: View): void {
            let layoutGuide = this.view.safeAreaLayoutGuide;
            if (!layoutGuide) {
                traceWrite(`safeAreaLayoutGuide during layout of ${owner}. Creating fallback constraints, but layout might be wrong.`, traceCategories.Layout, traceMessageType.error);

                layoutGuide = this.initLayoutGuide();
            }
            const safeArea = layoutGuide.layoutFrame;
            let position = iosView.getPositionFromFrame(safeArea);

            const safeAreaSize = safeArea.size;
            const safeAreaWidth = layout.round(layout.toDevicePixels(safeAreaSize.width));
            const safeAreaHeight = layout.round(layout.toDevicePixels(safeAreaSize.height));

            const widthSpec = layout.makeMeasureSpec(safeAreaWidth, layout.EXACTLY);
            const heightSpec = layout.makeMeasureSpec(0, layout.UNSPECIFIED);

            const insets = this.getSafeAreaInsets();

            View.measureChild(null, owner, widthSpec, heightSpec);
            View.layoutChild(null, owner, position.left, 0, position.right, insets.top + owner.getMeasuredHeight());

            const extraInsetTop = owner.getMeasuredHeight() > safeAreaHeight ? insets.top : 0;

            this.view.contentSize = CGSizeMake(
                layout.toDeviceIndependentPixels(owner.getMeasuredWidth()),
                layout.toDeviceIndependentPixels(insets.top + extraInsetTop + owner.getMeasuredHeight())
            );

            this.preferredContentSize = CGSizeMake(
                layout.toDeviceIndependentPixels(owner.getMeasuredWidth()),
                layout.toDeviceIndependentPixels(Math.min(owner.getMeasuredHeight(), safeAreaHeight))
            );

            this.layoutParent(owner.parent);
        }

        private layoutParent(view: ViewBase): void {
            if (!view) {
                return;
            }

            if (view instanceof View && view.nativeViewProtected) {
                const frame = view.nativeViewProtected.frame;
                const origin = frame.origin;
                const size = frame.size;
                const left = layout.toDevicePixels(origin.x);
                const top = layout.toDevicePixels(origin.y);
                const width = layout.toDevicePixels(size.width);
                const height = layout.toDevicePixels(size.height);
                view._setLayoutFlags(left, top, width + left, height + top);
            }

            this.layoutParent(view.parent);
        }

        public loadView(): void {
            this.view = UIScrollView.new();
        }

        public viewDidLoad(): void {
            super.viewDidLoad();
            this.view.autoresizingMask = UIViewAutoresizing.FlexibleWidth | UIViewAutoresizing.FlexibleHeight;
            this.view.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentBehavior.Never;
        }

        public viewDidLayoutSubviews(): void {
            super.viewDidLayoutSubviews();
            const owner = this.owner.get();
            if (owner) {
                this.layoutView(owner);
            }
        }

        public viewWillAppear(animated: boolean): void {
            super.viewWillAppear(animated);
            const owner = this.owner.get();
            if (!owner) {
                return;
            }

            iosView.updateAutoAdjustScrollInsets(this, owner);

            if (!owner.parent) {
                owner.callLoaded();
            }
        }

        public viewDidDisappear(animated: boolean): void {
            super.viewDidDisappear(animated);
            const owner = this.owner.get();
            if (owner && !owner.parent) {
                owner.callUnloaded();
            }
        }

        public viewSafeAreaInsetsDidChange(): void {
            super.viewSafeAreaInsetsDidChange();
            const insets = this.getSafeAreaInsets();
            const contentInset = this.view.contentInset;
            contentInset.top = -layout.toDeviceIndependentPixels(insets.top);
            this.view.contentInset = contentInset;
        }
    }

    export class MDCBottomSheetControllerDelegateImpl extends NSObject implements MDCBottomSheetControllerDelegate {
        public static ObjCProtocols = [MDCBottomSheetControllerDelegate];

        private owner: WeakRef<ViewWithBottomSheet>;
        private closedCallback: Function;

        public static initWithOwnerAndCallback(owner: WeakRef<ViewWithBottomSheet>, whenClosedCallback: Function): MDCBottomSheetControllerDelegateImpl {
            const instance = <MDCBottomSheetControllerDelegateImpl>super.new();
            instance.owner = owner;
            instance.closedCallback = whenClosedCallback;

            return instance;
        }
        bottomSheetControllerDidDismissBottomSheet(controller: MDCBottomSheetController) {
            const owner = this.owner.get();
            if (owner && typeof this.closedCallback === 'function') {
                this.closedCallback();
            }
        }
    }
}
