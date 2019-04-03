import { Color } from 'tns-core-modules/color/color';
import { TypographyOptions } from './material';
import { applyMixins } from './material.common';
export { applyMixins };
export declare class Themer {
    appColorScheme: MDCSemanticColorScheme;
    appTypoScheme: MDCTypographyScheme;
    constructor();
    getOrcreateAppColorScheme(): MDCSemanticColorScheme;
    getAppColorScheme(): MDCSemanticColorScheme;
    setPrimaryColor(value: string): void;
    setPrimaryColorVariant(value: string): void;
    getOrcreateAppTypographyScheme(): MDCTypographyScheme;
    getAppTypographyScheme(): MDCTypographyScheme;
    setButtonTypography(args: TypographyOptions): void;
}
export declare const themer: Themer;
export declare function getRippleColor(color: string | Color): UIColor;
export declare function overrideViewBase(): void;
export declare function install(): void;
