import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import {HelloWorldModel} from './main-view-model';

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();
}

export function loaded(args) {
    let bar = args.object;
    bar.on('tabSelected', (args) => {
        if (args.newIndex === 1) {
            alert('This item has selectable: false, and should be used to perform actions');
        }
        console.log('tab selected ' + args.newIndex);
    });
}
