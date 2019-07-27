import { FloatingActionButtonBase } from './floatingActionButton-common';
export declare class FloatingActionButton extends FloatingActionButtonBase {
    nativeViewProtected: com.google.android.material.floatingactionbutton.FloatingActionButton;
    readonly android: com.google.android.material.floatingactionbutton.FloatingActionButton;
    createNativeView(): com.google.android.material.floatingactionbutton.FloatingActionButton;
    show(): void;
    hide(): void;
}
