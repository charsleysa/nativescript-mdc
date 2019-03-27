import { Color, Property } from 'tns-core-modules/ui/core/view';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
export declare abstract class CardViewBase extends StackLayout {
    borderColor: string;
    borderRadius: number;
    borderWidth: number;
    interactable: boolean;
    elevation: number;
    rippleColor: Color;
}
export declare const borderColorProperty: Property<CardViewBase, Color>;
export declare const borderRadiusProperty: Property<CardViewBase, number>;
export declare const borderWidthProperty: Property<CardViewBase, number>;
export declare const interactableProperty: Property<CardViewBase, boolean>;
