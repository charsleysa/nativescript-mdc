import { Color } from 'tns-core-modules/color';
import { applyMixins } from './core-common';
export { applyMixins };
export declare class Themer {
    private _appScheme;
    constructor();
    readonly appScheme: MDCContainerScheme;
    readonly appColorScheme: MDCSemanticColorScheme;
    primaryColor: string;
    primaryColorVariant: string;
    getAppTypographyScheme(): MDCTypographyScheme;
}
export declare const themer: Themer;
export declare function install(): void;
export declare function getRippleColor(color: string | Color): UIColor;
