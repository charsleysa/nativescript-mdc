import { ImageSource } from 'tns-core-modules/image-source/image-source';

import { elevationProperty } from '../core/cssproperties';
import { themer } from '../core/material';
import { FloatingActionButtonBase, imageSourceProperty, srcProperty } from './floatingActionButton-common';

export class FloatingActionButton extends FloatingActionButtonBase {
    nativeViewProtected: MDCFloatingButton;

    get ios(): MDCFloatingButton {
        return this.nativeViewProtected;
    }

    public _setNativeImage(nativeImage: UIImage) {
        // this.nativeViewProtected.setImageForState(nativeImage ? nativeImage.imageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate) : nativeImage, UIControlState.Normal);
        this.nativeViewProtected.setImageForState(nativeImage, UIControlState.Normal);
    }
    public createNativeView() {
        const result = MDCFloatingButton.new();
        const colorScheme = themer.getAppColorScheme();
        if (colorScheme) {
            MDCFloatingButtonColorThemer.applySemanticColorSchemeToButton(colorScheme, result);
        }
        return result;
    }
    [elevationProperty.setNative](value: number) {
        this.nativeViewProtected.setElevationForState(value, UIControlState.Normal);
        this.nativeViewProtected.setElevationForState(value * 2, UIControlState.Highlighted);
    }
    [imageSourceProperty.setNative](value: ImageSource) {
        this._setNativeImage(value ? value.ios : null);
    }

    [srcProperty.setNative](value: any) {
        this._createImageSourceFromSrc(value);
    }
}
