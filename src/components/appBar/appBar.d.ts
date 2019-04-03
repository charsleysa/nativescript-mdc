import { AndroidActionBarSettings } from 'tns-core-modules/ui/action-bar/action-bar';
import { AppBarBase } from './appBar-common';

export declare class AppBar extends AppBarBase {
    readonly android: AndroidActionBarSettings;
    readonly ios: any; /* MDCNavigationBar */
}
