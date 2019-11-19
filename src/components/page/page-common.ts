import { ContentView } from 'tns-core-modules/ui/content-view/content-view';
import { ActionBar } from 'tns-core-modules/ui/action-bar/action-bar';
import { Page as INSPage, View } from 'tns-core-modules/ui/page/page';

import { BottomAppBar } from '../bottomAppBar/bottomAppBar';

declare module '@nativescript/core/ui/page/page' {
    interface Page {
        _actionBar: ActionBar;
    }
}

export class MDCPageBase extends INSPage {
    private _bottomAppBar: BottomAppBar;

    public hasBottomAppBar: boolean;

    get bottomAppBar(): BottomAppBar {
        return this._bottomAppBar;
    }
    set bottomAppBar(value: BottomAppBar) {
        if (this._bottomAppBar !== value) {
            if (this._bottomAppBar) {
                this._removeView(this._bottomAppBar);
                this._bottomAppBar = undefined;
                this.hasBottomAppBar = false;
            }

            if (value) {
                this.hasBottomAppBar = true;
                this._bottomAppBar = value;
                this._addView(this._bottomAppBar);
            }
        }
    }

    public _addChildFromBuilder(name: string, value: any) {
        if (value instanceof ActionBar) {
            this.actionBar = value;
        } else if (value instanceof BottomAppBar) {
            this.bottomAppBar = value;
        } else {
            ContentView.prototype._addChildFromBuilder.call(this, name, value); // super
        }
    }

    public eachChildView(callback: (child: View) => boolean) {
        ContentView.prototype.eachChildView.call(this, callback); // super
        if (this.actionBar) {
            callback(this.actionBar);
        }
        if (this.bottomAppBar) {
            callback(this.bottomAppBar);
        }
    }

    get _childrenCount(): number {
        return (this.content ? 1 : 0) + (this._actionBar ? 1 : 0) + (this._bottomAppBar ? 1 : 0);
    }
}
