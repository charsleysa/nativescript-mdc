import { NgModule } from '@angular/core';

import { NativeScriptMDCBottomNavigationModule } from '../components/bottomNavigation/angular';
import { NativeScriptMDCCardViewModule } from '../components/cardView/angular';

@NgModule({
    imports: [
        NativeScriptMDCBottomNavigationModule,
        NativeScriptMDCCardViewModule
    ],
    exports: [
        NativeScriptMDCBottomNavigationModule,
        NativeScriptMDCCardViewModule
    ]
})
export class NativescriptMDCModule { }
