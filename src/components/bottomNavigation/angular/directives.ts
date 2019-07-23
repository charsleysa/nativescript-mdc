import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { BottomNavigation, BottomNavigationTab } from '../bottomNavigation';
import { isBlank } from 'nativescript-angular/lang-facade';

@Directive({
    selector: 'MDCBottomNavigation'
})
export class BottomNavigationDirective implements AfterViewInit {

    public bottomNavigation: BottomNavigation;
    private _viewInitialized: boolean;

    constructor(element: ElementRef) {
        this.bottomNavigation = element.nativeElement;
    }

    private _titleVisibility: 'selected' | 'always' | 'never';

    @Input()
    get titleVisibility(): 'selected' | 'always' | 'never' {
        return this._titleVisibility;
    }

    set titleVisibility(value: 'selected' | 'always' | 'never') {
        this._titleVisibility = value;
        if (this._viewInitialized) {
            this.bottomNavigation.titleVisibility = this._titleVisibility;
        }
    }

    private _tabs: BottomNavigationTab[];

    @Input()
    get tabs(): BottomNavigationTab[] {
        return this._tabs;
    }

    set tabs(value: BottomNavigationTab[]) {
        this._tabs = value;
        if (this._viewInitialized) {
            this.bottomNavigation.tabs = this._tabs;
        }
    }

    private _selectedTabIndex: number;

    @Input()
    get selectedTabIndex(): number {
        return this._selectedTabIndex;
    }

    set selectedTabIndex(value: number) {
        this._selectedTabIndex = value;
        if (this._viewInitialized) {
            this.bottomNavigation.selectedTabIndex = this._selectedTabIndex;
        }
    }

    ngAfterViewInit(): void {
        this._viewInitialized = true;
        if (!isBlank(this._titleVisibility)) { this.bottomNavigation.titleVisibility = this._titleVisibility; }
        if (!isBlank(this._tabs)) { this.bottomNavigation.tabs = this._tabs; }
        if (!isBlank(this._selectedTabIndex)) { this.bottomNavigation.selectedTabIndex = this._selectedTabIndex; }
    }
}

@Directive({
    selector: 'MDCBottomNavigationTab'
})
export class BottomNavigationTabDirective {

    private _title: string;

    @Input()
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    private _icon: string;

    @Input()
    get icon(): string {
        return this._icon;
    }

    set icon(value: string) {
        this._icon = value;
    }

    @Input()
    private _selectable: boolean;

    get selectable(): boolean {
        return this._selectable;
    }

    set selectable(value: boolean) {
        this._selectable = value;
    }
}

export const DIRECTIVES = [BottomNavigationDirective, BottomNavigationTabDirective];
