import { NgModule } from '@angular/core';

import { NativeScriptMDCActivityIndicatorModule } from '../components/activityIndicator/angular';
import { NativeScriptMDCBottomAppBarModule } from '../components/bottomAppBar/angular';
import { NativeScriptMDCBottomNavigationModule } from '../components/bottomNavigation/angular';
import { NativeScriptMDCBottomSheetModule } from '../components/bottomSheet/angular';
import { NativeScriptMDCButtonModule } from '../components/button/angular';
import { NativeScriptMDCCardViewModule } from '../components/cardView/angular';
import { NativeScriptMDCFloatingActionButtonModule } from '../components/floatingActionButton/angular';
import { NativeScriptMDCProgressModule } from '../components/progress/angular';
import { NativeScriptMDCRippleModule } from '../components/ripple/angular';
import { NativeScriptMDCSliderModule } from '../components/slider/angular';
import { NativeScriptMDCTextFieldModule } from '../components/textField/angular';

@NgModule({
    imports: [
        NativeScriptMDCActivityIndicatorModule,
        NativeScriptMDCBottomAppBarModule,
        NativeScriptMDCBottomNavigationModule,
        NativeScriptMDCBottomSheetModule,
        NativeScriptMDCButtonModule,
        NativeScriptMDCCardViewModule,
        NativeScriptMDCFloatingActionButtonModule,
        NativeScriptMDCProgressModule,
        NativeScriptMDCRippleModule,
        NativeScriptMDCSliderModule,
        NativeScriptMDCTextFieldModule
    ],
    exports: [
        NativeScriptMDCActivityIndicatorModule,
        NativeScriptMDCBottomAppBarModule,
        NativeScriptMDCBottomNavigationModule,
        NativeScriptMDCBottomSheetModule,
        NativeScriptMDCButtonModule,
        NativeScriptMDCCardViewModule,
        NativeScriptMDCFloatingActionButtonModule,
        NativeScriptMDCProgressModule,
        NativeScriptMDCRippleModule,
        NativeScriptMDCSliderModule,
        NativeScriptMDCTextFieldModule
    ]
})
export class NativescriptMDCModule { }
