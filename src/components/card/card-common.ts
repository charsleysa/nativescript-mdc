import { Color } from 'tns-core-modules/color';
import { ContentView, Property } from 'tns-core-modules/ui/content-view';
export { backgroundColorProperty, backgroundInternalProperty } from 'tns-core-modules/ui/core/view';

/**
 * Contains the CardCommon class, which represents a card view component.
 */
export class CardCommon extends ContentView {
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

export const radiusProperty = new Property<CardCommon, number>({
    name: 'radius',
    valueConverter: value => +value
});
radiusProperty.register(CardCommon);

export const elevationProperty = new Property<CardCommon, number>({
    name: 'elevation',
    valueConverter: value => +value
});
elevationProperty.register(CardCommon);

export const rippleProperty = new Property<CardCommon, boolean>({
    name: 'ripple',
    valueConverter: value => value === 'true'
});
rippleProperty.register(CardCommon);

export const strokeColorProperty = new Property<CardCommon, Color>({
    name: 'strokeColor',
    valueConverter: value => new Color(value)
});
strokeColorProperty.register(CardCommon);

export const strokeWidthProperty = new Property<CardCommon, number>({
    name: 'strokeWidth',
    valueConverter: value => +value
});
strokeWidthProperty.register(CardCommon);
