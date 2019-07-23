import { Background } from 'tns-core-modules/ui/styling/background';
import { CardViewBase } from './cardView-common';
export declare class CardView extends CardViewBase {
    nativeViewProtected: MDCCard;
    createNativeView(): MDCCard;
    _setNativeClipToBounds(): void;
    _redrawNativeBackground(value: Background): void;
}
