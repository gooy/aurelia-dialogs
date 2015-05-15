# Aurelia Dialogs

A dialog service that creates dialogs/modals from a VM and takes care of their lifecycle events and depths.

## Demo

- [Demo App](http://gooy.github.io/aurelia-dialogs-demo)

## Installation

    jspm install github:gooy/aurelia-dialogs

## Usage

Register it with the framework.

    aurelia.use.plugin("gooy/aurelia-dialogs");

inject the service and use it.

```javascript
import {DialogService} from 'gooy/aurelia-dialogs';

export class Test(){
  static inject = [DialogService];
  constructor(dialogService) {
    dialogService.create("flickr");
  }
}
```

Note that the create function accepts a `moduleId` that should point to a View Model.

Example that opens a modal when a button is clicked.

View
```markup
<template>
  <button click.delegate="createDialog()">Create Dialog<button>
</template>
```

VM
```javascript
import {DialogService} from 'gooy/aurelia-dialogs';

export class Test(){
  static inject = [DialogService];
  constructor(dialogService) {
    this.dialogService = dialogService;
  }
  
  createDialog(){
    this.dialogService.create("flickr");
  }
}
```
