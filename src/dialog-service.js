/**
 * Creates dialogs and takes care of their lifecycle events and adding/removing from the DOM.
 */
export class DialogService {

  /**
   * ModuleId of the VM that will be used as the dialog.
   * @type {string}
   */
  dialogVM = 'templates/dialog-bootstrap';

  anchor = null;
  _appReady = false;

  constructor(compiler) {
    this.compiler = compiler;

    //create container element that will hold all dialogs
    this.container = document.createElement("dialog-container");
  }

  /**
   * Configure this service by passing an options object.
   *
   * options:
   * - dialogVM
   *
   * @param options
   */
  setup(options) {
    for(let key in options){
      if(options[key]) this[key] = options[key];
    }
  }

  appReady(){
    this._appReady = true;
    this.setAnchor(this.anchor);
  }

  setAnchor(el){
    this.anchor = el||document.body;
    if(this.container.parentNode) this.container.parentNode.removeChild(this.container);
    this.anchor.appendChild(this.container);
  }

  /**
   * Create a new dialog that fetches it's body content from a VM.
   *
   * @param moduleId {string}     moduleId of the VM that will be used as the body
   * @param title {string}        Title for the dialog
   * @param buttons {Array}       Array of button definitions ({label:"Label",style:"btn-default",click:"closeDialog()"})
   * @returns {Promise}           A promise that will be resolved when the dialog and VM have been created
   */
  createVM(moduleId,title,buttons){
    //try to load the VM first
    return this.compiler.loadVM(moduleId).then(vm=>{
      //create a plain dialog
      return this.create("",title,buttons).then(child=>{
        var ctx = child.behaviors[0].executionContext;
        //inject a VM into the body of the dialog
        return this.injectElement(vm.metadata.elementName,ctx.body);
      });
    });
  }

  /**
   * Create a new dialog with static body content.
   *
   * @param content {string}   Content for the body
   * @param title {string}     Title for the dialog
   * @param buttons {Array}    Array of button definitions ({label:"Label",style:"btn-default",click:"closeDialog()"})
   * @returns {View|null}
   */
  create(content,title,buttons){
    //load the dialog template and create an empty dialog
    return this.createDialog().then(viewSlot=>{
      var el;

      var children = viewSlot.children;
      for(var i = 0, l = children.length; i < l; i++){
        var child = children[i];

        //the dialog will be the one right after the comment element
        el = child.firstChild.nextSibling;

        //listen to close event from the dialog
        let closeSub = (e)=>{
          this.onDialogClose(e, closeSub, el, viewSlot);
        };
        el.addEventListener("close", closeSub);

        //set the variables on the execution context of the dialog's VM
        var ctx = child.behaviors[0].executionContext;
        if(title) ctx.title = title;
        if(buttons) ctx.buttons = buttons;
        if(content) ctx.body.innerHTML = content;
        return child;
      }

      return null;
    });
  }

  /**
   * Called when a dialog is closed.
   *
   * This calls the detached method on the viewslot, unsubscribes from the close event
   * and removes the dialog from the DOM.
   *
   * @param e
   * @param closeSub
   * @param dialog
   * @param viewSlot
   */
  onDialogClose(e,closeSub,dialog,viewSlot){
    //call detached on the viewSlot
    viewSlot.detached();
    //unsubscribe from the close event;
    dialog.removeEventListener("close",closeSub);
    //remove the dialog from the dom
    dialog.parentNode.removeChild(dialog);
  }

  /**
   * Create a new dialog by loading in a VM that
   * represents a dialog and add it to the DOM.
   *
   * @returns {Promise} A promise that will be resolved when the dialog has been loaded and created.
   */
  createDialog(){
    return this.compiler.loadVM(this.dialogVM).then(vm=>{
      return this.injectElement(vm.metadata.elementName);
    });
  }

  /**
   * Inject a new element into the target.
   * the element is supplied as a tag name.
   * an element will be created and it will be compiled.
   *
   * @param elementName
   * @param target
   * @returns {ViewSlot}  the newly created viewslot for the element.
   */
  injectElement(elementName,target) {
    if(!target) target = this.container;
    var el = document.createElement(elementName);
    el = target.appendChild(el);
    return this.compiler.compile(el);
  }

  /**
   * Inject a module into the target.
   * the id is loaded as a VM and then injected/compiled.
   *
   * @param moduleId      id of the module load
   * @returns {Promise}   A promise that will be resolved when the module has been injected
   */
  injectModule(moduleId,target) {
    return this.compiler.loadVM(moduleId).then(vm=>{
      return this.injectElement(vm.metadata.elementName,target);
    });
  }

}
