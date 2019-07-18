import { CssProperty } from 'tns-core-modules/ui/core/properties';
import { TextField as NTextField } from 'tns-core-modules/ui/text-field/text-field';
import { Style } from 'tns-core-modules/ui/styling/style';
import { booleanConverter } from 'tns-core-modules/ui/core/view';
import { Color } from 'tns-core-modules/color/color';
import { CSSType } from 'tns-core-modules/ui/page/page';

import { cssProperty } from '../core/cssproperties';

@CSSType('MDCTextField')
export abstract class TextFieldBase extends NTextField {
    constructor() {
        super();
    }
    abstract requestFocus();
    abstract clearFocus();

    @cssProperty helper: string;
    @cssProperty maxLength: number;
    @cssProperty errorColor: Color;
    @cssProperty floating: boolean;
    @cssProperty placeholderColor: Color;
    @cssProperty variant: string = 'filled';
    @cssProperty error: string;
    @cssProperty strokeColor: Color;
    @cssProperty floatingColor: Color;
}

export const errorColorProperty = new CssProperty<Style, Color>({
    name: 'errorColor',
    cssName: 'error-color',
    equalityComparer: Color.equals,
    valueConverter: v => new Color(v)
});
errorColorProperty.register(Style);
export const helperProperty = new CssProperty<Style, string>({
    name: 'helper',
    cssName: 'helper'
});
helperProperty.register(Style);
export const errorProperty = new CssProperty<Style, string>({
    name: 'error',
    cssName: 'error'
});
errorProperty.register(Style);
export const maxLengthProperty = new CssProperty<Style, number>({
    name: 'maxLength',
    cssName: 'max-length',
    valueConverter: v => parseFloat(v)
});
maxLengthProperty.register(Style);
export const floatingProperty = new CssProperty<Style, boolean>({
    name: 'floating',
    cssName: 'floating',
    valueConverter: booleanConverter
});
floatingProperty.register(Style);
export const floatingColorProperty = new CssProperty<Style, Color>({
    name: 'floatingColor',
    cssName: 'floating-color',
    equalityComparer: Color.equals,
    valueConverter: v => new Color(v)
});
floatingColorProperty.register(Style);
export const strokeColorProperty = new CssProperty<Style, Color>({
    name: 'strokeColor',
    cssName: 'stroke-color',
    equalityComparer: Color.equals,
    valueConverter: v => new Color(v)
});
strokeColorProperty.register(Style);
