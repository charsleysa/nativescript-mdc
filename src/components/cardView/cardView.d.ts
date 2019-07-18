import { ContentView, Color } from 'tns-core-modules/ui/content-view/content-view';

import { CardViewBase } from './cardView-common'

/**
 * Contains the Card class, which represents a card view component.
 */
export class CardView extends CardViewBase {

    readonly android: any; /* com.google.android.material.card.MaterialCardView */

    readonly ios: any; /* MDCCard */
}
