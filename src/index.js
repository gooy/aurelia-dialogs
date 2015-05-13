import {DialogService} from './dialog-service';
export {DialogService} from './dialog-service';
import {Compiler} from 'gooy/aurelia-compiler';

export function configure(aurelia, cb){
  var instance = new DialogService(aurelia.container.get(Compiler));
  aurelia.container.registerInstance(DialogService, instance);
  if(cb) return cb(instance);
}
