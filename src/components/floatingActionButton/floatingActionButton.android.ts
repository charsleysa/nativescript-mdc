import { Color } from 'tns-core-modules/color';
import { ImageSource } from 'tns-core-modules/image-source';
import { backgroundColorProperty, widthProperty } from 'tns-core-modules/ui/core/view';
import { ad } from 'tns-core-modules/utils/utils';

import { elevationProperty, translationZHighlightedProperty, tintColorProperty } from '../core/cssproperties';
import { FloatingActionButtonBase, fabSizeProperty, imageSourceProperty, iconProperty } from './floatingActionButton-common';

export class FloatingActionButton extends FloatingActionButtonBase {
    nativeViewProtected: com.google.android.material.floatingactionbutton.FloatingActionButton;

    get android(): com.google.android.material.floatingactionbutton.FloatingActionButton {
        return this.nativeViewProtected;
    }
    public createNativeView() {
        const view = new com.google.android.material.floatingactionbutton.FloatingActionButton(this._context);
        view.setScaleType(android.widget.ImageView.ScaleType.CENTER);
        if (this.fabSize === 'mini') {
            view.setSize(com.google.android.material.floatingactionbutton.FloatingActionButton.SIZE_MINI);
            this.style.width = 40;
            this.style.height = 40;
        } else {
            view.setSize(com.google.android.material.floatingactionbutton.FloatingActionButton.SIZE_NORMAL);
            this.style.width = 56;
            this.style.height = 56;
        }
        return view;
    }

    public show() {
        this.nativeViewProtected.show();
    }
    public hide() {
        this.nativeViewProtected.hide();
    }

    [tintColorProperty.getDefault](): Color {
        return undefined;
    }
    [tintColorProperty.setNative](value: Color) {
        if (value == null) {
            this.nativeViewProtected.setSupportImageTintList(android.content.res.ColorStateList.valueOf(android.graphics.Color.TRANSPARENT));
            this.nativeViewProtected.setSupportImageTintMode(android.graphics.PorterDuff.Mode.OVERLAY);
        } else {
            this.nativeViewProtected.setSupportImageTintList(android.content.res.ColorStateList.valueOf(value.android));
            this.nativeViewProtected.setSupportImageTintMode(android.graphics.PorterDuff.Mode.SRC_IN);
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

    [iconProperty.getDefault](): any {
        return undefined;
    }
    [iconProperty.setNative](value: any) {
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
        if (value != null) {
            this.nativeViewProtected.setBackgroundTintList(android.content.res.ColorStateList.valueOf(value.android));
        }
    }
}
