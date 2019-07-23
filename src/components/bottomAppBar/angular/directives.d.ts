import { ElementRef, OnDestroy } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { ViewClassMeta } from 'nativescript-angular/element-registry';
import { ActionItem, NavigationButton, MainActionButton } from '../bottomAppBar';
export declare function isActionItem(view: any): view is ActionItem;
export declare function isNavigationButton(view: any): view is NavigationButton;
export declare function isMainActionButton(view: any): view is MainActionButton;
export declare const bottomAppBarMeta: ViewClassMeta;
export declare class BottomAppBarComponent {
    element: ElementRef;
    private page;
    constructor(element: ElementRef, page: Page);
}
export declare class BottomAppBarScope {
    private page;
    constructor(page: Page);
    onMainActionButtonInit(mainActionBtn: MainActionButtonDirective): void;
    onMainActionButtonDestroy(mainActionBtn: MainActionButtonDirective): void;
    onNavButtonInit(navBtn: NavigationButtonDirective): void;
    onNavButtonDestroy(navBtn: NavigationButtonDirective): void;
    onActionInit(item: ActionItemDirective): void;
    onActionDestroy(item: ActionItemDirective): void;
}
export declare class ActionItemDirective implements OnDestroy {
    element: ElementRef;
    private ownerScope;
    constructor(element: ElementRef, ownerScope: BottomAppBarScope);
    ngOnDestroy(): void;
}
export declare class NavigationButtonDirective implements OnDestroy {
    element: ElementRef;
    private ownerScope;
    constructor(element: ElementRef, ownerScope: BottomAppBarScope);
    ngOnDestroy(): void;
}
export declare class MainActionButtonDirective implements OnDestroy {
    element: ElementRef;
    private ownerScope;
    constructor(element: ElementRef, ownerScope: BottomAppBarScope);
    ngOnDestroy(): void;
}
export declare const DIRECTIVES: (typeof BottomAppBarComponent | typeof BottomAppBarScope | typeof ActionItemDirective | typeof NavigationButtonDirective | typeof MainActionButtonDirective)[];
