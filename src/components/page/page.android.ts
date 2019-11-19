import { View, Color } from 'tns-core-modules/ui/page/page';
import { ActionBar } from 'tns-core-modules/ui/action-bar/action-bar';
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

declare module '@nativescript/core/ui/page' {
    interface Page {
        updateActionBar();
    }
}

let AppBarLayout: typeof com.google.android.material.appbar.AppBarLayout;
let CoordinatorLayout: typeof androidx.coordinatorlayout.widget.CoordinatorLayout;

function initAppBarLayout() {
    if (!AppBarLayout) {
        AppBarLayout = com.google.android.material.appbar.AppBarLayout;
    }
}

function initCoordinatorLayout() {
    if (!CoordinatorLayout) {
        CoordinatorLayout = androidx.coordinatorlayout.widget.CoordinatorLayout;
    }
}

export class MDCPage extends MDCPageBase {
    appBarLayout: com.google.android.material.appbar.AppBarLayout;
    nativeViewProtected: androidx.coordinatorlayout.widget.CoordinatorLayout;
    contentLayout: androidx.coordinatorlayout.widget.CoordinatorLayout;

    public createNativeView() {
        initAppBarLayout();
        initCoordinatorLayout();

        const layout = new CoordinatorLayout(this._context);

        this.appBarLayout = new AppBarLayout(this._context);
        this.contentLayout = new CoordinatorLayout(this._context);

        layout.addView(this.appBarLayout, new CoordinatorLayout.LayoutParams(CoordinatorLayout.LayoutParams.MATCH_PARENT, CoordinatorLayout.LayoutParams.WRAP_CONTENT));
        layout.addView(this.contentLayout, new CoordinatorLayout.LayoutParams(CoordinatorLayout.LayoutParams.MATCH_PARENT, CoordinatorLayout.LayoutParams.MATCH_PARENT));

        return layout;
    }

    public onLoaded() {
        View.prototype.onLoaded.call(this); // super
        if (this.actionBarHidden !== undefined) {
            this.updateActionBar();
        }
        if (this.hasBottomAppBar) {
            this.bottomAppBar.update();
        }
    }

    public _addViewToNativeVisualTree(child: View, atIndex?: number): boolean {
        View.prototype._addViewToNativeVisualTree.call(this, child, atIndex); // super

        if (this.nativeViewProtected && child.nativeViewProtected) {
            if (traceEnabled()) {
                traceWrite(`${this}.nativeView.addView(${child}.nativeView, ${atIndex})`, traceCategories.VisualTreeEvents);
            }

            if (child instanceof ActionBar) {
                const params = new AppBarLayout.LayoutParams(AppBarLayout.LayoutParams.MATCH_PARENT, AppBarLayout.LayoutParams.WRAP_CONTENT);
                params.setScrollFlags(0);
                this.appBarLayout.addView(child.nativeViewProtected, params);
            } else if (child instanceof BottomAppBar) {
                const params = new CoordinatorLayout.LayoutParams(CoordinatorLayout.LayoutParams.MATCH_PARENT, CoordinatorLayout.LayoutParams.WRAP_CONTENT);
                params.gravity = android.view.Gravity.BOTTOM;
                this.nativeViewProtected.addView(child.nativeViewProtected, params);

                const floatingActionButtonParams = new CoordinatorLayout.LayoutParams(CoordinatorLayout.LayoutParams.WRAP_CONTENT, CoordinatorLayout.LayoutParams.WRAP_CONTENT);
                floatingActionButtonParams.setAnchorId(child.nativeViewProtected.getId());
                this.nativeViewProtected.addView((child as any).floatingActionButton, floatingActionButtonParams);
            } else {
                const params = new CoordinatorLayout.LayoutParams(CoordinatorLayout.LayoutParams.MATCH_PARENT, CoordinatorLayout.LayoutParams.MATCH_PARENT);
                this.contentLayout.addView(child.nativeViewProtected, params);
            }

            if (child instanceof View) {
                (this as any)._updateNativeLayoutParams(child);
            }

            return true;
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: View): void {
        View.prototype._removeViewFromNativeVisualTree.call(this, child); // super

        const nativeView = this.nativeViewProtected;
        const childView = child.nativeViewProtected;
        const fabChildView = (child as any).floatingActionButton;
        if (nativeView && childView) {
            if (child instanceof ActionBar) {
                this.appBarLayout.removeView(childView);
            } else if (child instanceof BottomAppBar) {
                this.nativeViewProtected.removeView(childView);
                this.nativeViewProtected.removeView(fabChildView);
            } else {
                this.contentLayout.removeView(childView);
            }
            if (traceEnabled()) {
                traceWrite(`${nativeView}.removeView(${childView})`, traceCategories.VisualTreeEvents);
                traceNotifyEvent(child, 'childInLayoutRemovedFromNativeVisualTree');
            }
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
