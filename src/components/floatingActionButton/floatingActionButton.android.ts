import { ImageSource } from 'tns-core-modules/image-source';
import { backgroundInternalProperty } from 'tns-core-modules/ui/page/page';
import { Background } from 'tns-core-modules/ui/styling/background';

import { elevationProperty, translationZHighlightedProperty } from '../core/cssproperties';
import { FloatingActionButtonBase, imageSourceProperty, srcProperty } from './floatingActionButton-common';

export class FloatingActionButton extends FloatingActionButtonBase {
    nativeViewProtected: com.google.android.material.floatingactionbutton.FloatingActionButton;

    get android(): com.google.android.material.floatingactionbutton.FloatingActionButton {
        return this.nativeViewProtected;
    }
    public createNativeView() {
        const view = new com.google.android.material.floatingactionbutton.FloatingActionButton(this._context);
        return view;
    }

    [imageSourceProperty.setNative](value: ImageSource) {
        const nativeView = this.nativeViewProtected;
        if (value && value.android) {
            nativeView.setImageBitmap(value.android);
        } else {
            nativeView.setImageBitmap(null);
        }
    }

    [srcProperty.setNative](value: any) {
        this._createImageSourceFromSrc(value);
    }
    public show() {
        this.nativeViewProtected.show();
    }
    public hide() {
        this.nativeViewProtected.hide();
    }

    [elevationProperty.setNative](value: number) {
        this.nativeViewProtected.setCompatElevation(value);
    }

    [translationZHighlightedProperty.setNative](value: number) {
        this.nativeViewProtected.setTranslationZ(value);
    }

    get size(): string {
        return this.style['size'];
    }
    set size(value: string) {
        this.style['size'] = value;
        if (this.nativeViewProtected) {
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
    }

    [backgroundInternalProperty.setNative](value: android.graphics.drawable.Drawable | Background) {
        if (this.nativeViewProtected) {
            if (value instanceof android.graphics.drawable.Drawable) {
                this.nativeViewProtected.setBackgroundDrawable(value);
            } else {
                if (value.color) {
                    this.nativeViewProtected.setBackgroundTintList(android.content.res.ColorStateList.valueOf(value.color.android));
                }
            }
        }
    }
}
