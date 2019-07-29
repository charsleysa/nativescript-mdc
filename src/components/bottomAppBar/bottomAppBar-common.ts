import { profile } from 'tns-core-modules/profiling';

export * from 'tns-core-modules/ui/core/view';

import {
    View,
    ViewBase,
    Property,
    unsetValue,
    horizontalAlignmentProperty,
    verticalAlignmentProperty,
    CSSType,
    traceWrite,
    traceCategories,
    traceMessageType
} from 'tns-core-modules/ui/core/view';

import {
    BottomAppBar as BottomAppBarDefinition,
    ActionItems as ActionItemsDefinition,
    ActionItem as ActionItemDefinition,
    MainActionButton as MainActionButtonDefinition,
    NavigationButton,
    IOSActionItemSettings,
    AndroidActionItemSettings
} from './bottomAppBar';

declare module 'tns-core-modules/data/observable' {
    interface Observable {
        _emit(eventNames: string): void;
    }
}

declare module 'tns-core-modules/ui/core/view-base/view-base' {
    interface ViewBase {
        _defaultPaddingTop: number;
        _defaultPaddingRight: number;
        _defaultPaddingBottom: number;
        _defaultPaddingLeft: number;
        _isPaddingRelative: boolean;
    }
}

@CSSType('MDCBottomAppBar')
export class BottomAppBarBase extends View implements BottomAppBarDefinition {
    private _actionItems: ActionItems;
    private _mainActionButton: MainActionButtonBase;
    private _navigationButton: NavigationButton;

    get mainActionButton(): MainActionButtonBase {
        return this._mainActionButton;
    }
    set mainActionButton(value: MainActionButtonBase) {
        if (this._mainActionButton !== value) {
            if (this._mainActionButton) {
                this._removeView(this._mainActionButton);
                this._mainActionButton.bottomAppBar = undefined;
            }

            this._mainActionButton = value;

            if (this._mainActionButton) {
                this._mainActionButton.bottomAppBar = this;
                this._addView(this._mainActionButton);
            }

            this.update();
        }
    }

    get navigationButton(): NavigationButton {
        return this._navigationButton;
    }
    set navigationButton(value: NavigationButton) {
        if (this._navigationButton !== value) {
            if (this._navigationButton) {
                this._removeView(this._navigationButton);
                this._navigationButton.bottomAppBar = undefined;
            }

            this._navigationButton = value;

            if (this._navigationButton) {
                this._navigationButton.bottomAppBar = this;
                this._addView(this._navigationButton);
            }

            this.update();
        }
    }

    get actionItems(): ActionItems {
        return this._actionItems;
    }
    set actionItems(value: ActionItems) {
        throw new Error('actionItems property is read-only');
    }

    get ios(): any {
        return undefined;
    }

    get android(): any {
        return undefined;
    }

    get _childrenCount(): number {
        let actionViewsCount = 0;
        this._actionItems.getItems().forEach((actionItem) => {
            if (actionItem.actionView) {
                actionViewsCount++;
            }
        });

        return actionViewsCount;
    }

    constructor() {
        super();
        this._actionItems = new ActionItems(this);
    }

    public update() {
        //
    }

    public _addArrayFromBuilder(name: string, value: Array<any>) {
        if (name === 'actionItems') {
            this.actionItems.setItems(value);
        }
    }

    public eachChildView(callback: (child: View) => boolean) {}

    public eachChild(callback: (child: ViewBase) => boolean) {
        const mainActionButton = this._mainActionButton;
        if (mainActionButton) {
            callback(mainActionButton);
        }

        const navigationButton = this._navigationButton;
        if (navigationButton) {
            callback(navigationButton);
        }

        this.actionItems.getItems().forEach((actionItem) => {
            callback(actionItem);
        });
    }

    public _isEmpty(): boolean {
        if (this.mainActionButton || this.navigationButton || this.actionItems.getItems().length > 0) {
            return false;
        }

        return true;
    }
}

export class ActionItems implements ActionItemsDefinition {
    private _items = new Array<ActionItemDefinition>();
    private _bottomAppBar: BottomAppBarDefinition;

    constructor(bottomAppBar: BottomAppBarDefinition) {
        this._bottomAppBar = bottomAppBar;
    }

    public addItem(item: ActionItemDefinition): void {
        if (!item) {
            throw new Error('Cannot add empty item');
        }

        this._items.push(item);
        item.bottomAppBar = this._bottomAppBar;

        this._bottomAppBar._addView(item);

        this.invalidate();
    }

    public removeItem(item: ActionItemDefinition): void {
        if (!item) {
            throw new Error('Cannot remove empty item');
        }

        const itemIndex = this._items.indexOf(item);
        if (itemIndex < 0) {
            throw new Error('Cannot find item to remove');
        }

        this._items.splice(itemIndex, 1);
        this._bottomAppBar._removeView(item);

        item.bottomAppBar = undefined;
        this.invalidate();
    }

    public getItems(): Array<ActionItemDefinition> {
        return this._items.slice();
    }

    public getVisibleItems(): Array<ActionItemDefinition> {
        const visibleItems = [];
        this._items.forEach((item) => {
            if (isVisible(item)) {
                visibleItems.push(item);
            }
        });

        return visibleItems;
    }

    public getItemAt(index: number): ActionItemDefinition {
        if (index < 0 || index >= this._items.length) {
            return undefined;
        }

        return this._items[index];
    }

    public setItems(items: Array<ActionItemDefinition>) {
        // Remove all existing items
        while (this._items.length > 0) {
            this.removeItem(this._items[this._items.length - 1]);
        }

        // Add new items
        for (let i = 0; i < items.length; i++) {
            this.addItem(items[i]);
        }

        this.invalidate();
    }

    private invalidate() {
        if (this._bottomAppBar) {
            this._bottomAppBar.update();
        }
    }
}

export class ActionItemBase extends ViewBase implements ActionItemDefinition {
    public static tapEvent = 'tap';

    private _bottomAppBar: BottomAppBarDefinition;
    private _actionView: View;

    public ios: IOSActionItemSettings;
    public android: AndroidActionItemSettings;

    public text: string;
    public icon: string;
    public visibility: string;

    get actionView(): View {
        return this._actionView;
    }
    set actionView(value: View) {
        if (this._actionView !== value) {
            if (this._actionView) {
                this._actionView.style[horizontalAlignmentProperty.cssName] = unsetValue;
                this._actionView.style[verticalAlignmentProperty.cssName] = unsetValue;
                this._removeView(this._actionView);
            }

            this._actionView = value;

            if (this._actionView) {
                this._addView(this._actionView);
            }

            if (this._bottomAppBar) {
                this._bottomAppBar.update();
            }
        }
    }

    get bottomAppBar(): BottomAppBarDefinition {
        return this._bottomAppBar;
    }
    set bottomAppBar(value: BottomAppBarDefinition) {
        if (value !== this._bottomAppBar) {
            this._bottomAppBar = value;
        }
    }

    @profile
    public onLoaded() {
        if (this._actionView) {
            this._actionView.style[horizontalAlignmentProperty.cssName] = 'center';
            this._actionView.style[verticalAlignmentProperty.cssName] = 'middle';
        }
        super.onLoaded();
    }

    public _raiseTap() {
        this._emit(ActionItemBase.tapEvent);
    }

    public _addChildFromBuilder(name: string, value: any) {
        this.actionView = value;
    }

    public _onVisibilityChanged(visibility: string) {
        if (this.bottomAppBar) {
            this.bottomAppBar.update();
        }
    }

    public eachChild(callback: (child: ViewBase) => boolean) {
        if (this._actionView) {
            callback(this._actionView);
        }
    }
}

export class MainActionButtonBase extends ViewBase implements MainActionButtonDefinition {
    public static tapEvent = 'tap';

    private _bottomAppBar: BottomAppBarDefinition;

    public text: string;
    public icon: string;
    public visibility: string;

    get bottomAppBar(): BottomAppBarDefinition {
        return this._bottomAppBar;
    }
    set bottomAppBar(value: BottomAppBarDefinition) {
        if (value !== this._bottomAppBar) {
            this._bottomAppBar = value;
        }
    }

    public _raiseTap() {
        this._emit(MainActionButtonBase.tapEvent);
    }

    public _onVisibilityChanged(visibility: string) {
        if (this.bottomAppBar) {
            this.bottomAppBar.update();
        }
    }
}

export function isVisible(item: ActionItemDefinition | MainActionButtonBase) {
    return item.visibility === 'visible';
}

function onItemChanged(item: ActionItemBase | MainActionButtonBase, oldValue: string, newValue: string) {
    if (item.bottomAppBar) {
        item.bottomAppBar.update();
    }
}

function onVisibilityChanged(item: ActionItemBase | MainActionButtonBase, oldValue: string, newValue: string) {
    item._onVisibilityChanged(newValue);
}

export function traceMissingIcon(icon: string) {
    traceWrite('Could not load bottom action bar icon: ' + icon,
        traceCategories.Error,
        traceMessageType.error);
}

export const actionItemTextProperty = new Property<ActionItemBase, string>({ name: 'text', defaultValue: '', valueChanged: onItemChanged });
actionItemTextProperty.register(ActionItemBase);

export const actionItemIconProperty = new Property<ActionItemBase, string>({ name: 'icon', valueChanged: onItemChanged });
actionItemIconProperty.register(ActionItemBase);

export const actionItemVisibilityProperty = new Property<ActionItemBase, string>({ name: 'visibility', defaultValue: 'visible', valueChanged: onVisibilityChanged });
actionItemVisibilityProperty.register(ActionItemBase);

export const mainActionButtonTextProperty = new Property<MainActionButtonBase, string>({ name: 'text', defaultValue: '', valueChanged: onItemChanged });
mainActionButtonTextProperty.register(MainActionButtonBase);

export const mainActionButtonIconProperty = new Property<MainActionButtonBase, string>({ name: 'icon', valueChanged: onItemChanged });
mainActionButtonIconProperty.register(MainActionButtonBase);

export const mainActionButtonVisibilityProperty = new Property<MainActionButtonBase, string>({ name: 'visibility', defaultValue: 'visible', valueChanged: onVisibilityChanged });
mainActionButtonVisibilityProperty.register(MainActionButtonBase);
