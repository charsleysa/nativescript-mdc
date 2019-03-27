import { Color } from 'tns-core-modules/color/color';
import { fromResource } from 'tns-core-modules/image-source/image-source';
import { ad } from 'tns-core-modules/utils/utils';

import {
    activeColorCssProperty,
    activeColorProperty,
    backgroundColorCssProperty,
    backgroundColorProperty,
    BottomNavigationBase,
    BottomNavigationTabBase,
    inactiveColorCssProperty,
    inactiveColorProperty,
    tabsProperty,
    titleVisibilityProperty
} from './bottomNavigation-common';

import BitmapDrawable = android.graphics.drawable.BitmapDrawable;
import BottomNavigationView = android.support.design.widget.BottomNavigationView;
import MenuBuilder = android.support.v7.view.menu.MenuBuilder;

enum LabelVisibilityMode {
    /**
     * Label behaves as "labeled" when there are 3 items or less, or "selected" when there are 4 items
     * or more.
     */
    LABEL_VISIBILITY_AUTO = -1,

    /** Label is shown on the selected navigation item. */
    LABEL_VISIBILITY_SELECTED = 0,

    /** Label is shown on all navigation items. */
    LABEL_VISIBILITY_LABELED = 1,

    /** Label is not shown on any navigation items. */
    LABEL_VISIBILITY_UNLABELED = 2
}

export class BottomNavigation extends BottomNavigationBase {
    nativeViewProtected: BottomNavigationView;

    get android(): any {
        return this.nativeViewProtected;
    }

    createNativeView(): Object {
        const view = new BottomNavigationView(this._context);
        const owner = new WeakRef(this);

        view.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener({
            onNavigationItemSelected: function (item: android.view.MenuItem): boolean {
                if (this.owner) {
                    const bar: BottomNavigation = owner.get();
                    const index = item.getItemId();
                    const selectable = bar.tabs[index].selectable;
                    if (selectable) {
                        bar.onTabSelected(index);
                        return true;
                    } else {
                        return false;
                    }
                }

                return true;
            }
        }));

        return view;
    }

    initNativeView(): void {
        this.setTabColors(new Color(this.activeColor), new Color(this.inactiveColor));
        this.nativeViewProtected.setBackgroundColor(new Color(this.backgroundColor).android);
    }

    createTabs(tabs: BottomNavigationTab[]) {
        if (!this.tabs) { this.tabs = tabs; }
        const menu: android.view.Menu = this.nativeViewProtected.getMenu();
        menu.clear();
        for (const tabIndex in tabs) {
            const tab = tabs[tabIndex];
            const tabBarItem = menu.add(android.view.Menu.NONE, Number(tabIndex), android.view.Menu.NONE, tab.title);
            tabBarItem.setEnabled(tab.selectable);

            const iconDrawable = new android.graphics.drawable.StateListDrawable();
            if (tab.selectedIcon != null) {
                const iconSelectedDrawable = new BitmapDrawable(fromResource(tab.selectedIcon).android);
                const state = Array.create('int', 1);
                state[0] = this.getResourceId('android:attr/state_checked');
                iconDrawable.addState(state, iconSelectedDrawable);
            }
            const iconDefaultDrawable = new BitmapDrawable(fromResource(tab.icon).android);
            iconDrawable.addState(Array.create('int', 0), iconDefaultDrawable);

            tabBarItem.setIcon(iconDrawable);
        }
        // Disable the bottom navigation callback when setting the item (match iOS behavior)
        const menuBuilder = menu as any; /** MenuBuilder */
        const cb = this.getField(MenuBuilder.class, menuBuilder, 'mCallback');
        menuBuilder.setCallback(null);
        this.nativeViewProtected.setSelectedItemId(this.selectedTabIndex);
        menuBuilder.setCallback(cb);
    }

    private setTabColors(activeColor: Color, inactiveColor: Color) {
        const state = Array.create('int', 1);
        state[0] = this.getResourceId('android:attr/state_checked');
        const states = java.lang.reflect.Array.newInstance(state.getClass(), 2);
        states[0] = state;
        states[1] = Array.create('int', 0);
        const colors = Array.create('int', 2);
        colors[0] = activeColor.android;
        colors[1] = inactiveColor.android;
        const colorStateList = new android.content.res.ColorStateList(states, colors);
        this.nativeViewProtected.setItemIconTintList(colorStateList);
        this.nativeViewProtected.setItemTextColor(colorStateList);
    }

    private getResourceId(name: string): number {
        const resources: android.content.res.Resources = ad.getApplication().getResources();
        return resources.getIdentifier(name, null, null);
    }

    private getField(
        targetClass: java.lang.Class<any>,
        instance: java.lang.Object,
        fieldName: string
    ): any {
        try {
            const field = targetClass.getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(instance);
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    private setField(
        targetClass: java.lang.Class<any>,
        instance: java.lang.Object,
        fieldName: string,
        value: any
    ) {
        try {
            const field = targetClass.getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(instance, value);
        } catch (e) {
            console.log(e);
        }
    }

    [tabsProperty.getDefault](): BottomNavigationTab[] {
        return null;
    }

    [tabsProperty.setNative](value: BottomNavigationTab[]) {
        this.createTabs(value);
    }

    [titleVisibilityProperty.getDefault](): string {
        switch ((this.nativeViewProtected as any).getLabelVisibilityMode()) {
            case LabelVisibilityMode.LABEL_VISIBILITY_UNLABELED:
                return 'never';
            case LabelVisibilityMode.LABEL_VISIBILITY_LABELED:
                return 'always';
            case LabelVisibilityMode.LABEL_VISIBILITY_SELECTED:
            default:
                return 'selected';
        }
    }

    [titleVisibilityProperty.setNative](value: string) {
        switch (value) {
            case 'never':
                (this.nativeViewProtected as any).setLabelVisibilityMode(LabelVisibilityMode.LABEL_VISIBILITY_UNLABELED);
                break;
            case 'always':
                (this.nativeViewProtected as any).setLabelVisibilityMode(LabelVisibilityMode.LABEL_VISIBILITY_LABELED);
                break;
            case 'selected':
            default:
                (this.nativeViewProtected as any).setLabelVisibilityMode(LabelVisibilityMode.LABEL_VISIBILITY_SELECTED);
                break;
        }
    }

    [activeColorProperty.setNative](activeColor: string) {
        this.setTabColors(new Color(activeColor), new Color(this.inactiveColor));
    }

    [activeColorCssProperty.setNative](activeColor: Color) {
        this.setTabColors(activeColor, new Color(this.inactiveColor));
    }

    [inactiveColorProperty.setNative](inactiveColor: string) {
        this.setTabColors(new Color(this.activeColor), new Color(inactiveColor));
    }

    [inactiveColorCssProperty.setNative](inactiveColor: Color) {
        this.setTabColors(new Color(this.activeColor), inactiveColor);
    }

    [backgroundColorProperty.setNative](backgroundColor: string) {
        this.nativeViewProtected.setBackgroundColor(new Color(backgroundColor).android);
    }

    [backgroundColorCssProperty.setNative](backgroundColor: Color) {
        this.nativeViewProtected.setBackgroundColor(backgroundColor.android);
    }

    protected selectTabNative(index: number): void {
        this.nativeViewProtected.setSelectedItemId(index);
    }

}

export class BottomNavigationTab extends BottomNavigationTabBase {
    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>) {
        super(title, icon, selectedIcon, selectable, parent);
    }
}
