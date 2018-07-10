import { CardCommon } from './card-common';
export declare class Card extends CardCommon {
    private _androidViewId;
    readonly android: any;
    createNativeView(): any;
    initNativeView(): void;
}
