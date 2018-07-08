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
    keyLineColorProperty,
    keyLineColorCssProperty,
} from './bottomNavigation-common';
import { Color } from 'tns-core-modules/color';
import { fromResource } from 'tns-core-modules/image-source';

const BitmapDrawable = android.graphics.drawable.BitmapDrawable;
const BottomNavigationView = (android.support as any).design.widget.BottomNavigationView;
let AHBottomNavigationItem = com.aurelhubert.ahbottomnavigation.AHBottomNavigationItem;

export class BottomNavigation extends BottomNavigationBase {

    get android(): any {
        return this.nativeView;
    }

    createNativeView(): Object {
        this.nativeView = new BottomNavigationView(this._context);
        let owner = new WeakRef(this);

        this.nativeView.setOnTabSelectedListener(new BottomNavigationView.OnNavigationItemSelectedListener(
            {
                get owner(): BottomNavigation {
                    return owner.get();
                },
                onNavigationItemSelected: function (item: android.view.MenuItem): boolean {
                    if (this.owner) {
                        return this.owner.onTabSelected(item);
                    }

                    return true;
                }
            }
        ));

        return this.nativeView;
    }

    initNativeView(): void {
        this.nativeView.setTitleState(AHBottomNavigation.TitleState.ALWAYS_SHOW);
        this.nativeView.setAccentColor(new Color(this.activeColor).android);
        this.nativeView.setInactiveColor(new Color(this.inactiveColor).android);
        this.nativeView.setColored(false);
        this.nativeView.setDefaultBackgroundColor(new Color(this.backgroundColor).android);
    }

    createTabs(tabs: BottomNavigationTab[]) {
        if (!this.tabs) { this.tabs = tabs; }
        for (let tab of tabs) {
            let icon = new BitmapDrawable(fromResource(tab.icon).android);
            let item = new AHBottomNavigationItem(tab.title, icon, new Color('white').android);
            this.nativeView.addItem(item);
        }
        this.nativeView.setCurrentItem(this.selectedTabIndex);
    }

    [tabsProperty.getDefault](): BottomNavigationTab[] {
        return null;
    }

    [tabsProperty.setNative](value: BottomNavigationTab[]) {
        this.createTabs(value);
    }

    [activeColorProperty.setNative](activeColor: string) {
        this.nativeView.setAccentColor(new Color(activeColor).android);
    }

    [activeColorCssProperty.setNative](activeColor: Color) {
        this.nativeView.setAccentColor(activeColor.android);
    }

    [inactiveColorProperty.setNative](inactiveColor: string) {
        this.nativeView.setInactiveColor(new Color(inactiveColor).android);
    }

    [inactiveColorCssProperty.setNative](inactiveColor: Color) {
        this.nativeView.setInactiveColor(inactiveColor.android);
    }

    [backgroundColorProperty.setNative](backgroundColor: string) {
        this.nativeView.setDefaultBackgroundColor(new Color(backgroundColor).android);
    }

    [backgroundColorCssProperty.setNative](backgroundColor: Color) {
        this.nativeView.setDefaultBackgroundColor(backgroundColor.android);
    }

    [keyLineColorProperty.setNative](keyLineColor: string) {
        // This inly works with ios
    }

    [keyLineColorCssProperty.setNative](keyLineColor: Color) {
        // This inly works with ios
    }

    protected selectTabNative(index: number): void {
        this.nativeView.setCurrentItem(index);
    }

}

export class BottomNavigationTab extends BottomNavigationTabBase {
    constructor(title: string, icon: string, selectable?: boolean, parent?: WeakRef<BottomNavigationBase>) {
        super(title, icon, selectable, parent);
    }
}