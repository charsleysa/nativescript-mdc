import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { Card } from '../card';
import { isBlank } from 'nativescript-angular/lang-facade';

@Directive({
    selector: 'BottomNavigation'
})
export class CardDirective implements AfterViewInit {

    public card: Card;
    private _viewInitialized: boolean;

    constructor(element: ElementRef) {
        this.card = element.nativeElement;
    }

    private _elevation: number;

    @Input()
    get elevation(): number {
        return this._elevation;
    }

    set elevation(value: number) {
        this._elevation = value;
        if (this._viewInitialized) {
            this.card.elevation = this._elevation;
        }
    }

    private _radius: number;

    @Input()
    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
        if (this._viewInitialized) {
            this.card.radius = this._radius;
        }
    }

    private _ripple: boolean;

    @Input()
    get ripple(): boolean {
        return this._ripple;
    }

    set ripple(value: boolean) {
        this._ripple = value;
        if (this._viewInitialized) {
            this.card.ripple = this._ripple;
        }
    }

    private _strokeColor: string;

    @Input()
    get strokeColor(): string {
        return this._strokeColor;
    }

    set strokeColor(value: string) {
        this._strokeColor = value;
        if (this._viewInitialized) {
            this.card.strokeColor = this._strokeColor;
        }
    }

    private _strokeWidth: number;

    @Input()
    get strokeWidth(): number {
        return this._strokeWidth;
    }

    set strokeWidth(value: number) {
        this._strokeWidth = value;
        if (this._viewInitialized) {
            this.card.strokeWidth = this._strokeWidth;
        }
    }

    ngAfterViewInit(): void {
        this._viewInitialized = true;
        if (!isBlank(this._elevation)) { this.card.elevation = this._elevation; }
        if (!isBlank(this._radius)) { this.card.radius = this._radius; }
        if (!isBlank(this._ripple)) { this.card.ripple = this._ripple; }
        if (!isBlank(this._strokeColor)) { this.card.strokeColor = this.strokeColor; }
        if (!isBlank(this._strokeWidth)) { this.card.strokeWidth = this._strokeWidth; }
    }
}

export const DIRECTIVES = [CardDirective];
