# nativescript-mdc

NativeScript-MDC provides Material Design Components using the official MDC libraries for iOS and Android.

Currently only the following components have been implemented:
- Activity Indicator
- Bottom App Bar
- Bottom Navigation
- Bottom Sheet
- Button
- Card View
- Dialogs
- Floating Action Button
- Progress
- Ripple
- Slider
- Snack Bar
- Text Field

Thanks to the following plugins for providing a reference when building this plugin:
[nativescript-bottom-navigation](https://github.com/henrychavez/nativescript-bottom-navigation)
[nativescript-cardview](https://github.com/bradmartin/nativescript-cardview)
[nativescript-floatingactionbutton](https://github.com/bradmartin/nativescript-floatingactionbutton)
[nativescript-material-components](https://github.com/Akylas/nativescript-material-components)

## (Optional) Prerequisites / Requirements

You need NativeScript version `^6.0.0` to be able to use this plugin.

## Installation

```javascript
tns plugin add nativescript-mdc
```

## Usage

Usage is per component.
To give an overview of how to use the components below is a very minimal example of the Bottom Navigation.

#### XML

You can set the tabs using the `tabs` property

```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd"
      xmlns:mdc="nativescript-mdc"
      loaded="pageLoaded"
      class="page">
    <GridLayout columns="*" rows="*, auto">
        <StackLayout row="0">
            <Label text="content"></Label>
        </StackLayout>
        <mdc:BottomNavigation
            tabs="{{ tabs }}"
            activeColor="blue"
            inactiveColor="red"
            loaded="bottomNavigationLoaded"
            titleVisibility="always"
            row="1">
        </mdc:BottomNavigation>
    </GridLayout>
</Page>
```

```javascript
import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { BottomNavigation, BottomNavigationTab, OnTabSelectedEventData } from "nativescript-mdc";

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = {
        tabs: [
            new BottomNavigationTab('First', 'ic_home'),
            new BottomNavigationTab('Second', 'ic_view_list', null, false),
            new BottomNavigationTab('Third', 'ic_menu'),
            new BottomNavigationTab('Forth', 'ic_view_list', 'ic_menu')
        ]
    };
}

export function bottomNavigationLoaded(args) {
    let bottomNavigation: BottomNavigation = args.object;
    // For some reason the tabSelected event doesn't work if you
    // handle it from the view, so you need to handle the event in this way.
    bottomNavigation.on('tabSelected', tabSelected);
}

export function tabSelected(args: OnTabSelectedEventData) {
    console.log('tab selected ' + args.newIndex);
}

```


#### Angular

First you need to include the `NativeScriptMDCModule` in your app.module.ts

```javascript
import { NativeScriptMDCModule} from "nativescript-mdc/angular";

@NgModule({
    imports: [
        NativeScriptMDCModule
    ],
    ...
})
```

You can declare the BottomNavigationTabs in your html directly

```xml
<GridLayout rows="*, auto">
    <StackLayout row="0">
       <Label text="content"></Label>
    </StackLayout>
    <BottomNavigation
        activeColor="red"
        inactiveColor="yellow"
        (tabSelected)="onBottomNavigationTabSelected($event)"
        titleVisibility="always"
        row="1">
        <BottomNavigationTab title="First" icon="ic_home"></BottomNavigationTab>
        <BottomNavigationTab title="Second" icon="ic_view_list" selectable="false"></BottomNavigationTab>
        <BottomNavigationTab title="Third" icon="ic_menu"></BottomNavigationTab>
        <BottomNavigationTab title="Forth" icon="ic_view_list" selectedIcon="ic_menu"></BottomNavigationTab>
    </BottomNavigation>
</GridLayout>
```

```javascript
import { Component, OnInit } from '@angular/core';
import { OnTabSelectedEventData } from 'nativescript-mdc';

@Component(
  {
    selector: 'ns-app',
    moduleId: module.id,
    templateUrl: './app.component.html',
  }
)
export class AppComponent {
  onBottomNavigationTabSelected(args: OnTabSelectedEventData): void {
    console.log(`Tab selected:  ${args.newIndex}`);
  }
}
```

## API

TODO
Describe your plugin methods and properties here. See [nativescript-feedback](https://github.com/EddyVerbruggen/nativescript-feedback) for example.
    
| Property | Default | Description |
| --- | --- | --- |
| some property | property default value | property description, default values, etc.. |
| another property | property default value | property description, default values, etc.. |
    
## License

Apache License Version 2.0, January 2004
