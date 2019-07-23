import { Color } from 'tns-core-modules/color/color';
import { fromFileOrResource } from 'tns-core-modules/image-source';
import { ios as iosApp } from 'tns-core-modules/application/application';
import { ios as iosView, backgroundColorProperty } from 'tns-core-modules/ui/core/view';
import { ios as iosUtils } from 'tns-core-modules/utils/utils';
import { ios as iosBackground, Background } from 'tns-core-modules/ui/styling/background';

import { themer } from '../core/core';
import { getColor } from '../core/ios/utils';
import { IOSActionItemSettings, ActionItem as ActionItemDefinition } from './bottomAppBar';
import {
    ActionItemBase,
    BottomAppBarBase,
    MainActionButtonBase,
    isVisible,
    View,
    iosIconRenderingModeProperty,
    layout,
    traceMissingIcon
} from './bottomAppBar-common';

export * from './bottomAppBar-common';

declare module 'tns-core-modules/ui/core/view/view' {
    interface View {
        _isPresentationLayerUpdateSuspeneded(): boolean;
        _nativeBackgroundState: string;
        _setNativeViewFrame(nativeView: UIView, frame: CGRect): void;
    }
}

const majorVersion = iosUtils.MajorVersion;
const UNSPECIFIED = layout.makeMeasureSpec(0, layout.UNSPECIFIED);

function loadActionIconFromFileOrResource(icon: string): UIImage {
    const img = fromFileOrResource(icon);
    if (img && img.ios) {
        return img.ios;
    } else {
        traceMissingIcon(icon);

        return null;
    }
}

class TapItemHandlerImpl extends NSObject {
    private _owner: WeakRef<ActionItemDefinition | MainActionButtonBase>;

    public static initWithOwner(owner: WeakRef<ActionItemDefinition | MainActionButtonBase>): TapItemHandlerImpl {
        let handler = <TapItemHandlerImpl>TapItemHandlerImpl.new();
        handler._owner = owner;

        return handler;
    }

    public tap(args) {
        let owner = this._owner.get();
        if (owner) {
            owner._raiseTap();
        }
    }

    public static ObjCExposedMethods = {
        'tap': { returns: interop.types.void, params: [interop.types.id] }
    };
}

export class ActionItem extends ActionItemBase {
    private _ios: IOSActionItemSettings = {
        position: 'right',
        systemIcon: undefined
    };

    public get ios(): IOSActionItemSettings {
        return this._ios;
    }
    public set ios(value: IOSActionItemSettings) {
        throw new Error('ActionItem.ios is read-only');
    }
}

export class NavigationButton extends ActionItem {}

export class MainActionButton extends MainActionButtonBase {
    constructor() {
        super();
    }
}

export class BottomAppBar extends BottomAppBarBase {
    public nativeViewProtected: MDCBottomAppBarView;

    get ios(): MDCBottomAppBarView {
        return this.nativeViewProtected;
    }

    constructor() {
        super();
    }

    public createNativeView(): MDCBottomAppBarView {
        const bottomAppBar = MDCBottomAppBarView.alloc().initWithFrame(CGRectZero);
        bottomAppBar.floatingButton.applySecondaryThemeWithScheme(themer.appScheme);
        const colorScheme = themer.appColorScheme;
        if (colorScheme) {
            MDCBottomAppBarColorThemer.applySurfaceVariantWithSemanticColorSchemeToBottomAppBarView(colorScheme, bottomAppBar);
        }
        bottomAppBar.autoresizingMask = UIViewAutoresizing.FlexibleWidth | UIViewAutoresizing.FlexibleTopMargin;
        bottomAppBar.setFloatingButtonHiddenAnimated(true, false);
        return bottomAppBar;
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

    private _getIconRenderingMode(): UIImageRenderingMode {
        switch (this.iosIconRenderingMode) {
            case 'alwaysOriginal':
                return UIImageRenderingMode.AlwaysOriginal;
            case 'alwaysTemplate':
                return UIImageRenderingMode.AlwaysTemplate;
            case 'automatic':
            default:
                return UIImageRenderingMode.Automatic;
        }
    }

    public update() {
        if (!this.nativeViewProtected) {
            return;
        }

        this.updateMainActionButton();

        // Populate action items
        this.populateMenuItems();
    }

    private updateMainActionButton() {
        const fab = this.nativeViewProtected.floatingButton;

        if (this.mainActionButton && isVisible(this.mainActionButton)) {
            const tapHandler = TapItemHandlerImpl.initWithOwner(new WeakRef(this.mainActionButton));
            // associate handler with menuItem or it will get collected by JSC.
            (<any>fab).handler = tapHandler;

            fab.addTargetActionForControlEvents(tapHandler, 'tap', UIControlEvents.TouchUpInside);

            if (this.mainActionButton.icon) {
                const img = loadActionIconFromFileOrResource(this.mainActionButton.icon);
                const image = img.imageWithRenderingMode(this._getIconRenderingMode());
                fab.setImageForState(image, UIControlState.Normal);
            }

            if (this.mainActionButton.text) {
                fab.isAccessibilityElement = true;
                fab.accessibilityLabel = this.mainActionButton.text;
                fab.accessibilityTraits = UIAccessibilityTraitButton;
            }

            const background = this.mainActionButton.style.backgroundInternal;
            if (background && background.color) {
                fab.underlyingColorHint = background.color.ios;
                fab.setBackgroundColorForState(background.color.ios, UIControlState.Normal);
            }
            const tintColor = this.mainActionButton.style.tintColor;
            if (tintColor) {
                fab.setTitleColorForState(tintColor.ios, UIControlState.Normal);
                fab.setImageTintColorForState(tintColor.ios, UIControlState.Normal);
            }

            this.nativeViewProtected.setFloatingButtonHiddenAnimated(false, true);
        } else {
            if ((<any>fab).handler) {
                fab.removeTargetActionForControlEvents((<any>fab).handler, 'tap', UIControlEvents.TouchUpInside);
            }

            this.nativeViewProtected.setFloatingButtonHiddenAnimated(true, true);
        }
    }

    private populateMenuItems() {
        const items = this.actionItems.getVisibleItems();
        const leftBarItems = [];
        const rightBarItems = [];

        if (this.navigationButton && isVisible(this.navigationButton)) {
            const barButtonItem = this.createBarButtonItem(this.navigationButton);
            leftBarItems.push(barButtonItem);
        }

        for (let i = 0; i < items.length; i++) {
            const barButtonItem = this.createBarButtonItem(items[i]);
            if (items[i].ios.position === 'left') {
                leftBarItems.push(barButtonItem);
            } else {
                rightBarItems.splice(0, 0, barButtonItem);
            }
        }

        this.nativeViewProtected.leadingBarButtonItems = <any>leftBarItems;
        this.nativeViewProtected.trailingBarButtonItems = <any>rightBarItems;
    }

    private createBarButtonItem(item: ActionItemDefinition): UIBarButtonItem {
        const tapHandler = TapItemHandlerImpl.initWithOwner(new WeakRef(item));
        // associate handler with menuItem or it will get collected by JSC.
        (<any>item).handler = tapHandler;

        let barButtonItem: UIBarButtonItem;
        if (item.actionView && item.actionView.ios) {
            let recognizer = UITapGestureRecognizer.alloc().initWithTargetAction(tapHandler, 'tap');
            item.actionView.ios.addGestureRecognizer(recognizer);
            barButtonItem = UIBarButtonItem.alloc().initWithCustomView(item.actionView.ios);
        } else if (item.ios.systemIcon !== undefined) {
            let id: number = item.ios.systemIcon;
            if (typeof id === 'string') {
                id = parseInt(id);
            }

            barButtonItem = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(id, tapHandler, 'tap');
        } else if (item.icon) {
            const img = loadActionIconFromFileOrResource(item.icon);
            const image = img.imageWithRenderingMode(this._getIconRenderingMode());
            barButtonItem = UIBarButtonItem.alloc().initWithImageStyleTargetAction(image, UIBarButtonItemStyle.Plain, tapHandler, 'tap');
        } else {
            barButtonItem = UIBarButtonItem.alloc().initWithTitleStyleTargetAction(item.text + '', UIBarButtonItemStyle.Plain, tapHandler, 'tap');
        }

        const tintColor = item.style.tintColor;
        if (tintColor) {
            barButtonItem.tintColor = tintColor.ios;
        }

        if (item.text) {
            barButtonItem.isAccessibilityElement = true;
            barButtonItem.accessibilityLabel = item.text;
            barButtonItem.accessibilityTraits = UIAccessibilityTraitButton;
        }

        return barButtonItem;
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number) {
        this.actionItems.getItems().forEach((actionItem) => {
            const actionView = actionItem.actionView;
            if (actionView) {
                View.measureChild(this, actionView, UNSPECIFIED, UNSPECIFIED);
            }
        });

        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    public onLayout(left: number, top: number, right: number, bottom: number) {
        this.actionItems.getItems().forEach((actionItem) => {
            const actionView = actionItem.actionView;
            if (actionView && actionView.ios) {
                const measuredWidth = actionView.getMeasuredWidth();
                const measuredHeight = actionView.getMeasuredHeight();
                View.layoutChild(this, actionView, 0, 0, measuredWidth, measuredHeight);
            }
        });

        super.onLayout(left, top, right, bottom);
    }

    public layoutNativeView(left: number, top: number, right: number, bottom: number) {
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

    [backgroundColorProperty.getDefault](): Color {
        return getColor(this.nativeViewProtected.barTintColor);
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.barTintColor = value.ios;
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }

    [iosIconRenderingModeProperty.getDefault](): 'automatic' | 'alwaysOriginal' | 'alwaysTemplate' {
        return 'alwaysTemplate';
    }
    [iosIconRenderingModeProperty.setNative](value: 'automatic' | 'alwaysOriginal' | 'alwaysTemplate') {
        this.update();
    }
}
