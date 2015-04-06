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
    align: true,
    alignOffset: 10,
    rage: 100
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
      'background-color': '#c0392b',
      'visibility': 'hidden',
      'z-Index': 200
    }), this.vertLine = $('<div></div>').appendTo("body"), this.vertLine.css({
      'position': 'absolute',
      'width': '1px',
      'background-color': '#c0392b',
      'height': '300px',
      'visibility': 'hidden',
      'z-Index': 200
    }));
    this.wrapper.data('sortable', this);
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
        if (_this.opts.align) {
          _this.horiLine.css("visibility", "hidden");
          _this.vertLine.css("visibility", "hidden");
        }
        return _this.trigger('dragend', obj);
      };
    })(this));
    return this.dragdrop.on('drag', (function(_this) {
      return function(e, obj) {
        var left, top;
        if (_this.opts.align) {
          _this.forceHori = 0;
          _this.forceVert = 0;
          _this._checkHori(obj);
          _this._checkVert(obj);
          top = obj.helper.offset().top + _this.forceHori;
          left = obj.helper.offset().left + _this.forceVert;
          obj.helper.css('top', top);
          obj.helper.css('left', left);
        }
        return _this.trigger('drag', obj);
      };
    })(this));
  };

  Snap.prototype._checkHori = function(obj) {
    var $helper, $stopObj, _lineAxis, p1, p2, startPoint, targetBot, targetMid, targetTop, width;
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
        if (_this._outRage($helper, $ele)) {
          return;
        }
        eleTop = $ele.offset().top;
        eleBot = $ele.offset().top + $ele.height();
        eleMid = (eleTop + eleBot) / 2;
        eleReference = [eleTop, eleMid, eleBot];
        if ((lineAxis = _this._compareReferences(targetMid, eleReference, 1)) != null) {
          forceHori = lineAxis - targetMid;
        } else if ((lineAxis = _this._compareReferences(targetTop, eleReference, _this.opts.alignOffset)) != null) {
          forceHori = lineAxis - targetTop;
        } else if ((lineAxis = _this._compareReferences(targetBot, eleReference, _this.opts.alignOffset)) != null) {
          forceHori = lineAxis - targetBot;
        }
        if (forceHori != null) {
          if ($stopObj) {
            distance1 = _this._distance($helper, $stopObj);
            distance2 = _this._distance($helper, $ele);
            if (distance2.x >= distance1.x) {
              return;
            }
          }
          $stopObj = $ele;
          _this.forceHori = forceHori;
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

  Snap.prototype._checkVert = function(obj) {
    var $helper, $stopObj, _lineAxis, height, p1, p2, startPoint, targetLeft, targetMid, targetRight;
    _lineAxis = 0;
    $helper = obj.helper;
    $stopObj = null;
    this.vertLine.css('visibility', 'hidden');
    targetLeft = $helper.offset().left;
    targetRight = $helper.offset().left + $helper.width();
    targetMid = (targetLeft + targetRight) / 2;
    $.each($(obj.dragging).siblings("." + $(obj.dragging).attr('class')), (function(_this) {
      return function(index, ele) {
        var $ele, distance1, distance2, eleLeft, eleMid, eleReference, eleRight, forceVert, lineAxis;
        forceVert = null;
        lineAxis = null;
        $ele = $(ele);
        if (parseInt($ele.css('z-index')) === 100) {
          return;
        }
        if (_this._outRage($helper, $ele)) {
          return;
        }
        eleLeft = $ele.offset().left;
        eleRight = $ele.offset().left + $ele.width();
        eleMid = (eleLeft + eleRight) / 2;
        eleReference = [eleLeft, eleRight, eleMid];
        if ((lineAxis = _this._compareReferences(targetMid, eleReference, 1)) != null) {
          forceVert = lineAxis - targetMid;
        } else if ((lineAxis = _this._compareReferences(targetLeft, eleReference, _this.opts.alignOffset)) != null) {
          forceVert = lineAxis - targetLeft;
        } else if ((lineAxis = _this._compareReferences(targetRight, eleReference, _this.opts.alignOffset)) != null) {
          forceVert = lineAxis - targetRight;
        }
        if (forceVert != null) {
          if ($stopObj) {
            distance1 = _this._distance($helper, $stopObj);
            distance2 = _this._distance($helper, $ele);
            if (distance2.y >= distance1.y) {
              return;
            }
          }
          $stopObj = $ele;
          _this.forceVert = forceVert;
          return _lineAxis = lineAxis;
        }
      };
    })(this));
    if ($stopObj != null) {
      p1 = $helper.offset().top;
      p2 = $stopObj.offset().top;
      startPoint = p2 < p1 ? p2 : p1;
      height = (Math.abs(p1 - p2)) + (p2 < p1 ? $helper.height() : parseInt($stopObj.height()));
      return this.vertLine.css({
        'visibility': 'visible',
        'height': height,
        'left': _lineAxis,
        'top': startPoint
      });
    }
  };

  Snap.prototype._compareReferences = function(target, references, offset) {
    var i, len, reference;
    for (i = 0, len = references.length; i < len; i++) {
      reference = references[i];
      if (Math.abs(target - reference) <= offset / 2) {
        return reference;
      }
    }
    return null;
  };

  Snap.prototype._outRage = function(target, reference) {
    var distance, rage;
    rage = this.opts.rage;
    distance = this._distance(target, reference);
    return distance.y > rage || distance.x > rage;
  };

  Snap.prototype._distance = function(target, reference) {
    var distance, referenceX, referenceY, targetX, targetY;
    targetX = (target.offset().left * 2 + target.width()) / 2;
    targetY = (target.offset().top * 2 + target.height()) / 2;
    referenceX = (reference.offset().left * 2 + reference.width()) / 2;
    referenceY = (reference.offset().top * 2 + reference.height()) / 2;
    distance = {
      y: Math.abs(referenceY - targetY) - (target.height() + reference.height()) / 2,
      x: Math.abs(referenceX - targetX) - (target.width() + reference.width()) / 2
    };
    return distance;
  };

  return Snap;

})(SimpleModule);

snap = function(opts) {
  return new Snap(opts);
};

    return snap;

}));