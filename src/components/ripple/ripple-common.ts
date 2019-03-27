import { Color, CSSType, View } from 'tns-core-modules/ui/core/view';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { ContentView } from 'tns-core-modules/ui/page/page';

import { cssProperty } from '../core/cssproperties';

@CSSType('MDCRipple')
export abstract class RippleBase extends StackLayout {
    @cssProperty rippleColor: Color;
}
