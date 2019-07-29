import { Color } from 'tns-core-modules/color/color';
import { ImageSource } from 'tns-core-modules/image-source/image-source';
import { backgroundColorProperty } from 'tns-core-modules/ui/core/view';

import { elevationProperty, tintColorProperty } from '../core/cssproperties';
import { themer } from '../core/core';
import { FloatingActionButtonBase, imageSourceProperty, iconProperty } from './floatingActionButton-common';

export class FloatingActionButton extends FloatingActionButtonBase {
    nativeViewProtected: MDCFloatingButton;
    private _templateImageWasCreated: boolean;

    get ios(): MDCFloatingButton {
        return this.nativeViewProtected;
    }

    public createNativeView() {
        const view = MDCFloatingButton.floatingButtonWithShape(this.fabSize === 'mini' ? MDCFloatingButtonShape.Mini : MDCFloatingButtonShape.Default);
        view.applySecondaryThemeWithScheme(themer.appScheme);
        if (this.fabSize === 'mini') {
            this.style.width = 40;
            this.style.height = 40;
        } else {
            this.style.width = 56;
            this.style.height = 56;
        }
        return view;
    }

    private setTintColor(value: Color) {
        const image = this.nativeViewProtected.imageForState(UIControlState.Normal);
        if (value && image && !this._templateImageWasCreated) {
            this.nativeViewProtected.setImageForState(image.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate), UIControlState.Normal);
            this._templateImageWasCreated = true;
        } else if (!value && image && this._templateImageWasCreated) {
            this._templateImageWasCreated = false;
            this.nativeViewProtected.setImageForState(image.imageWithRenderingMode(UIImageRenderingMode.Automatic), UIControlState.Normal);
        }
        this.nativeViewProtected.tintColor = value ? value.ios : null;
    }

    public _setNativeImage(nativeImage: UIImage) {
        this.nativeViewProtected.setImageForState(nativeImage, UIControlState.Normal);
        this._templateImageWasCreated = false;
        this.setTintColor(this.style.tintColor);
    }

    [tintColorProperty.setNative](value: Color) {
        this.setTintColor(value);
    }

    [imageSourceProperty.setNative](value: ImageSource) {
        this._setNativeImage(value ? value.ios : null);
    }

    [iconProperty.setNative](value: any) {
        this._createImageSourceFromSrc(value);
    }

    [elevationProperty.setNative](value: number) {
        this.nativeViewProtected.setElevationForState(value, UIControlState.Normal);
        this.nativeViewProtected.setElevationForState(value * 2, UIControlState.Highlighted);
    }

    [backgroundColorProperty.getDefault](): Color {
        return undefined;
    }
    [backgroundColorProperty.setNative](value: Color) {
        if (value === undefined) {
            this.nativeViewProtected.setBackgroundColorForState(null, UIControlState.Normal);
        } else {
            this.nativeViewProtected.setBackgroundColorForState(value.ios, UIControlState.Normal);
        }
    }
}
