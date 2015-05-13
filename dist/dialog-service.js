System.register([], function (_export) {
  var _classCallCheck, _createClass, DialogService;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      DialogService = (function () {
        function DialogService(compiler) {
          _classCallCheck(this, DialogService);

          this.dialogVM = "templates/dialog-bootstrap";
          this.anchor = null;
          this._appReady = false;

          this.compiler = compiler;

          this.container = document.createElement("dialog-container");
        }

        _createClass(DialogService, [{
          key: "setup",
          value: function setup(options) {
            for (var key in options) {
              if (options[key]) this[key] = options[key];
            }
          }
        }, {
          key: "appReady",
          value: function appReady() {
            this._appReady = true;
            this.setAnchor(this.anchor);
          }
        }, {
          key: "setAnchor",
          value: function setAnchor(el) {
            this.anchor = el || document.body;
            if (this.container.parentNode) this.container.parentNode.removeChild(this.container);
            this.anchor.appendChild(this.container);
          }
        }, {
          key: "createVM",
          value: function createVM(moduleId, title, buttons) {
            var _this = this;

            return this.compiler.loadVM(moduleId).then(function (vm) {
              return _this.create("", title, buttons).then(function (child) {
                var ctx = child.behaviors[0].executionContext;

                return _this.injectElement(vm.metadata.elementName, ctx.body);
              });
            });
          }
        }, {
          key: "create",
          value: function create(content, title, buttons) {
            var _this2 = this;

            return this.createDialog().then(function (viewSlot) {
              var el;

              var children = viewSlot.children;

              var _loop = function () {
                child = children[i];

                el = child.firstChild.nextSibling;

                var closeSub = (function (_closeSub) {
                  function closeSub(_x) {
                    return _closeSub.apply(this, arguments);
                  }

                  closeSub.toString = function () {
                    return _closeSub.toString();
                  };

                  return closeSub;
                })(function (e) {
                  _this2.onDialogClose(e, closeSub, el, viewSlot);
                });
                el.addEventListener("close", closeSub);

                ctx = child.behaviors[0].executionContext;

                if (title) ctx.title = title;
                if (buttons) ctx.buttons = buttons;
                if (content) ctx.body.innerHTML = content;
                return {
                  v: child
                };
              };

              for (var i = 0, l = children.length; i < l; i++) {
                var child;
                var ctx;

                var _ret = _loop();

                if (typeof _ret === "object") return _ret.v;
              }

              return null;
            });
          }
        }, {
          key: "onDialogClose",
          value: function onDialogClose(e, closeSub, dialog, viewSlot) {
            viewSlot.detached();

            dialog.removeEventListener("close", closeSub);

            dialog.parentNode.removeChild(dialog);
          }
        }, {
          key: "createDialog",
          value: function createDialog() {
            var _this3 = this;

            return this.compiler.loadVM(this.dialogVM).then(function (vm) {
              return _this3.injectElement(vm.metadata.elementName);
            });
          }
        }, {
          key: "injectElement",
          value: function injectElement(elementName, target) {
            if (!target) target = this.container;
            var el = document.createElement(elementName);
            el = target.appendChild(el);
            return this.compiler.compile(el);
          }
        }, {
          key: "injectModule",
          value: function injectModule(moduleId, target) {
            var _this4 = this;

            return this.compiler.loadVM(moduleId).then(function (vm) {
              return _this4.injectElement(vm.metadata.elementName, target);
            });
          }
        }]);

        return DialogService;
      })();

      _export("DialogService", DialogService);
    }
  };
});