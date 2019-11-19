import { ViewBase } from 'tns-core-modules/ui/page/page';

import { ShowBottomSheetOptions } from './bottomSheet-common';

export { ShowBottomSheetOptions };
declare module '@nativescript/core/ui/core/view/view' {
    interface View {
        closeBottomSheet(...args: any[]): void;
        showBottomSheet(view: ViewBase, options: ShowBottomSheetOptions): ViewBase;
        showBottomSheet(moduleName: string, options: ShowBottomSheetOptions): ViewBase;
    }
}

export function install();
