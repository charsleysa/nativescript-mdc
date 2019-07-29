import { ImageSource } from 'tns-core-modules/image-source/image-source';

import { FloatingActionButtonBase } from './floatingActionButton-common';

export declare class FloatingActionButton extends FloatingActionButtonBase {

    readonly android: any; /* com.google.android.material.floatingactionbutton.FloatingActionButton */

    readonly ios: any; /* MDCFloatingButton */

    show(): void;

    hide(): void;

    fabSize: string;

    imageSource: ImageSource;

    icon: string | ImageSource;

    isLoading: boolean;
}
