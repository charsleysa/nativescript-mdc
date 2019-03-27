import { Color } from 'tns-core-modules/color/color';

export function getColor(uiColor: UIColor): Color {
    const redRef = new interop.Reference<number>();
    const greenRef = new interop.Reference<number>();
    const blueRef = new interop.Reference<number>();
    const alphaRef = new interop.Reference<number>();
    uiColor.getRedGreenBlueAlpha(redRef, greenRef, blueRef, alphaRef);
    const red = redRef.value * 255;
    const green = greenRef.value * 255;
    const blue = blueRef.value * 255;
    const alpha = alphaRef.value * 255;
    return new Color(alpha, red, green, blue);
}
