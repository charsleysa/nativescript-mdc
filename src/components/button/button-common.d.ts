import { Color } from 'tns-core-modules/ui/core/view';
import { Button } from 'tns-core-modules/ui/button/button';
export declare abstract class ButtonBase extends Button {
    variant: string;
    elevation: number;
    elevationHighlighted: number;
    rippleColor: Color | string;
    constructor();
}
