import { View, ios as iosView } from 'tns-core-modules/ui/core/view';
import { ios as iosUtils, layout } from 'tns-core-modules/utils/utils';
import * as application from 'tns-core-modules/application';
import {
    isEnabled as traceEnabled,
    write as traceWrite,
    notifyEvent as traceNotifyEvent,
    categories as traceCategories
} from 'tns-core-modules/trace';

import { applyMixins } from '../core/core';
import { BottomAppBar } from '../bottomAppBar/bottomAppBar';

import { MDCPageBase } from './page-common';

declare module '@nativescript/core/ui/action-bar' {
    interface ActionBar {
        readonly _getActualSize: { width: number, height: number };
    }
}

declare module '@nativescript/core/ui/page' {
    interface Page {
        hasActionBar: boolean;
    }
}

const majorVersion = iosUtils.MajorVersion;

export class MDCPage extends MDCPageBase {

    public onLoaded(): void {
        View.prototype.onLoaded.call(this); // super
        if (this.hasActionBar) {
            this.actionBar.update();
        }
        if (this.hasBottomAppBar) {
            this.bottomAppBar.update();
        }
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number) {
        const width = layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);

        const height = layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);

        if (this.frame && this.frame._getNavBarVisible(this)) {
            const { width, height } = this.actionBar._getActualSize;
            const widthSpec = layout.makeMeasureSpec(width, layout.EXACTLY);
            const heightSpec = layout.makeMeasureSpec(height, layout.EXACTLY);
            View.measureChild(this, this.actionBar, widthSpec, heightSpec);
        }

        if (this.hasBottomAppBar) {
            const widthSpec = layout.makeMeasureSpec(width, layout.AT_MOST);
            const heightSpec = layout.makeMeasureSpec(height, layout.AT_MOST);
            View.measureChild(this, this.bottomAppBar, widthSpec, heightSpec);
        }

        const result = View.measureChild(this, this.layoutView, widthMeasureSpec, heightMeasureSpec);

        const measureWidth = Math.max(result.measuredWidth, this.effectiveMinWidth);
        const measureHeight = Math.max(result.measuredHeight, this.effectiveMinHeight);

        const widthAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        const heightAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);

        this.setMeasuredDimension(widthAndState, heightAndState);
    }

    public onLayout(left: number, top: number, right: number, bottom: number) {
        const { width: actionBarWidth, height: actionBarHeight } = this.actionBar._getActualSize;
        View.layoutChild(this, this.actionBar, 0, 0, actionBarWidth, actionBarHeight);

        if (this.hasBottomAppBar) {
            const bottomAppBarWidth = this.bottomAppBar.getMeasuredWidth();
            const bottomAppBarHeight = this.bottomAppBar.getMeasuredHeight();
            View.layoutChild(this, this.bottomAppBar, left, bottom - bottomAppBarHeight, left + bottomAppBarWidth, bottom);
        }

        const insets = this.getSafeAreaInsets();

        if (majorVersion <= 10) {
            // iOS 10 and below don't have safe area insets API,
            // there we need only the top inset on the Page
            insets.top = layout.round(layout.toDevicePixels(this.viewController.view.safeAreaLayoutGuide.layoutFrame.origin.y));
        }

        const childLeft = 0 + insets.left;
        const childTop = 0 + insets.top;
        const childRight = right - insets.right;
        let childBottom = bottom - insets.bottom;

        View.layoutChild(this, this.layoutView, childLeft, childTop, childRight, childBottom);
    }

    public _addViewToNativeVisualTree(child: View, atIndex: number): boolean {
        // ActionBar is handled by the UINavigationController
        if (child === this.actionBar) {
            return true;
        }

        View.prototype._addViewToNativeVisualTree.call(this, child, atIndex); // super

        const nativeParent = this.nativeViewProtected;
        const nativeChild = child.nativeViewProtected;

        const viewController = child.ios instanceof UIViewController ? child.ios : child.viewController;
        if (viewController) {
            // Adding modal controllers to as child will make app freeze.
            if (this.viewController.presentedViewController === viewController) {
                return true;
            }

            this.viewController.addChildViewController(viewController);
        }

        if (nativeParent && nativeChild) {
            if (typeof atIndex !== "number" || atIndex >= nativeParent.subviews.count) {
                nativeParent.addSubview(nativeChild);
            } else {
                nativeParent.insertSubviewAtIndex(nativeChild, atIndex);
            }

            return true;
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: View): void {
        // ActionBar is handled by the UINavigationController
        if (child === this.actionBar) {
            return;
        }

        const viewController = child.ios instanceof UIViewController ? child.ios : child.viewController;
        if (viewController) {
            viewController.removeFromParentViewController();
        }

        View.prototype._removeViewFromNativeVisualTree.call(this, child); // super

        if (child.nativeViewProtected) {
            child.nativeViewProtected.removeFromSuperview();
        }
    }
}

export function overridePage() {
    const NSPage = require('tns-core-modules/ui/page/page').Page;
    applyMixins(NSPage, [MDCPageBase, MDCPage]);
}
export function install() {
    overridePage();
}
