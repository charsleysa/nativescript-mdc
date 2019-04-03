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
    abstract blur();

    @cssProperty helper: string;
    @cssProperty maxLength: number;
    @cssProperty errorColor: Color;
    @cssProperty floating: boolean;
    @cssProperty placeholderColor: Color;
    @cssProperty variant: string;
    @cssProperty error: string;
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
    cssName: 'max-length'
});
maxLengthProperty.register(Style);
export const floatingProperty = new CssProperty<Style, boolean>({
    name: 'floating',
    cssName: 'floating',
    valueConverter: booleanConverter
});
floatingProperty.register(Style);
