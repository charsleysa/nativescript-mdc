import { Color } from 'tns-core-modules/color/color';
import { fromResource } from 'tns-core-modules/image-source/image-source';
import { screen } from 'tns-core-modules/platform/platform';
import { ios as iosApp } from 'tns-core-modules/application/application';
import { ios as iosView, layout } from 'tns-core-modules/ui/core/view';

import { themer } from '../core/core';

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
        this.nativeViewProtected.selectedItemTintColor = new Color(this.activeColor).ios;
        this.nativeViewProtected.selectedItemTitleColor = new Color(this.activeColor).ios;
        this.nativeViewProtected.unselectedItemTintColor = new Color(this.inactiveColor).ios;
        this.nativeViewProtected.barTintColor = new Color(this.backgroundColor).ios;
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

    [activeColorProperty.setNative](activeColor: string) {
        this.nativeViewProtected.selectedItemTintColor = new Color(activeColor).ios;
        this.nativeViewProtected.selectedItemTitleColor = new Color(activeColor).ios;
    }

    [activeColorCssProperty.setNative](activeColor: Color) {
        this.nativeViewProtected.selectedItemTintColor = activeColor.ios;
        this.nativeViewProtected.selectedItemTitleColor = activeColor.ios;
    }

    [inactiveColorProperty.setNative](inactiveColor: string) {
        this.nativeViewProtected.unselectedItemTintColor = new Color(inactiveColor).ios;
    }

    [inactiveColorCssProperty.setNative](inactiveColor: Color) {
        this.nativeViewProtected.unselectedItemTintColor = inactiveColor.ios;
    }

    [backgroundColorProperty.setNative](backgroundColor: string) {
        this.nativeViewProtected.barTintColor = new Color(backgroundColor).ios;
    }

    [backgroundColorCssProperty.setNative](backgroundColor: Color) {
        this.nativeViewProtected.barTintColor = backgroundColor.ios;
    }

    protected selectTabNative(index: number): void {
        this.nativeViewProtected.selectedItem = this.nativeViewProtected.items[index];
    }
}

export class BottomNavigationTab extends BottomNavigationTabBase {

    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>) {
        super(title, icon, selectedIcon, selectable, parent);
    }
}
