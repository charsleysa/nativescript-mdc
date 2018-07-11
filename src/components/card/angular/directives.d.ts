import { AfterViewInit, ElementRef } from '@angular/core';
import { Card } from '../card';
export declare class CardDirective implements AfterViewInit {
    card: Card;
    private _viewInitialized;
    constructor(element: ElementRef);
    private _elevation;
    elevation: number;
    private _radius;
    radius: number;
    private _ripple;
    ripple: boolean;
    private _strokeColor;
    strokeColor: string;
    private _strokeWidth;
    strokeWidth: number;
    ngAfterViewInit(): void;
}
export declare const DIRECTIVES: (typeof CardDirective)[];
