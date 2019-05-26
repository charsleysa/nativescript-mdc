import { NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import { View } from 'tns-core-modules/ui/core/view';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';
import '../bottomSheet';
import { ShowBottomSheetOptions } from '../bottomSheet';
export declare type BaseShowBottomSheetOptions = Pick<ShowBottomSheetOptions, Exclude<keyof ShowBottomSheetOptions, 'closeCallback' | 'context'>>;
export interface MDCBottomSheetOptions extends BaseShowBottomSheetOptions {
    context?: any;
    viewContainerRef?: ViewContainerRef;
    moduleRef?: NgModuleRef<any>;
    target?: View;
}
export declare class MDCBottomSheetParams<T = any> {
    context: T;
    closeCallback: (...args: any[]) => any;
    constructor(context: T, closeCallback: (...args: any[]) => any);
}
export declare class MDCBottomSheetService {
    private location;
    constructor(location: NSLocationStrategy);
    showBottomSheet(type: Type<any>, options: MDCBottomSheetOptions): Promise<any>;
    private _showDialog;
}
