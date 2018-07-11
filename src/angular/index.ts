import { NgModule } from '@angular/core';

import { NativeScriptMDCBottomNavigationModule } from '../components/bottomNavigation/angular';
import { NativeScriptMDCCardModule } from '../components/card/angular';

@NgModule({
    imports: [
        NativeScriptMDCBottomNavigationModule,
        NativeScriptMDCCardModule
    ],
    exports: [
        NativeScriptMDCBottomNavigationModule,
        NativeScriptMDCCardModule
    ]
})
export class NativescriptMDCModule { }
