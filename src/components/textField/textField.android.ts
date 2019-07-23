import { Color } from 'tns-core-modules/color';
import { ad } from 'tns-core-modules/utils/utils';
import { Background } from 'tns-core-modules/ui/styling/background';
import { hintProperty, placeholderColorProperty } from 'tns-core-modules/ui/editable-text-base/editable-text-base';
import {
    backgroundColorProperty,
    borderTopColorProperty,
    borderTopLeftRadiusProperty,
    borderTopRightRadiusProperty,
    borderBottomLeftRadiusProperty,
    borderBottomRightRadiusProperty,
    Length
} from 'tns-core-modules/ui/core/view';

import { getFocusedColorStateList, getLayout, handleClearFocus, stateSets } from '../core/android/utils';
import { getColorWithDefaultAlpha } from '../core/core';
import { TextFieldBase, errorColorProperty, errorProperty, floatingColorProperty, floatingProperty, helperProperty, maxLengthProperty } from './textField-common';

declare module 'tns-core-modules/ui/text-field/text-field' {
    interface TextField {
        _redrawNativeBackground(value: android.graphics.drawable.Drawable | Background): void;
    }
}

interface TextInputEditText extends com.google.android.material.textfield.TextInputEditText {
    // tslint:disable-next-line:no-misused-new
    new (context): TextInputEditText;
    owner: WeakRef<TextField>;
}
let TextInputEditText: TextInputEditText;

function initTextInputEditText() {
    if (TextInputEditText) {
        return;
    }
    class TextInputEditTextImpl extends com.google.android.material.textfield.TextInputEditText {
        public owner: WeakRef<TextField>;
        constructor(context: android.content.Context) {
            super(context);
            return global.__native(this);
        }
        dispatchKeyEventPreIme(event) {
            const imm = ad.getInputMethodManager();

            if (imm != null && imm.isActive() && event.getAction() === android.view.KeyEvent.ACTION_UP && event.getKeyCode() === android.view.KeyEvent.KEYCODE_BACK) {
                // when hiding the keyboard with the back button also blur
                const owner = this.owner && this.owner.get();
                if (owner) {
                    owner.clearFocus();
                    return true;
                }
            }
            return super.dispatchKeyEventPreIme(event);
        }
    }
    TextInputEditText = TextInputEditTextImpl as any;
}

export function getDefaultHintTextColorStateList(pressedColor: number, color = 1627389952) {
    const states = Array.create('[I', 2);
    states[0] = stateSets.FOCUSED_STATE_SET;
    states[1] = Array.create('int', 0);
    const colors = Array.create('int', 2);
    colors[0] = pressedColor;
    colors[1] = color;
    return new android.content.res.ColorStateList(states, colors);
}

export class TextField extends TextFieldBase {
    editText: com.google.android.material.textfield.TextInputEditText;
    nativeViewProtected: com.google.android.material.textfield.TextInputLayout;

    get nativeTextViewProtected() {
        return this.editText;
    }

    get android(): com.google.android.material.textfield.TextInputLayout {
        return this.nativeViewProtected;
    }

    constructor() {
        super();
    }

    public createNativeView() {
        const style = (this.variant === 'outlined')
            ? 'AppThemeOutlinedMaterialTextField'
            : 'AppThemeFilledMaterialTextField';

        initTextInputEditText();

        const layoutView = new com.google.android.material.textfield.TextInputLayout(new android.view.ContextThemeWrapper(this._context, ad.resources.getId(':style/' + style)));
        const editText = this.editText = new TextInputEditText(layoutView.getContext());
        editText.setLayoutParams(new android.widget.LinearLayout.LayoutParams(android.widget.FrameLayout.LayoutParams.MATCH_PARENT, android.widget.FrameLayout.LayoutParams.WRAP_CONTENT));
        layoutView.addView(editText);
        editText.owner = new WeakRef(this);
        layoutView.setFocusableInTouchMode(true); // to prevent focus on view creation
        return layoutView;
    }

    public requestFocus() {
        if (this.nativeViewProtected) {
            // because of setFocusableInTouchMode fix we need this for focus to work
            const oldDesc = this.nativeViewProtected.getDescendantFocusability();
            this.nativeViewProtected.setDescendantFocusability(android.view.ViewGroup.FOCUS_AFTER_DESCENDANTS);
            // }
            this.nativeViewProtected.requestFocus();
            setTimeout(() => {
                this.nativeViewProtected.setDescendantFocusability(oldDesc);
                ad.showSoftInput(this.nativeTextViewProtected);
            }, 0);
        }

        return false;
    }

    public clearFocus() {
        handleClearFocus(this.nativeViewProtected);
        this.dismissSoftInput();
    }

    [hintProperty.getDefault](): string {
        return this.nativeViewProtected.getHint();
    }
    [hintProperty.setNative](value: string) {
        const text = value === null || value === undefined ? null : value.toString();
        this.nativeViewProtected.setHint(text);
    }

    [placeholderColorProperty.setNative](value: Color) {
        const placeholderColor = value instanceof Color ? value.android : value;
        const floatingColor = this.floatingColor instanceof Color ? this.floatingColor.android : placeholderColor;

        this.nativeViewProtected.setDefaultHintTextColor(getDefaultHintTextColorStateList(floatingColor, placeholderColor));
    }
    [floatingColorProperty.setNative](value: Color) {
        const floatingColor = value instanceof Color ? value.android : value;
        const placeholderColor = this.placeholderColor instanceof Color ? this.placeholderColor.android : undefined;
        this.nativeViewProtected.setDefaultHintTextColor(getDefaultHintTextColorStateList(floatingColor, placeholderColor));
    }

    [errorColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.setErrorTextColor(android.content.res.ColorStateList.valueOf(color));
    }

    [helperProperty.setNative](value: string) {
        this.nativeViewProtected.setHelperText(!!value ? value : null);
    }
    [errorProperty.setNative](value: string) {
        this.nativeViewProtected.setError(!!value ? value : null);
        this.nativeViewProtected.setErrorEnabled(!!value);
    }

    [maxLengthProperty.setNative](value: number) {
        this.nativeViewProtected.setCounterEnabled(value > 0);
        this.nativeViewProtected.setCounterMaxLength(value);
    }

    [floatingProperty.setNative](value: boolean) {
        this.nativeViewProtected.setHintEnabled(!!value);
    }

    [backgroundColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getBoxStrokeColor());
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setBoxBackgroundColor(getColorWithDefaultAlpha(value, 31).android);
    }

    [borderTopColorProperty.getDefault](): Color {
        return new Color(this.nativeViewProtected.getBoxStrokeColor());
    }

    [borderTopColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setBoxStrokeColor(value.android);
    }

    [borderTopLeftRadiusProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getBoxCornerRadiusTopStart() };
    }

    [borderTopLeftRadiusProperty.setNative](value: Length) {
        this.setCorners();
    }

    [borderTopRightRadiusProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getBoxCornerRadiusTopEnd() };
    }

    [borderTopRightRadiusProperty.setNative](value: Length) {
        this.setCorners();
    }

    [borderBottomLeftRadiusProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getBoxCornerRadiusBottomStart() };
    }

    [borderBottomLeftRadiusProperty.setNative](value: Length) {
        this.setCorners();
    }

    [borderBottomRightRadiusProperty.getDefault](): Length {
        return { unit: 'px', value: this.nativeViewProtected.getBoxCornerRadiusBottomEnd() };
    }

    [borderBottomRightRadiusProperty.setNative](value: Length) {
        this.setCorners();
    }

    setCorners() {
        this.nativeViewProtected.setBoxCornerRadii(
            Length.toDevicePixels(this.style.borderTopLeftRadius),
            Length.toDevicePixels(this.style.borderTopRightRadius),
            Length.toDevicePixels(this.style.borderBottomLeftRadius),
            Length.toDevicePixels(this.style.borderBottomRightRadius)
        );
    }

    _redrawNativeBackground(value: Background): void {
        return;
    }
}
