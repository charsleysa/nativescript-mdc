import {
    ComponentFactoryResolver,
    ComponentRef,
    Injectable,
    Injector,
    NgModuleRef,
    Type,
    ViewContainerRef
} from '@angular/core';

import { View } from 'tns-core-modules/ui/core/view';
import { topmost, Frame } from 'tns-core-modules/ui/frame';
import { ProxyViewContainer } from 'tns-core-modules/ui/proxy-view-container/proxy-view-container';

import { DetachedLoader, PageFactory, PAGE_FACTORY } from 'nativescript-angular';
import { NSLocationStrategy } from 'nativescript-angular/router/ns-location-strategy';
import { AppHostView } from 'nativescript-angular/app-host-view';
import { once } from 'nativescript-angular/common/utils';

import '../bottomSheet';
import { ShowBottomSheetOptions } from '../bottomSheet';

export type BaseShowBottomSheetOptions = Pick<ShowBottomSheetOptions, Exclude<keyof ShowBottomSheetOptions, 'closeCallback' | 'context'>>;

export interface MDCBottomSheetOptions extends BaseShowBottomSheetOptions {
    context?: any;
    viewContainerRef?: ViewContainerRef;
    moduleRef?: NgModuleRef<any>;
    target?: View;
}

export class MDCBottomSheetParams<T = any> {
    constructor(
        public context: T,
        public closeCallback: (...args) => any) {
    }
}

interface ShowSheetOptions extends BaseShowBottomSheetOptions {
    containerRef: ViewContainerRef;
    context: any;
    doneCallback;
    pageFactory: PageFactory;
    parentView: View;
    resolver: ComponentFactoryResolver;
    type: Type<any>;
}

@Injectable()
export class MDCBottomSheetService {
    constructor(private location: NSLocationStrategy) {}

    public showBottomSheet(type: Type<any>, options: MDCBottomSheetOptions): Promise<any> {
        if (!options.viewContainerRef) {
            throw new Error(`No viewContainerRef: Make sure you pass viewContainerRef in BottomSheetOptions.`);
        }

        let parentView = options.viewContainerRef.element.nativeElement;
        if (options.target) {
            parentView = options.target;
        }

        if (parentView instanceof AppHostView && parentView.ngAppRoot) {
            parentView = parentView.ngAppRoot;
        }

        // _ngDialogRoot is the first child of the previously detached proxy.
        // It should have 'viewController' (iOS) or '_dialogFragment' (Android) available for
        // presenting future modal views.
        if (parentView._ngDialogRoot) {
            parentView = parentView._ngDialogRoot;
        }

        const pageFactory: PageFactory = options.viewContainerRef.injector.get(PAGE_FACTORY);

        // resolve from particular module (moduleRef)
        // or from same module as parentView (viewContainerRef)
        const componentContainer = options.moduleRef || options.viewContainerRef;
        const resolver = componentContainer.injector.get(ComponentFactoryResolver);

        let frame = parentView;
        if (!(parentView instanceof Frame)) {
            frame = (parentView.page && parentView.page.frame) || topmost();
        }

        this.location._beginModalNavigation(frame);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    this._showDialog({
                        ...options,
                        containerRef: options.viewContainerRef,
                        context: options.context,
                        doneCallback: resolve,
                        pageFactory,
                        parentView,
                        resolver,
                        type
                    });
                } catch (err) {
                    reject(err);
                }
            }, 10);
        });
    }

    private _showDialog(options: ShowSheetOptions): void {
        let componentView: View;
        let detachedLoaderRef: ComponentRef<DetachedLoader>;

        const closeCallback = once((...args) => {
            options.doneCallback.apply(undefined, args);
            if (componentView) {
                componentView.closeBottomSheet();
                this.location._closeModalNavigation();
                detachedLoaderRef.instance.detectChanges();
                detachedLoaderRef.destroy();
            }
        });

        const modalParams = new MDCBottomSheetParams(options.context, closeCallback);

        const childInjector = Injector.create({
            providers: [{ provide: MDCBottomSheetParams, useValue: modalParams }],
            parent: options.containerRef.injector
        });
        const detachedFactory = options.resolver.resolveComponentFactory(DetachedLoader);
        detachedLoaderRef = options.containerRef.createComponent(detachedFactory, -1, childInjector, null);
        detachedLoaderRef.instance.loadComponent(options.type).then((compRef) => {
            const detachedProxy = <ProxyViewContainer>compRef.location.nativeElement;

            if (detachedProxy.getChildrenCount() > 1) {
                throw new Error('BottomSheet content has more than one root view.');
            }
            componentView = detachedProxy.getChildAt(0);

            if (componentView.parent) {
                (<any>componentView.parent)._ngDialogRoot = componentView;
                (<any>componentView.parent).removeChild(componentView);
            }

            options.parentView.showBottomSheet(componentView, { ...options, closeCallback });
        });
    }
}
