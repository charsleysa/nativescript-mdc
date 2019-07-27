import { Color } from 'tns-core-modules/color';
import { ImageSource } from 'tns-core-modules/image-source';
import { backgroundColorProperty } from 'tns-core-modules/ui/core/view';
import { ad } from 'tns-core-modules/utils/utils';

import { elevationProperty, translationZHighlightedProperty, tintColorProperty } from '../core/cssproperties';
import { FloatingActionButtonBase, fabSizeProperty, imageSourceProperty, srcProperty } from './floatingActionButton-common';

export class FloatingActionButton extends FloatingActionButtonBase {
    nativeViewProtected: com.google.android.material.floatingactionbutton.FloatingActionButton;

    get android(): com.google.android.material.floatingactionbutton.FloatingActionButton {
        return this.nativeViewProtected;
    }
    public createNativeView() {
        const view = new com.google.android.material.floatingactionbutton.FloatingActionButton(new android.view.ContextThemeWrapper(this._context, ad.resources.getId(':style/AppThemeFloatingActionButton')));
        return view;
    }

    public show() {
        this.nativeViewProtected.show();
    }
    public hide() {
        this.nativeViewProtected.hide();
    }

    [fabSizeProperty.getDefault](): string {
        return 'normal';
    }
    [fabSizeProperty.setNative](value: string) {
        switch (value) {
            case 'auto':
                this.nativeViewProtected.setSize(com.google.android.material.floatingactionbutton.FloatingActionButton.SIZE_AUTO);
                break;
            case 'mini':
                this.nativeViewProtected.setSize(com.google.android.material.floatingactionbutton.FloatingActionButton.SIZE_MINI);
                break;
            default:
                this.nativeViewProtected.setSize(com.google.android.material.floatingactionbutton.FloatingActionButton.SIZE_NORMAL);
                break;
        }
    }

    [tintColorProperty.getDefault](): Color {
        return undefined;
    }
    [tintColorProperty.setNative](value: Color) {
        if (value === undefined) {
            this.nativeViewProtected.setSupportImageTintList(null);
        } else {
            this.nativeViewProtected.setSupportImageTintList(android.content.res.ColorStateList.valueOf(value.android));
        }
    }

    [imageSourceProperty.getDefault](): ImageSource {
        return undefined;
    }
    [imageSourceProperty.setNative](value: ImageSource) {
        const nativeView = this.nativeViewProtected;
        if (value && value.android) {
            const bitmapDrawable = new android.graphics.drawable.BitmapDrawable(this._context.getResources(), value.android);
            nativeView.setImageDrawable(bitmapDrawable);
        } else {
            nativeView.setImageDrawable(null);
        }
    }

    [srcProperty.getDefault](): any {
        return undefined;
    }
    [srcProperty.setNative](value: any) {
        this._createImageSourceFromSrc(value);
    }

    [elevationProperty.setNative](value: number) {
        this.nativeViewProtected.setCompatElevation(value);
    }

    [translationZHighlightedProperty.setNative](value: number) {
        this.nativeViewProtected.setTranslationZ(value);
    }

    [backgroundColorProperty.getDefault](): Color {
        return undefined;
    }
    [backgroundColorProperty.setNative](value: Color) {
        if (value === undefined) {
            this.nativeViewProtected.setBackgroundTintList(null);
        } else {
            this.nativeViewProtected.setBackgroundTintList(android.content.res.ColorStateList.valueOf(value.android));
        }
    }
}
