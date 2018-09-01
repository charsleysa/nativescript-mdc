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
import { Color } from 'tns-core-modules/color/color';
import { fromResource } from 'tns-core-modules/image-source/image-source';
import { ad } from 'tns-core-modules/utils/utils';

const BitmapDrawable = android.graphics.drawable.BitmapDrawable;
const BottomNavigationView = (android.support as any).design.widget.BottomNavigationView;

export class BottomNavigation extends BottomNavigationBase {

    get android(): any {
        return this.nativeView;
    }

    createNativeView(): Object {
        this.nativeView = new BottomNavigationView(this._context);
        const owner = new WeakRef(this);

        this.nativeView.setOnNavigationItemSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener({
            get owner(): BottomNavigation {
                return owner.get();
            },
            onNavigationItemSelected: function (item: android.view.MenuItem): boolean {
                if (this.owner) {
                    const bar: BottomNavigation = this.owner;
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

        return this.nativeView;
    }

    initNativeView(): void {
        this.enableItemShiftMode(false);
        this.setTabColors(new Color(this.activeColor), new Color(this.inactiveColor));
        this.nativeView.setBackgroundColor(new Color(this.backgroundColor).android);
    }

    createTabs(tabs: BottomNavigationTab[]) {
        if (!this.tabs) { this.tabs = tabs; }
        const menu: android.view.Menu = this.nativeView.getMenu();
        menu.clear();
        for (const tabIndex in tabs) {
            const tab = tabs[tabIndex];
            const tabBarItem = menu.add(android.view.Menu.NONE, Number(tabIndex), android.view.Menu.NONE, tab.title);

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
        // --- Reset shift
        switch (this.titleVisibility) {
            case 'never':
                // TODO
                this.enableItemShiftMode(false);
                break;
            case 'always':
                this.enableItemShiftMode(false);
                break;
            case 'selected':
            default:
                this.enableItemShiftMode(true);
                break;
        }
        // ----
        this.nativeView.setSelectedItemId(this.selectedTabIndex);
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
        this.nativeView.setItemIconTintList(colorStateList);
        this.nativeView.setItemTextColor(colorStateList);
    }

    private enableItemShiftMode(enable: boolean) {
        const menuView = this.getField(BottomNavigationView.class, this.nativeView, 'mMenuView');
        this.setField(menuView.getClass(), menuView, 'mShiftingMode', java.lang.Boolean.valueOf(false));
        const menuItems = this.getField(menuView.getClass(), menuView, 'mButtons');
        if (menuItems != null) {
            for (const item of menuItems) {
                this.setField(item.getClass(), item, 'mShiftingMode', java.lang.Boolean.valueOf(enable));
            }
            menuView.updateMenuView();
        }
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
        return 'selected';
    }

    [titleVisibilityProperty.setNative](value: string) {
        switch (value) {
            case 'never':
                // TODO
                this.enableItemShiftMode(false);
                break;
            case 'always':
                this.enableItemShiftMode(false);
                break;
            case 'selected':
            default:
                this.enableItemShiftMode(true);
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
        this.nativeView.setBackgroundColor(new Color(backgroundColor).android);
    }

    [backgroundColorCssProperty.setNative](backgroundColor: Color) {
        this.nativeView.setBackgroundColor(backgroundColor.android);
    }

    protected selectTabNative(index: number): void {
        this.nativeView.setSelectedItemId(index);
    }

}

export class BottomNavigationTab extends BottomNavigationTabBase {
    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>) {
        super(title, icon, selectedIcon, selectable, parent);
    }
}
