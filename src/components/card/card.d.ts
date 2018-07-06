import { ContentView } from 'tns-core-modules/ui/content-view';

/**
 * Contains the Card class, which represents a card view component.
 */
export class Card extends ContentView {
    /**
     * Gets or set the elevation of the card view.
     */
    elevation: number;

    /**
     * Gets or set the radius of the card view.
     */
    radius: number;

    /**
     * Gets or set the ripple setting.
     */
    ripple: boolean;

    /**
     * Gets or set the stroke color of the card view.
     */
    strokeColor: string;
    /**
     * Gets or set the stroke width of the card view.
     */
    strokeWidth: number;
}