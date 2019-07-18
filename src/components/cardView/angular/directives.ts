import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { isBlank } from 'nativescript-angular/lang-facade';

import { CardView } from '../cardView';

@Directive({
    selector: 'MDCCardView'
})
export class CardViewDirective implements AfterViewInit {

    public card: CardView;
    private _viewInitialized: boolean;

    constructor(element: ElementRef) {
        this.card = element.nativeElement;
    }

    private _interactable: boolean;

    @Input()
    get interactable(): boolean {
        return this._interactable;
    }

    set interactable(value: boolean) {
        this._interactable = value;
        if (this._viewInitialized) {
            this.card.interactable = this._interactable;
        }
    }

    ngAfterViewInit(): void {
        this._viewInitialized = true;
        if (!isBlank(this._interactable)) { this.card.interactable = this._interactable; }
    }
}

export const DIRECTIVES = [CardViewDirective];
