import { ElementRef } from '@angular/core';
import { View } from 'tns-core-modules/ui/core/view';
import { BaseValueAccessor } from 'nativescript-angular/forms/value-accessors/base-value-accessor';
export declare type TextView = {
    text: string;
} & View;
export declare class TextValueAccessorDirective extends BaseValueAccessor<TextView> {
    constructor(elementRef: ElementRef);
    writeValue(value: any): void;
}
export declare const DIRECTIVES: (typeof TextValueAccessorDirective)[];
