import { ActionBar } from 'tns-core-modules/ui/action-bar/action-bar';
import { Page as INSPage, View } from 'tns-core-modules/ui/page/page';
import { BottomAppBar } from '../bottomAppBar/bottomAppBar';
declare module '@nativescript/core/ui/page/page' {
    interface Page {
        _actionBar: ActionBar;
    }
}
export declare class MDCPageBase extends INSPage {
    private _bottomAppBar;
    hasBottomAppBar: boolean;
    bottomAppBar: BottomAppBar;
    _addChildFromBuilder(name: string, value: any): void;
    eachChildView(callback: (child: View) => boolean): void;
    readonly _childrenCount: number;
}
