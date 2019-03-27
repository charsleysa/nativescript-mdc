import { NgModule } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';

import { DIRECTIVES } from './directives';

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ],
})
export class NativeScriptMDCBottomNavigationModule { }

registerElement('MDCBottomNavigation', () => require('../bottomNavigation').BottomNavigation);
registerElement('MDCBottomNavigationTab', () => require('../bottomNavigation').BottomNavigationTab);
