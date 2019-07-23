import { Color } from 'tns-core-modules/color/color';
import { fromResource } from 'tns-core-modules/image-source/image-source';
import { screen } from 'tns-core-modules/platform/platform';
import { ios as iosApp } from 'tns-core-modules/application/application';
import { ios as iosView, layout, backgroundColorProperty } from 'tns-core-modules/ui/core/view';

import { themer } from '../core/core';
import { getColor } from '../core/ios/utils';
import {
    activeColorProperty,
    BottomNavigationBase,
    BottomNavigationTabBase,
    inactiveColorProperty,
    tabsProperty,
    titleVisibilityProperty
} from './bottomNavigation-common';


declare module 'tns-core-modules/ui/core/view/view' {
    interface View {
        _setNativeViewFrame(nativeView: UIView, frame: CGRect): void;
    }
}

export declare class MDCBottomNavigationBarDelegate { }

class BottomNavigationDelegate extends NSObject {

    public static ObjCProtocols = [MDCBottomNavigationBarDelegate];
    private _owner: WeakRef<BottomNavigation>;

    public static initWithOwner(owner: WeakRef<BottomNavigation>): BottomNavigationDelegate {
        let delegate = <BottomNavigationDelegate>BottomNavigationDelegate.new() as BottomNavigationDelegate;
        delegate._owner = owner;

        return delegate;
    }

    public bottomNavigationBarShouldSelectItem(
        bottomNavigationBar: MDCBottomNavigationBar,
        item: UITabBarItem
    ): boolean {
        let bar: BottomNavigation = this._owner.get();
        return bar.tabs[item.tag].selectable;
    }

    public bottomNavigationBarDidSelectItem(
        bottomNavigationBar: MDCBottomNavigationBar,
        item: UITabBarItem
    ) {
        let bar: BottomNavigation = this._owner.get();
        bar.onTabSelected(item.tag);
    }
}

export class BottomNavigation extends BottomNavigationBase {
    nativeViewProtected: MDCBottomNavigationBar;

    private _delegate: BottomNavigationDelegate;

    get ios(): any {
        return this.nativeViewProtected;
    }

    createNativeView() {
        this._delegate = BottomNavigationDelegate.initWithOwner(new WeakRef(this));
        const view = MDCBottomNavigationBar.alloc().init();
        view.applyPrimaryThemeWithScheme(themer.appScheme);
        return view;
    }

    initNativeView(): void {
        this.nativeViewProtected.selectedItemTintColor = this.style.activeColor.ios;
        this.nativeViewProtected.selectedItemTitleColor = this.style.activeColor.ios;
        this.nativeViewProtected.unselectedItemTintColor = this.style.inactiveColor.ios;
    }

    disposeNativeView() {
        this._delegate = null;
    }

    onLoaded() {
        this.nativeViewProtected.delegate = this._delegate;
        super.onLoaded();
    }

    public layoutNativeView(left: number, top: number, right: number, bottom: number): void {
        if (!this.nativeViewProtected) {
            return;
        }

        const bottomSafeArea = (iosApp.window.safeAreaInsets) ? iosApp.window.safeAreaInsets.bottom : 0;
        const adjustmentPixels = layout.toDevicePixels(bottomSafeArea);

        const nativeView = this.nativeViewProtected;
        const frame = iosView.getFrameFromPosition(
            { left, top, right, bottom },
            { left: 0, top: -adjustmentPixels, right: 0, bottom: -adjustmentPixels }
        );
        this._setNativeViewFrame(nativeView, frame);
    }

    createTabs(tabs: BottomNavigationTab[]) {
        if (!this.tabs) { this.tabs = tabs; }
        const bottomNavigationTabs: UITabBarItem[] = [];
        for (const tabIndex in tabs) {
            const tab = tabs[tabIndex];
            tab.parent = new WeakRef(this);
            let tabBarItem = new UITabBarItem({ title: tab.title, image: fromResource(tab.icon).ios, tag: Number(tabIndex) });
            if (tab.selectedIcon != null) {
                tabBarItem.selectedImage = fromResource(tab.selectedIcon).ios;
            }
            bottomNavigationTabs.push(tabBarItem);
        }
        this.nativeViewProtected.items = bottomNavigationTabs as unknown as NSArray<UITabBarItem>;
        this.nativeViewProtected.selectedItem = bottomNavigationTabs[this.selectedTabIndex];
    }

    protected selectTabNative(index: number): void {
        this.nativeViewProtected.selectedItem = this.nativeViewProtected.items[index];
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
                this.nativeViewProtected.titleVisibility = MDCBottomNavigationBarTitleVisibility.Never;
                break;
            case 'always':
                this.nativeViewProtected.titleVisibility = MDCBottomNavigationBarTitleVisibility.Always;
                break;
            case 'selected':
            default:
                this.nativeViewProtected.titleVisibility = MDCBottomNavigationBarTitleVisibility.Selected;
                break;
        }
    }

    [activeColorProperty.getDefault](): Color {
        return getColor(this.nativeViewProtected.selectedItemTintColor);
    }

    [activeColorProperty.setNative](value: Color) {
        this.nativeViewProtected.selectedItemTintColor = value.ios;
        this.nativeViewProtected.selectedItemTitleColor = value.ios;
    }

    [inactiveColorProperty.setNative](): Color {
        return getColor(this.nativeViewProtected.unselectedItemTintColor);
    }

    [inactiveColorProperty.setNative](value: Color) {
        this.nativeViewProtected.unselectedItemTintColor = value.ios;
    }

    [backgroundColorProperty.getDefault](): Color {
        return getColor(this.nativeViewProtected.barTintColor);
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.barTintColor = value.ios;
    }
}

export class BottomNavigationTab extends BottomNavigationTabBase {

    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>) {
        super(title, icon, selectedIcon, selectable, parent);
    }
}
