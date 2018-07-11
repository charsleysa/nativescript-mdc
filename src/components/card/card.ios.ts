import { Color } from 'tns-core-modules/color/color';
import { screen } from 'tns-core-modules/platform/platform';
import {
    CardCommon,
    backgroundColorProperty,
    backgroundInternalProperty,
    elevationProperty,
    radiusProperty,
    rippleProperty,
    strokeColorProperty,
    strokeWidthProperty
} from './card-common';

declare var MDCCard: any;

export class Card extends CardCommon {

    get ios(): any {
        return this.nativeView;
    }

    public createNativeView() {
        return MDCCard.alloc().init();
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeView.backgroundColor = value !== undefined ? value.ios : new Color('#FFFFFF').ios;
    }

    [backgroundColorProperty.getDefault]() {
        return this.nativeView.backgroundColor;
    }

    [backgroundInternalProperty.setNative](value) {
        this.nativeView.backgroundColor = new Color(value.color !== undefined ? value.color + '' : '#FFFFFF').ios;
    }

    [backgroundInternalProperty.getDefault]() {
        return this.nativeView.backgroundColor;
    }

    [elevationProperty.setNative](value: number) {
        this.nativeView.setShadowElevationForState(value, UIControlState.Normal);
    }

    [elevationProperty.getDefault]() {
        return this.nativeView.shadowElevationForState(UIControlState.Normal);
    }

    [radiusProperty.setNative](value: number) {
        this.nativeView.cornerRadius = value;
    }

    [radiusProperty.getDefault](): number {
        return this.nativeView.cornerRadius;
    }

    [rippleProperty.setNative](value: boolean) {
        this.nativeView.interactable = value;
    }

    [rippleProperty.getDefault](): boolean {
        return this.nativeView.interactable;
    }

    [strokeColorProperty.setNative](value: Color) {
        this.nativeView.setBorderColorForState(value !== undefined ? value.ios : new Color('#FFFFFF').ios, UIControlState.Normal);
    }

    [strokeColorProperty.getDefault](): Color {
        return this.nativeView.borderColorForState(UIControlState.Normal);
    }

    [strokeWidthProperty.setNative](value: number) {
        this.nativeView.setBorderWidthForState(value, UIControlState.Normal);
    }

    [strokeWidthProperty.getDefault](): number {
        return this.nativeView.borderWidthForState(UIControlState.Normal);
    }
}