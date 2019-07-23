import { Color } from 'tns-core-modules/color';
import { applyMixins } from './core-common';
export { applyMixins };
export declare class Themer {
    getOrcreateAppColorScheme(): void;
    getAppColorScheme(): void;
    setPrimaryColor(value: string): void;
    setPrimaryColorVariant(value: string): void;
}
export declare const themer: Themer;
export declare function install(): void;
export declare function getRippleColor(color: string | Color): number;
export declare function getColorWithDefaultAlpha(color: string | Color, alpha: number): Color;
