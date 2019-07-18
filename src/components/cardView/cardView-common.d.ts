import { Color, Property } from 'tns-core-modules/ui/core/view';
import { ContentView } from 'tns-core-modules/ui/content-view';
export declare abstract class CardViewBase extends ContentView {
    interactable: boolean;
    elevation: number;
    elevationHighlighted: number;
    rippleColor: Color;
}
export declare const interactableProperty: Property<CardViewBase, boolean>;
