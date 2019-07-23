import { Directive, Component, ElementRef, Optional, OnDestroy } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';

import { isBlank } from 'nativescript-angular/lang-facade';
import {
    NgView,
    ViewClassMeta,
    ViewExtensions,
    isInvisibleNode,
    isView,
    registerElement,
} from 'nativescript-angular/element-registry';

import {
    BottomAppBar,
    ActionItem,
    ActionItems,
    NavigationButton,
    MainActionButton
} from '../bottomAppBar';

export function isActionItem(view: any): view is ActionItem {
    return view instanceof ActionItem;
}

export function isNavigationButton(view: any): view is NavigationButton {
    return view instanceof NavigationButton;
}

export function isMainActionButton(view: any): view is MainActionButton {
    return view instanceof MainActionButton;
}

type NgBottomAppBar = (BottomAppBar & ViewExtensions);

export const bottomAppBarMeta: ViewClassMeta = {
    skipAddToDom: true,
    insertChild: (parent: NgBottomAppBar, child: NgView, next: any) => {
        if (isInvisibleNode(child)) {
            return;
        } else if (isMainActionButton(child)) {
            parent.mainActionButton = child;
            child.parentNode = parent;
        } else if (isNavigationButton(child)) {
            parent.navigationButton = child;
            child.parentNode = parent;
        } else if (isActionItem(child)) {
            addActionItem(parent, child, next);
            child.parentNode = parent;
        }
    },
    removeChild: (parent: NgBottomAppBar, child: NgView) => {
        if (isInvisibleNode(child)) {
            return;
        } else if (isMainActionButton(child)) {
            if (parent.mainActionButton === child) {
                parent.mainActionButton = null;
            }

            child.parentNode = null;
        } else if (isNavigationButton(child)) {
            if (parent.navigationButton === child) {
                parent.navigationButton = null;
            }

            child.parentNode = null;
        } else if (isActionItem(child)) {
            parent.actionItems.removeItem(child);
            child.parentNode = null;
        }
    },
};

const addActionItem = (bar: NgBottomAppBar, item: ActionItem, next: ActionItem) => {
    if (next) {
        insertActionItemBefore(bar, item, next);
    } else {
        appendActionItem(bar, item);
    }
};

const insertActionItemBefore = (bar: NgBottomAppBar, item: ActionItem, next: ActionItem) => {
    const actionItems: ActionItems = bar.actionItems;
    const actionItemsCollection: ActionItem[] = actionItems.getItems();

    const indexToInsert = actionItemsCollection.indexOf(next);
    actionItemsCollection.splice(indexToInsert, 0, item);

    (<any>actionItems).setItems(actionItemsCollection);
};

const appendActionItem = (bar: NgBottomAppBar, item: ActionItem) => {
    bar.actionItems.addItem(item);
};

@Component({
    selector: 'MDCBottomAppBar',
    template: '<ng-content></ng-content>'
})
export class BottomAppBarComponent {
    constructor(public element: ElementRef, private page: Page) {
        if (!this.page) {
            throw new Error('Inside BottomAppBarComponent but no Page found in DI.');
        }

        this.page.bottomAppBar = this.element.nativeElement;
        this.page.bottomAppBar.update();
    }
}

@Component({
    selector: 'MDCBottomAppBarExtension',
    template: ''
})
export class BottomAppBarScope { // tslint:disable-line:component-class-suffix
    constructor(private page: Page) {
        if (!this.page) {
            throw new Error('Inside BottomAppBarScope but no Page found in DI.');
        }
    }

    public onMainActionButtonInit(mainActionBtn: MainActionButtonDirective) {
        this.page.bottomAppBar.mainActionButton = mainActionBtn.element.nativeElement;
    }

    public onMainActionButtonDestroy(mainActionBtn: MainActionButtonDirective) {
        const mainAction = <MainActionButton>mainActionBtn.element.nativeElement;
        if (mainAction && this.page.bottomAppBar.mainActionButton === mainAction) {
            this.page.bottomAppBar.mainActionButton = null;
        }
    }

    public onNavButtonInit(navBtn: NavigationButtonDirective) {
        this.page.bottomAppBar.navigationButton = navBtn.element.nativeElement;
    }

    public onNavButtonDestroy(navBtn: NavigationButtonDirective) {
        const nav = <NavigationButton>navBtn.element.nativeElement;
        if (nav && this.page.bottomAppBar.navigationButton === nav) {
            this.page.bottomAppBar.navigationButton = null;
        }
    }

    public onActionInit(item: ActionItemDirective) {
        this.page.bottomAppBar.actionItems.addItem(item.element.nativeElement);
    }

    public onActionDestroy(item: ActionItemDirective) {
        if (item.element.nativeElement.bottomAppBar) {
            this.page.bottomAppBar.actionItems.removeItem(item.element.nativeElement);
        }
    }
}

@Directive({
    selector: 'MDCActionItem' // tslint:disable-line:directive-selector
})
export class ActionItemDirective implements OnDestroy {
    constructor(public element: ElementRef, @Optional() private ownerScope: BottomAppBarScope) {
        if (this.ownerScope) {
            this.ownerScope.onActionInit(this);
        }
    }

    ngOnDestroy() {
        if (this.ownerScope) {
            this.ownerScope.onActionDestroy(this);
        }
    }
}

@Directive({
    selector: 'MDCNavigationButton' // tslint:disable-line:directive-selector
})
export class NavigationButtonDirective implements OnDestroy {
    constructor(public element: ElementRef, @Optional() private ownerScope: BottomAppBarScope) {
        if (this.ownerScope) {
            this.ownerScope.onNavButtonInit(this);
        }
    }

    ngOnDestroy() {
        if (this.ownerScope) {
            this.ownerScope.onNavButtonDestroy(this);
        }
    }
}

@Directive({
    selector: 'MDCMainActionButton' // tslint:disable-line:directive-selector
})
export class MainActionButtonDirective implements OnDestroy {
    constructor(public element: ElementRef, @Optional() private ownerScope: BottomAppBarScope) {
        if (this.ownerScope) {
            this.ownerScope.onMainActionButtonInit(this);
        }
    }

    ngOnDestroy() {
        if (this.ownerScope) {
            this.ownerScope.onMainActionButtonDestroy(this);
        }
    }
}

export const DIRECTIVES = [
    BottomAppBarComponent,
    BottomAppBarScope,
    ActionItemDirective,
    NavigationButtonDirective,
    MainActionButtonDirective
];
