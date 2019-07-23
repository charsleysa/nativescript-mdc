import { Page } from 'tns-core-modules/ui/page/page';

import { BottomAppBar } from '../bottomAppBar/bottomAppBar';

declare module 'tns-core-modules/ui/page/page' {
    interface Page {
        bottomAppBar: BottomAppBar;
    }
}

export function install();
