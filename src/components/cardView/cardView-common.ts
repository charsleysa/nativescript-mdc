import { Color, CSSType, Length, View, Property } from 'tns-core-modules/ui/core/view';
import { ContentView } from 'tns-core-modules/ui/content-view';

import { cssProperty } from '../core/cssproperties';

@CSSType('MDCCardView')
export abstract class CardViewBase extends ContentView {
    interactable: boolean;

    @cssProperty elevation: number;
    @cssProperty elevationHighlighted: number;
    @cssProperty rippleColor: Color;
}

export const interactableProperty = new Property<CardViewBase, boolean>({
    name: 'interactable',
    valueConverter: value => value === 'true'
});
interactableProperty.register(CardViewBase);
