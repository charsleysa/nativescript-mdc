import { EventData, View } from 'tns-core-modules/ui/core/view';

export function onShownInBottomSheet(args) {
    const context = args.context;
    console.log('onShownInBottomSheet', context);
}

export function onTap(args: EventData) {
    const obj = args.object as View;
    const objId = obj.id;
    console.log('tapped in bottom sheet', objId);
    obj.bindingContext.closeCallback(objId);
}
