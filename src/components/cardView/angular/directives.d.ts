import { AfterViewInit, ElementRef } from '@angular/core';
import { CardView } from '../cardView';
export declare class CardViewDirective implements AfterViewInit {
    card: CardView;
    private _viewInitialized;
    constructor(element: ElementRef);
    private _elevation;
    elevation: number;
    private _borderRadius;
    borderRadius: number;
    private _interactable;
    interactable: boolean;
    private _borderColor;
    borderColor: string;
    private _borderWidth;
    borderWidth: number;
    ngAfterViewInit(): void;
}
export declare const DIRECTIVES: (typeof CardViewDirective)[];
