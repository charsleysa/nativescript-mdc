/**
 * Contains the bottom app bar related classes.
 * @module 'bottomAppBar'
 */ /** */

import { EventData, ViewBase, View, Color } from 'tns-core-modules/ui/core/view';

/**
 * Provides an abstraction over the BottomAppBar (android) and MDCBottomAppBarView (iOS).
 */
export class BottomAppBar extends View {

    /**
     * Gets or sets the navigation button (a.k.a. the back button).
     */
    navigationButton: NavigationButton;

    /**
     * Gets or sets the main action button (a.k.a. floating action button).
     */
    mainActionButton: MainActionButton;

    /**
     * Gets the collection of action items.
     */
    actionItems: ActionItems;

    /**
     * Gets the native android component.
     */
    android: any /* com.google.android.material.bottomappbar.BottomAppBar */;

    /**
     * Gets the native iOS [MDCBottomAppBarView](https://material.io/develop/ios/components/bottomappbar/api-docs/Classes/MDCBottomAppBarView.html) that represents the user interface for this component. Valid only when running on iOS.
     */
    ios: any /* MDCBottomAppBarView */;

    /**
     * Gets or set the UIImageRenderingMode of the action bar icons in iOS. Defaults to 'alwaysTemplate'
     * Valid values are:
     *  - automatic
     *  - alwaysOriginal
     *  - alwaysTemplate
     */
    iosIconRenderingMode: 'automatic' | 'alwaysOriginal' | 'alwaysTemplate';

    /**
     * Updates the action bar.
     */
    update();

    //@private
    /**
     * @private
     */
    _isEmpty(): boolean;
    /**
     * @private
     */
    _getActualSize?: { width: number, height: number };
    //@endprivate
}

/**
 * Represents a collection of ActionItems.
 */
export class ActionItems {
    /**
     * Adds an item to the collection.
     * @param item - the item to be added
     */
    addItem(item: ActionItem): void;

    /**
     * Removes an item to the collection.
     * @param item - The item to be removed.
     */
    removeItem(item: ActionItem): void;

    /**
     * Gets an array of the current action items in the collection.
     */
    getItems(): Array<ActionItem>;

    /**
     * Gets an item at a specified index.
     * @param index - The index.
     */
    getItemAt(index: number): ActionItem;
}

/**
 * Represents a bottom action item in the bottom app bar.
 */
export class ActionItem extends ViewBase {
    /**
     * Gets or sets the text of the action item.
     */
    text: string;

    /**
     * Gets or sets the icon of the action item.
     */
    icon: string;

    /**
     * Gets or sets the custom action view of the action item.
     */
    actionView: View;

    /**
     * Gets or sets the visibility of the action item.
     */
    visibility: string;

    /**
     * Gets the action bar that contains the action item.
     */
    bottomAppBar: BottomAppBar;

    /**
     * A basic method signature to hook an event listener (shortcut alias to the addEventListener method).
     * @param eventNames - String corresponding to events (e.g. 'propertyChange'). Optionally could be used more events separated by `,` (e.g. 'propertyChange', 'change').
     * @param callback - Callback function which will be executed when event is raised.
     * @param thisArg - An optional parameter which will be used as `this` context for callback execution.
     */
    on(eventNames: string, callback: (data: EventData) => void);

    /**
     * Raised when a tap event occurs.
     */
    on(event: 'tap', callback: (args: EventData) => void);

    //@private
    /**
     * @private
     */
    _raiseTap(): void;
    //@endprivate

    /**
     * Gets the iOS specific options of the action item.
     */
    ios: IOSActionItemSettings;

    /**
     * Gets the Android specific options of the action item.
     */
    android: AndroidActionItemSettings;
}

/**
 * Represents Android specific options of the action item.
 */
export interface AndroidActionItemSettings {
    /**
     * Gets or sets the position of the action item in the action bar.
     *  1. BottomAppBar - item is shown in the action bar.
     *  2. BottomAppBarIfRoom - item is shown in the action bar if there is room for it. Otherwise it is put in the popup menu.
     *  3. popup - item is shown in the popup menu.
     * Note: Property not applicable to NavigationButton
     */
    position: 'bottomAppBar' | 'bottomAppBarIfRoom' | 'popup';

    /**
     * Gets or sets the name of the system drawable resource to be displayed.
     * Use this property instead of ActionItem.icon if you want to diplsay a built-in Android system icon.
     * The value should be a string such as 'ic_menu_search' if you want to display the built-in Android Menu Search icon for example.
     * For a full list of Android drawable names, please visit http://androiddrawables.com
     */
    systemIcon: string;
}

/**
 * Represents iOS specific options of the action item.
 */
export interface IOSActionItemSettings {
    /**
     * Gets or sets the position of the action item in the action bar.
     *  1. left - items is shown at the left part of the navigation bar.
     *  2. right - items is shown at the right part of the navigation bar. This is the default value.
     * Note: Property not applicable to NavigationButton
     */
    position: 'left' | 'right';

    /**
     * Gets or sets a number representing the iOS system item to be displayed.
     * Use this property instead of ActionItem.icon if you want to diplsay a built-in iOS system icon.
     * Note: Property not applicable to NavigationButton
     * The value should be a number from the UIBarButtonSystemItem enumeration
     * (https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIBarButtonItem_Class/#//apple_ref/c/tdef/UIBarButtonSystemItem)
     *  0: Done
     *  1: Cancel
     *  2: Edit
     *  3: Save
     *  4: Add
     *  5: FlexibleSpace
     *  6: FixedSpace
     *  7: Compose
     *  8: Reply
     *  9: Action
     * 10: Organize
     * 11: Bookmarks
     * 12: Search
     * 13: Refresh
     * 14: Stop
     * 15: Camera
     * 16: Trash
     * 17: Play
     * 18: Pause
     * 19: Rewind
     * 20: FastForward
     * 21: Undo
     * 22: Redo
     * 23: PageCurl
     */
    systemIcon: number;
}

/**
 * Represents the navigation (a.k.a. 'back' or 'menu') button.
 */
export class NavigationButton extends ActionItem {
    //@private
    /**
     * @private
     */
    _navigationItem?: any
    //@endprivate
}

/**
 * Represents the main action (a.k.a. 'floating action') button.
 */
export class MainActionButton extends ViewBase {
    /**
     * Gets or sets the text of the main action button.
     */
    text: string;

    /**
     * Gets or sets the icon of the main action button.
     */
    icon: string;

    /**
     * Gets or sets the visibility of the main action button.
     */
    visibility: string;

    /**
     * Gets the bottom app bar that contains the main action button.
     */
    bottomAppBar: BottomAppBar;

    /**
     * A basic method signature to hook an event listener (shortcut alias to the addEventListener method).
     * @param eventNames - String corresponding to events (e.g. 'propertyChange'). Optionally could be used more events separated by `,` (e.g. 'propertyChange', 'change').
     * @param callback - Callback function which will be executed when event is raised.
     * @param thisArg - An optional parameter which will be used as `this` context for callback execution.
     */
    on(eventNames: string, callback: (data: EventData) => void);

    /**
     * Raised when a tap event occurs.
     */
    on(event: 'tap', callback: (args: EventData) => void);

    //@private
    /**
     * @private
     */
    _raiseTap(): void;
    //@endprivate
}

/** @internal */
export function _setNavBarColor(navBar: any /* MDCBottomAppBarView */, color: any /* UIColor */);
/** @internal */
export function _setNavBarBackgroundColor(navBar: any /* MDCBottomAppBarView */, color: any /* UIColor */);
