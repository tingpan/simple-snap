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
root.simple = root.simple || {};
root.simple['snap'] = factory(jQuery,SimpleModule,simple.dragdrop);
}
}(this, function ($, SimpleModule, SimpleDragdrop) {

var Snap, snap,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Snap = (function(superClass) {
  extend(Snap, superClass);

  function Snap() {
    return Snap.__super__.constructor.apply(this, arguments);
  }

  Snap.prototype.opts = {
    wrapper: document,
    draggable: null,
    droppable: null,
    helper: null,
    placeholder: null,
    cursorPosition: 'auto',
    cursorOffset: {
      top: 0,
      left: 0
    },
    distance: 1,
    axis: null,
    alignMode: 1,
    alignOffset: 10
  };

  Snap.prototype._init = function() {
    this.wrapper = $(this.opts.wrapper);
    if (this.wrapper.length === 0) {
      throw new Error("simple-snap: wrapper option is invalid");
    }
    this.dragdrop = SimpleDragdrop({
      el: this.opts.wrapper,
      draggable: this.opts.draggable,
      droppable: this.opts.droppable,
      axis: this.opts.axis,
      placeholder: this.opts.placeholder,
      helper: null,
      cursorPosition: this.opts.cursorPosition,
      cursorOffset: this.opts.cursorOffset,
      distance: this.opts.distance
    }, this.topLine = $('<div></div>').appendTo("body"), this.topLine.css({
      'position': 'absolute',
      'height': '1px',
      'background-color': 'red',
      'visibility': 'hidden'
    }));
    this.wrapper.data('sortable', this);
    this.showAlign = null;
    return this._bind();
  };

  Snap.prototype._bind = function() {
    this.dragdrop.on('dragstart', (function(_this) {
      return function(e, obj) {
        return _this.trigger('dragstart', obj);
      };
    })(this));
    this.dragdrop.on('dragenter', (function(_this) {
      return function(e, obj) {
        return _this.trigger('dragenter', obj);
      };
    })(this));
    this.dragdrop.on('before-dragend', (function(_this) {
      return function(e, obj) {
        return _this.trigger('before-dragend', obj);
      };
    })(this));
    this.dragdrop.on('dragend', (function(_this) {
      return function(e, obj) {
        return _this.trigger('dragend', obj);
      };
    })(this));
    return this.dragdrop.on('drag', (function(_this) {
      return function(e, obj) {
        clearTimeout(_this.showAlign);
        _this.forceTop = null;
        _this.forceLeft = null;
        _this._checkAlign(obj);
        return _this.trigger('drag', obj);
      };
    })(this));
  };

  Snap.prototype._checkAlign = function(obj) {
    var $helper, $startObj, $stopObj, alignTop, topAlign;
    topAlign = this.opts.alignOffset;
    alignTop = null;
    $helper = obj.helper;
    $stopObj = $helper;
    $startObj = $helper;
    this.topLine.css('visibility', 'hidden');
    return $.each($('.ball'), (function(_this) {
      return function(index, ele) {
        var $ele, left, lineStart, lineStop, targetTop, top, width;
        $ele = $(ele);
        if (parseInt($ele.css('z-index')) !== 100) {
          top = parseInt($ele.css('top'));
          targetTop = parseInt($helper.css('top'));
          if (targetTop - top > 0 && targetTop - top <= topAlign) {
            alignTop = top;
            left = $ele.css('left');
            if (left < $startObj.css('left')) {
              $startObj = $ele;
            }
            if (left > $stopObj.css('left')) {
              $stopObj = $ele;
            }
          }
        }
        if (alignTop != null) {
          lineStart = parseInt($startObj.css('left'));
          lineStop = parseInt($stopObj.css('left'));
          width = lineStop - lineStart + parseInt($stopObj.css('width'));
          _this.topLine.css({
            'visibility': 'visible',
            'width': width,
            'top': alignTop,
            'left': lineStart
          });
          return _this.forceTop = alignTop;
        }
      };
    })(this));
  };

  return Snap;

})(SimpleModule);

snap = function(opts) {
  return new Snap(opts);
};

    return snap;

}));