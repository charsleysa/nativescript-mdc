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
import { screen } from 'tns-core-modules/platform/platform';
import { ios } from 'tns-core-modules/application/application';

declare const MDCBottomNavigationBar: any;
type MDCBottomNavigationBar = any;
declare const
    MDCBottomNavigationBarTitleVisibilitySelected: any,
    MDCBottomNavigationBarTitleVisibilityAlways: any,
    MDCBottomNavigationBarTitleVisibilityNever: any;

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

    private _delegate: BottomNavigationDelegate;

    get ios(): any {
        return this.nativeView;
    }

    createNativeView() {
        this._delegate = BottomNavigationDelegate.initWithOwner(new WeakRef(this));
        this.nativeView = MDCBottomNavigationBar.alloc().init();
        let bottomSafeArea = 0;
        if (ios.window.safeAreaInsets) {
            bottomSafeArea = ios.window.safeAreaInsets.bottom;
        }
        const bottomBarHeight = 56 + bottomSafeArea;
        this.nativeView.frame = CGRectMake(0, screen.mainScreen.heightDIPs - bottomBarHeight, screen.mainScreen.widthDIPs, bottomBarHeight);

        return this.nativeView;
    }

    initNativeView(): void {
        this.nativeView.selectedItemTintColor = new Color(this.activeColor).ios;
        this.nativeView.selectedItemTitleColor = new Color(this.activeColor).ios;
        this.nativeView.unselectedItemTintColor = new Color(this.inactiveColor).ios;
        this.nativeView.unselectedItemTitleColor = new Color(this.inactiveColor).ios;
        this.nativeView.barTintColor = new Color(this.backgroundColor).ios;
    }

    disposeNativeView() {
        this._delegate = null;
    }

    onLoaded() {
        this.nativeView.delegate = this._delegate;
        super.onLoaded();
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
        this.nativeView.items = bottomNavigationTabs;
        this.nativeView.selectedItem = bottomNavigationTabs[this.selectedTabIndex];
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
                this.nativeView.titleVisibility = MDCBottomNavigationBarTitleVisibilityNever;
                break;
            case 'always':
                this.nativeView.titleVisibility = MDCBottomNavigationBarTitleVisibilityAlways;
                break;
            case 'selected':
            default:
                this.nativeView.titleVisibility = MDCBottomNavigationBarTitleVisibilitySelected;
                break;
        }
    }

    [activeColorProperty.setNative](activeColor: string) {
        this.nativeView.selectedItemTintColor = new Color(activeColor).ios;
        this.nativeView.selectedItemTitleColor = new Color(activeColor).ios;
    }

    [activeColorCssProperty.setNative](activeColor: Color) {
        this.nativeView.selectedItemTintColor = activeColor.ios;
        this.nativeView.selectedItemTitleColor = activeColor.ios;
    }

    [inactiveColorProperty.setNative](inactiveColor: string) {
        this.nativeView.unselectedItemTintColor = new Color(inactiveColor).ios;
        this.nativeView.unselectedItemTitleColor = new Color(inactiveColor).ios;
    }

    [inactiveColorCssProperty.setNative](inactiveColor: Color) {
        this.nativeView.unselectedItemTintColor = inactiveColor.ios;
        this.nativeView.unselectedItemTitleColor = inactiveColor.ios;
    }

    [backgroundColorProperty.setNative](backgroundColor: string) {
        this.nativeView.barTintColor = new Color(backgroundColor).ios;
    }

    [backgroundColorCssProperty.setNative](backgroundColor: Color) {
        this.nativeView.barTintColor = backgroundColor.ios;
    }

    protected selectTabNative(index: number): void {
        this.nativeView.selectedItem = this.nativeView.items[index];
    }
}

export class BottomNavigationTab extends BottomNavigationTabBase {

    constructor(title: string, icon: string, selectedIcon?: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>) {
        super(title, icon, selectedIcon, selectable, parent);
    }
}
