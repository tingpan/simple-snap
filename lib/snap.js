(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('simple-snap', ["jquery","simple-module","simple-dragdrop"], function (a0,b1,c2) {
      return (root['snap'] = factory(a0,b1,c2));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),require("simple-module"),require("simple-dragdrop"));
  } else {
    root['snap'] = factory(jQuery,SimpleModule,simple.dragdrop);
  }
}(this, function ($, SimpleModule, SimpleDragdrop) {



return snap;

}));
