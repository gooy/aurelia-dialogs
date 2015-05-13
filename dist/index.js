System.register(['./dialog-service', 'gooy/aurelia-compiler'], function (_export) {
  var DialogService, Compiler;

  _export('configure', configure);

  function configure(aurelia, cb) {
    var instance = new DialogService(aurelia.container.get(Compiler));
    aurelia.container.registerInstance(DialogService, instance);
    if (cb) {
      return cb(instance);
    }
  }

  return {
    setters: [function (_dialogService) {
      DialogService = _dialogService.DialogService;

      _export('DialogService', _dialogService.DialogService);
    }, function (_gooyAureliaCompiler) {
      Compiler = _gooyAureliaCompiler.Compiler;
    }],
    execute: function () {
      'use strict';
    }
  };
});