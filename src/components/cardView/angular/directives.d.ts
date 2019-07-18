import { AfterViewInit, ElementRef } from '@angular/core';
import { CardView } from '../cardView';
export declare class CardViewDirective implements AfterViewInit {
    card: CardView;
    private _viewInitialized;
    constructor(element: ElementRef);
    private _interactable;
    interactable: boolean;
    ngAfterViewInit(): void;
}
export declare const DIRECTIVES: (typeof CardViewDirective)[];
