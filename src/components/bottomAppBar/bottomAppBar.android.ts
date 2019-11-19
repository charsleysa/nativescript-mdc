import { Color } from 'tns-core-modules/color/color';
import { Page } from 'tns-core-modules/ui/page/page';
import { ad, RESOURCE_PREFIX } from 'tns-core-modules/utils/utils';
import { fromFileOrResource } from 'tns-core-modules/image-source';
import * as application from 'tns-core-modules/application';
import { backgroundColorProperty } from 'tns-core-modules/ui/core/view';
import { Background } from 'tns-core-modules/ui/styling/background';

import { AndroidActionItemSettings } from './bottomAppBar';
import { ActionItemBase, BottomAppBarBase, MainActionButtonBase, isVisible, View, traceMissingIcon } from './bottomAppBar-common';

export * from './bottomAppBar-common';

declare module '@nativescript/core/ui/frame' {
    interface Frame {
        _getNavBarVisible(page: Page): boolean;
    }
}

const R_ID_HOME = 0x0102002c;
const ACTION_ITEM_ID_OFFSET = 10000;

let actionItemIdGenerator = ACTION_ITEM_ID_OFFSET;
function generateItemId(): number {
    actionItemIdGenerator++;
    return actionItemIdGenerator;
}

interface MenuItemClickListener {
    new(owner: BottomAppBar): androidx.appcompat.widget.Toolbar.OnMenuItemClickListener;
}

let appResources: android.content.res.Resources;
let MenuItemClickListener: MenuItemClickListener;

function initializeMenuItemClickListener(): void {
    if (MenuItemClickListener) {
        return;
    }

    @Interfaces([androidx.appcompat.widget.Toolbar.OnMenuItemClickListener])
    class MenuItemClickListenerImpl extends java.lang.Object implements androidx.appcompat.widget.Toolbar.OnMenuItemClickListener {
        constructor(public owner: BottomAppBar) {
            super();
            return global.__native(this);
        }

        onMenuItemClick(item: android.view.MenuItem): boolean {
            const itemId = item.getItemId();
            return this.owner._onAndroidItemSelected(itemId);
        }
    }

    MenuItemClickListener = MenuItemClickListenerImpl;
    appResources = application.android.context.getResources();
}

export class ActionItem extends ActionItemBase {
    private _androidPosition: AndroidActionItemSettings = {
        position: 'bottomAppBar',
        systemIcon: undefined
    };

    private _itemId;
    constructor() {
        super();
        this._itemId = generateItemId();
    }

    public get android(): AndroidActionItemSettings {
        return this._androidPosition;
    }
    public set android(value: AndroidActionItemSettings) {
        throw new Error('ActionItem.android is read-only');
    }

    public _getItemId() {
        return this._itemId;
    }
}

export class NavigationButton extends ActionItem {}

export class MainActionButton extends MainActionButtonBase {
    constructor() {
        super();
    }
}

export class BottomAppBar extends BottomAppBarBase {
    public nativeViewProtected: com.google.android.material.bottomappbar.BottomAppBar;
    public floatingActionButton: com.google.android.material.floatingactionbutton.FloatingActionButton;

    constructor() {
        super();
    }

    get android(): com.google.android.material.bottomappbar.BottomAppBar {
        return this.nativeViewProtected;
    }

    public _addChildFromBuilder(name: string, value: any) {
        if (value instanceof MainActionButton) {
            this.mainActionButton = value;
        } else if (value instanceof NavigationButton) {
            this.navigationButton = value;
        } else if (value instanceof ActionItem) {
            this.actionItems.addItem(value);
        }
    }

    public createNativeView() {
        // Need the null for second param to workaround bug: https://github.com/material-components/material-components-android/issues/424
        const bottomAppBar = new com.google.android.material.bottomappbar.BottomAppBar(this._context, null);
        bottomAppBar.setId(android.view.View.generateViewId());
        bottomAppBar.setFabAlignmentMode(com.google.android.material.bottomappbar.BottomAppBar.FAB_ALIGNMENT_MODE_CENTER);
        bottomAppBar.setHideOnScroll(true);

        this.floatingActionButton = new com.google.android.material.floatingactionbutton.FloatingActionButton(this._context);
        this.floatingActionButton.setScaleType(android.widget.ImageView.ScaleType.CENTER);
        this.floatingActionButton.hide();

        return bottomAppBar;
    }

    public initNativeView(): void {
        super.initNativeView();
        initializeMenuItemClickListener();
        const menuItemClickListener = new MenuItemClickListener(this);
        this.nativeViewProtected.setOnMenuItemClickListener(menuItemClickListener);
        (<any>this.nativeViewProtected).menuItemClickListener = menuItemClickListener;
    }

    public disposeNativeView() {
        (<any>this.nativeViewProtected).menuItemClickListener.owner = null;
        super.disposeNativeView();
    }

    public onLoaded() {
        super.onLoaded();
        this.update();
    }

    public update() {
        if (!this.nativeViewProtected) {
            return;
        }

        // Add menu items
        this._addActionItems();

        // Set main action button
        this._updateMainActionButton();

        // Set navigation button
        this._updateNavigationButton();
    }

    public _onAndroidItemSelected(itemId: number): boolean {
        // Handle home button
        if (this.navigationButton && itemId === R_ID_HOME) {
            this.navigationButton._raiseTap();
            return true;
        }

        // Find item with the right ID;
        let menuItem: ActionItem = undefined;
        const items = this.actionItems.getItems();
        for (let i = 0; i < items.length; i++) {
            if ((<ActionItem>items[i])._getItemId() === itemId) {
                menuItem = <ActionItem>items[i];
                break;
            }
        }

        if (menuItem) {
            menuItem._raiseTap();
            return true;
        }

        return false;
    }

    public _updateMainActionButton() {
        const mainActionButton = this.mainActionButton;
        if (mainActionButton && isVisible(mainActionButton)) {
            if (mainActionButton.icon) {
                const drawableOrId = getDrawableOrResourceId(mainActionButton.icon, appResources);
                if (drawableOrId) {
                    if (typeof drawableOrId === 'number') {
                        this.floatingActionButton.setImageResource(drawableOrId);
                    } else {
                        this.floatingActionButton.setImageDrawable(drawableOrId);
                    }
                }
            }

            // Set content description, used by screen readers for the vision-impaired users
            this.floatingActionButton.setContentDescription(mainActionButton.text || null);

            const background = mainActionButton.style.backgroundInternal;
            if (background && background.color) {
                this.floatingActionButton.setSupportBackgroundTintList(android.content.res.ColorStateList.valueOf(background.color.android));
            }

            const tintColor = mainActionButton.style.tintColor;
            const iconDrawable = this.floatingActionButton.getDrawable();
            if (iconDrawable) {
                if (tintColor == null) {
                    this.floatingActionButton.setSupportImageTintList(android.content.res.ColorStateList.valueOf(android.graphics.Color.TRANSPARENT));
                    this.floatingActionButton.setSupportImageTintMode(android.graphics.PorterDuff.Mode.OVERLAY);
                } else {
                    this.floatingActionButton.setSupportImageTintList(android.content.res.ColorStateList.valueOf(tintColor.android));
                    this.floatingActionButton.setSupportImageTintMode(android.graphics.PorterDuff.Mode.SRC_IN);
                }
            }

            const mainActionBtn = new WeakRef(mainActionButton);
            this.floatingActionButton.setOnClickListener(new android.view.View.OnClickListener({
                onClick: function (v) {
                    const owner = mainActionBtn.get();
                    if (owner) {
                        owner._raiseTap();
                    }
                }
            }));

            this.floatingActionButton.show();
        } else {
            this.floatingActionButton.setOnClickListener(null);
            this.floatingActionButton.hide();
        }
    }

    public _updateNavigationButton() {
        const navButton = this.navigationButton;
        if (navButton && isVisible(navButton)) {
            const systemIcon = navButton.android.systemIcon;
            if (systemIcon !== undefined) {
                // Try to look in the system resources.
                const systemResourceId = getSystemResourceId(systemIcon);
                if (systemResourceId) {
                    this.nativeViewProtected.setNavigationIcon(systemResourceId);
                }
            } else if (navButton.icon) {
                const drawableOrId = getDrawableOrResourceId(navButton.icon, appResources);
                if (drawableOrId) {
                    this.nativeViewProtected.setNavigationIcon(drawableOrId);
                }
            }

            // Set navigation content descripion, used by screen readers for the vision-impaired users
            this.nativeViewProtected.setNavigationContentDescription(navButton.text || null);

            const tintColor = navButton.style.tintColor;
            const iconDrawable = this.nativeViewProtected.getNavigationIcon();
            if (iconDrawable) {
                if (tintColor == null) {
                    iconDrawable.setColorFilter(android.graphics.Color.TRANSPARENT, android.graphics.PorterDuff.Mode.OVERLAY);
                } else {
                    iconDrawable.setColorFilter(tintColor.android, android.graphics.PorterDuff.Mode.SRC_IN);
                }
            }

            const navBtn = new WeakRef(navButton);
            this.nativeViewProtected.setNavigationOnClickListener(new android.view.View.OnClickListener({
                onClick: function (v) {
                    const owner = navBtn.get();
                    if (owner) {
                        owner._raiseTap();
                    }
                }
            }));
        } else {
            this.nativeViewProtected.setNavigationOnClickListener(null);
            this.nativeViewProtected.setNavigationIcon(null);
        }
    }

    public _addActionItems() {
        const menu = this.nativeViewProtected.getMenu();
        const items = this.actionItems.getVisibleItems();

        menu.clear();
        for (let i = 0; i < items.length; i++) {
            const item = <ActionItem>items[i];
            const menuItem = menu.add(android.view.Menu.NONE, item._getItemId(), android.view.Menu.NONE, item.text + '');

            if (item.actionView && item.actionView.android) {
                // With custom action view, the menuitem cannot be displayed in a popup menu.
                item.android.position = 'bottomAppBar';
                menuItem.setActionView(item.actionView.android);
                BottomAppBar._setOnClickListener(item);
            } else if (item.android.systemIcon) {
                // Try to look in the system resources.
                const systemResourceId = getSystemResourceId(item.android.systemIcon);
                if (systemResourceId) {
                    menuItem.setIcon(systemResourceId);
                }
            } else if (item.icon) {
                const drawableOrId = getDrawableOrResourceId(item.icon, appResources);
                if (drawableOrId) {
                    menuItem.setIcon(drawableOrId);
                }
            }

            const tintColor = item.style.tintColor;
            if (tintColor == null) {
                menuItem.setIconTintList(android.content.res.ColorStateList.valueOf(android.graphics.Color.TRANSPARENT));
                menuItem.setIconTintMode(android.graphics.PorterDuff.Mode.OVERLAY);
            } else {
                menuItem.setIconTintList(android.content.res.ColorStateList.valueOf(tintColor.android));
                menuItem.setIconTintMode(android.graphics.PorterDuff.Mode.SRC_IN);
            }

            const showAsAction = getShowAsAction(item);
            menuItem.setShowAsAction(showAsAction);
        }
    }

    private static _setOnClickListener(item: ActionItem): void {
        const weakRef = new WeakRef(item);
        item.actionView.android.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function (v: android.view.View) {
                const owner = weakRef.get();
                if (owner) {
                    owner._raiseTap();
                }
            }
        }));
    }

    public _addViewToNativeVisualTree(child: View, atIndex: number = Number.MAX_VALUE): boolean {
        super._addViewToNativeVisualTree(child);

        if (this.nativeViewProtected && child.nativeViewProtected) {
            if (atIndex >= this.nativeViewProtected.getChildCount()) {
                this.nativeViewProtected.addView(child.nativeViewProtected);
            } else {
                this.nativeViewProtected.addView(child.nativeViewProtected, atIndex);
            }
            return true;
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: View): void {
        super._removeViewFromNativeVisualTree(child);

        if (this.nativeViewProtected && child.nativeViewProtected) {
            this.nativeViewProtected.removeView(child.nativeViewProtected);
        }
    }

    [backgroundColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getBackgroundTint().getDefaultColor());
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setBackgroundTint(android.content.res.ColorStateList.valueOf(value.android));
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }
}

// @ts-ignore
BottomAppBar.prototype.recycleNativeView = 'auto';

function getDrawableOrResourceId(icon: string, resources: android.content.res.Resources): any {
    if (typeof icon !== 'string') {
        return undefined;
    }

    let result = undefined;
    if (icon.indexOf(RESOURCE_PREFIX) === 0) {
        const resourceId: number = resources.getIdentifier(icon.substr(RESOURCE_PREFIX.length), 'drawable', application.android.packageName);
        if (resourceId > 0) {
            result = resourceId;
        }
    } else {
        let drawable: android.graphics.drawable.BitmapDrawable;

        const is = fromFileOrResource(icon);
        if (is) {
            drawable = new android.graphics.drawable.BitmapDrawable(resources, is.android);
        }

        result = drawable;
    }

    if (!result) {
        traceMissingIcon(icon);
    }

    return result;
}

function getShowAsAction(menuItem: ActionItem): number {
    switch (menuItem.android.position) {
        case 'bottomAppBarIfRoom':
            return android.view.MenuItem.SHOW_AS_ACTION_IF_ROOM;

        case 'popup':
            return android.view.MenuItem.SHOW_AS_ACTION_NEVER;

        case 'bottomAppBar':
        default:
            return android.view.MenuItem.SHOW_AS_ACTION_ALWAYS;
    }
}

function getSystemResourceId(systemIcon: string): number {
    return android.content.res.Resources.getSystem().getIdentifier(systemIcon, 'drawable', 'android');
}
