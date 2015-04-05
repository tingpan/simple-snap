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
    }, this.horiLine = $('<div></div>').appendTo("body"), this.horiLine.css({
      'position': 'absolute',
      'height': '1px',
      'background-color': 'red',
      'visibility': 'hidden',
      'z-Index': 200
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
        _this._checkHori(obj);
        return _this.trigger('drag', obj);
      };
    })(this));
  };

  Snap.prototype._checkHori = function(obj) {
    var $helper, $stopObj, _forceHori, _lineAxis, offsetHori, p1, p2, startPoint, targetBot, targetMid, targetTop, width;
    offsetHori = this.opts.alignOffset;
    _forceHori = 0;
    _lineAxis = 0;
    $helper = obj.helper;
    $stopObj = null;
    this.horiLine.css('visibility', 'hidden');
    targetTop = $helper.offset().top;
    targetBot = $helper.offset().top + $helper.height();
    targetMid = (targetTop + targetBot) / 2;
    $.each($(obj.dragging).siblings("." + $(obj.dragging).attr('class')), (function(_this) {
      return function(index, ele) {
        var $ele, distance1, distance2, eleBot, eleMid, eleReference, eleTop, forceHori, lineAxis;
        forceHori = null;
        lineAxis = null;
        $ele = $(ele);
        if (parseInt($ele.css('z-index')) === 100) {
          return;
        }
        eleTop = $ele.offset().top;
        eleBot = $ele.offset().top + $ele.height();
        eleMid = (eleTop + eleBot) / 2;
        eleReference = [eleTop, eleMid, eleBot];
        if ((lineAxis = _this._compareMid(targetMid, eleMid)) != null) {
          forceHori = lineAxis - targetMid;
        } else if ((lineAxis = _this._compareReferences(targetTop, eleReference)) != null) {
          forceHori = lineAxis - targetTop;
        } else if ((lineAxis = _this._compareReferences(targetBot, eleReference)) != null) {
          forceHori = lineAxis - targetBot;
        }
        if (forceHori != null) {
          if ($stopObj) {
            distance1 = Math.abs($stopObj.offset().left - $helper.offset().left);
            distance2 = Math.abs($ele.offset().left - $helper.offset().left);
            if (distance2 >= distance1) {
              return;
            }
          }
          $stopObj = $ele;
          _forceHori = forceHori;
          return _lineAxis = lineAxis;
        }
      };
    })(this));
    if ($stopObj != null) {
      p1 = $helper.offset().left;
      p2 = $stopObj.offset().left;
      startPoint = p2 < p1 ? p2 : p1;
      width = (Math.abs(p1 - p2)) + (p2 < p1 ? parseInt($helper.css('width')) : parseInt($stopObj.css('width')));
      return this.horiLine.css({
        'visibility': 'visible',
        'width': width,
        'top': _lineAxis,
        'left': startPoint
      });
    }
  };

  Snap.prototype._compareMid = function(target, reference) {
    var offsetHori;
    offsetHori = this.opts.alignOffset;
    if (Math.abs(target - reference) <= offsetHori / 2) {
      return reference;
    }
    return null;
  };

  Snap.prototype._compareReferences = function(target, references) {
    var i, len, offsetHori, reference;
    offsetHori = this.opts.alignOffset;
    for (i = 0, len = references.length; i < len; i++) {
      reference = references[i];
      if (Math.abs(target - reference) <= offsetHori / 2) {
        return reference;
      }
    }
    return null;
  };

  return Snap;

})(SimpleModule);

snap = function(opts) {
  return new Snap(opts);
};

    return snap;

}));