import { Color } from 'tns-core-modules/color';
import { ad } from 'tns-core-modules/utils/utils';
import { Background } from 'tns-core-modules/ui/styling/background';
import { backgroundInternalProperty, borderBottomLeftRadiusProperty, hintProperty, placeholderColorProperty } from 'tns-core-modules/ui/editable-text-base/editable-text-base';

import { getFocusedColorStateList, getLayout, handleClearFocus, stateSets } from '../core/android/utils';
import { TextFieldBase, errorColorProperty, errorProperty, floatingColorProperty, floatingProperty, helperProperty, maxLengthProperty, strokeColorProperty } from './textField-common';

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

export function initTextInputEditText() {
    if (TextInputEditText) {
        return;
    }
    @JavaProxy('org.nativescript.material.TextInputEditText')
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
    layoutView: com.google.android.material.textfield.TextInputLayout;

    // nativeViewProtected: com.google.android.material.textfield.TextInputLayout;
    constructor() {
        super();
    }
    get nativeTextViewProtected() {
        return this.editText as com.google.android.material.textfield.TextInputEditText;
    }

    drawingBackground = false;
    get nativeViewProtected() {
        if (this.drawingBackground) {
            return this.editText;
        }
        return this.layoutView;
    }

    public createNativeView() {
        let style = 'AppThemeMaterialTextField';
        if (this.variant === 'filled') {
            style = 'AppThemeFilledMaterialTextField';
        } else if (this.variant === 'outline') {
            style = 'AppThemeOutlinedMaterialTextField';
        }

        initTextInputEditText();

        const layoutView = this.layoutView = new com.google.android.material.textfield.TextInputLayout(new android.view.ContextThemeWrapper(this._context, ad.resources.getId(':style/' + style)));
        const editText = this.editText = new TextInputEditText(layoutView.getContext());
        editText.setLayoutParams(new android.widget.LinearLayout.LayoutParams(android.widget.FrameLayout.LayoutParams.MATCH_PARENT, android.widget.FrameLayout.LayoutParams.WRAP_CONTENT));
        layoutView.addView(editText);
        editText.owner = new WeakRef(this);
        layoutView.setFocusableInTouchMode(true); // to prevent focus on view creation
        return layoutView;
    }

    [borderBottomLeftRadiusProperty.getDefault]() {
        console.log('borderBottomLeftRadiusProperty.getDefault', this.layoutView.getBoxCornerRadiusTopStart());
        return this.layoutView.getBoxCornerRadiusTopStart();
    }

    _redrawNativeBackground(value: android.graphics.drawable.Drawable | Background): void {
        // trick for the background to be applied to the editText so that it removes the border line
        this.drawingBackground = true;
        super._redrawNativeBackground(value);
        this.drawingBackground = false;
    }

    [hintProperty.getDefault](): string {
        return this.layoutView.getHint();
    }
    [hintProperty.setNative](value: string) {
        const text = value === null || value === undefined ? null : value.toString();
        this.layoutView.setHint(text);
    }

    [placeholderColorProperty.setNative](value: Color) {
        const placeholderColor = value instanceof Color ? value.android : value;
        const floatingColor = this.floatingColor instanceof Color ? this.floatingColor.android : placeholderColor;

        this.layoutView.setDefaultHintTextColor(getDefaultHintTextColorStateList(floatingColor, placeholderColor));
    }
    [floatingColorProperty.setNative](value: Color) {
        const floatingColor = value instanceof Color ? value.android : value;
        const placeholderColor = this.placeholderColor instanceof Color ? this.placeholderColor.android : undefined;
        this.layoutView.setDefaultHintTextColor(getDefaultHintTextColorStateList(floatingColor, placeholderColor));
    }

    public requestFocus() {
        if (this.layoutView) {
            // because of setFocusableInTouchMode fix we need this for focus to work
            const oldDesc = this.layoutView.getDescendantFocusability();
            this.layoutView.setDescendantFocusability(android.view.ViewGroup.FOCUS_AFTER_DESCENDANTS);
            // }
            this.layoutView.requestFocus();
            setTimeout(() => {
                this.layoutView.setDescendantFocusability(oldDesc);
                ad.showSoftInput(this.nativeTextViewProtected);
            }, 0);
        }

        return false;
    }
    public clearFocus() {
        handleClearFocus(this.nativeViewProtected);
        this.dismissSoftInput();
    }

    [errorColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        (this.layoutView as any).setErrorTextColor(android.content.res.ColorStateList.valueOf(color));
    }

    [helperProperty.setNative](value: string) {
        (this.layoutView as any).setHelperText(!!value ? value : null);
    }
    [errorProperty.setNative](value: string) {
        this.layoutView.setError(!!value ? value : null);
        this.layoutView.setErrorEnabled(!!value);
    }

    [maxLengthProperty.setNative](value: number) {
        this.layoutView.setCounterEnabled(value > 0);
        this.layoutView.setCounterMaxLength(value);
    }

    [floatingProperty.setNative](value: boolean) {
        this.layoutView.setHintEnabled(!!value);
    }

    [strokeColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        this.layoutView.setBoxStrokeColor(color);
        // this.editText.setBackgroundTintList(android.content.res.ColorStateList.valueOf(color));
    }
    [backgroundInternalProperty.setNative](value: Background) {
        if (this.nativeViewProtected) {
            if (value instanceof android.graphics.drawable.Drawable) {
                this.nativeViewProtected.setBackgroundDrawable(value);
            } else {
                if (value.color) {
                    this.layoutView.setBoxBackgroundColor(value.color.android);
                }
                if (value.borderTopColor) {
                    this.layoutView.setBoxStrokeColor(value.borderTopColor.android);
                }

                this.borderTopLeftRadius = value.borderTopLeftRadius;
                this.borderTopRightRadius = value.borderTopRightRadius;
                this.borderBottomLeftRadius = value.borderBottomLeftRadius;
                this.borderBottomRightRadius = value.borderBottomRightRadius;
                this.layoutView.setBoxCornerRadii(this.borderTopLeftRadius, this.borderTopRightRadius, this.borderBottomLeftRadius, this.borderBottomRightRadius);
            }
        }
    }
}
