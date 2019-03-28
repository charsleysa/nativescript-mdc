import { NgModule } from '@angular/core';

import { NativeScriptMDCActivityIndicatorModule } from '../components/activityIndicator/angular';
import { NativeScriptMDCBottomNavigationModule } from '../components/bottomNavigation/angular';
import { NativeScriptMDCButtonModule } from '../components/button/angular';
import { NativeScriptMDCCardViewModule } from '../components/cardView/angular';
import { NativeScriptMDCProgressModule } from '../components/progress/angular';
import { NativeScriptMDCRippleModule } from '../components/ripple/angular';
import { NativeScriptMDCSliderModule } from '../components/slider/angular';

@NgModule({
    imports: [
        NativeScriptMDCActivityIndicatorModule,
        NativeScriptMDCBottomNavigationModule,
        NativeScriptMDCButtonModule,
        NativeScriptMDCCardViewModule,
        NativeScriptMDCProgressModule,
        NativeScriptMDCRippleModule,
        NativeScriptMDCSliderModule
    ],
    exports: [
        NativeScriptMDCActivityIndicatorModule,
        NativeScriptMDCBottomNavigationModule,
        NativeScriptMDCButtonModule,
        NativeScriptMDCCardViewModule,
        NativeScriptMDCProgressModule,
        NativeScriptMDCRippleModule,
        NativeScriptMDCSliderModule
    ]
})
export class NativescriptMDCModule { }
