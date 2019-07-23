import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

import { DIRECTIVES, bottomAppBarMeta } from './directives';

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ],
})
export class NativeScriptMDCBottomAppBarModule { }

registerElement('MDCBottomAppBar', () => require('../bottomAppBar').BottomAppBar, bottomAppBarMeta);
registerElement('MDCActionItem', () => require('../bottomAppBar').ActionItem);
registerElement('MDCNavigationButton', () => require('../bottomAppBar').NavigationButton);
registerElement('MDCMainActionButton', () => require('../bottomAppBar').MainActionButton);
