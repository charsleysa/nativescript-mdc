import { Color } from 'tns-core-modules/color/color';
import { Length } from 'tns-core-modules/ui/page/page';

export interface TypographyOptions {
    fontFamily?: string;
    fontSize?: number;
}

export class Themer {
    readonly appScheme;
    readonly appColorScheme;
    primaryColor: string;
    primaryColorVariant: string;
}

export const themer: Themer;

export function install();
export function applyMixins(derivedCtor: any, baseCtors: any[]);
export function getRippleColor(color: string | Color): any;
export function getColorWithDefaultAlpha(color: string | Color, alpha: number): Color;


// declare module 'tns-core-modules/ui/core/view' {
//     interface View {
//         elevation: Length
//         elevationHighlighted: Length
//         rippleColor: string | Color
//     }
// }
