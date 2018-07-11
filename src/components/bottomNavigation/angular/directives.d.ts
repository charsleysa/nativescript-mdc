import { AfterViewInit, ElementRef } from '@angular/core';
import { BottomNavigation, BottomNavigationTab } from '../bottomNavigation';
export declare class BottomNavigationDirective implements AfterViewInit {
    bottomNavigation: BottomNavigation;
    private _viewInitialized;
    constructor(element: ElementRef);
    private _activeColor;
    activeColor: string;
    private _inactiveColor;
    inactiveColor: string;
    private _backgroundColor;
    backgroundColor: string;
    private _titleVisibility;
    titleVisibility: 'selected' | 'always' | 'never';
    private _tabs;
    tabs: BottomNavigationTab[];
    private _selectedTabIndex;
    selectedTabIndex: number;
    ngAfterViewInit(): void;
}
export declare class BottomNavigationTabDirective {
    private _title;
    title: string;
    private _icon;
    icon: string;
    private _selectable;
    selectable: boolean;
}
export declare const DIRECTIVES: (typeof BottomNavigationDirective | typeof BottomNavigationTabDirective)[];
