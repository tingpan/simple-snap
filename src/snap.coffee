class Snap extends SimpleModule

  opts:
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
    align:true,
    alignOffset: 20,
    rage: 100

  _init: ->
    @wrapper = $(@opts.wrapper)
    throw new Error "simple-snap: wrapper option is invalid" if @wrapper.length == 0
    @dragdrop = SimpleDragdrop
      el: @opts.wrapper
      draggable: @opts.draggable
      droppable: @opts.droppable
      axis: @opts.axis
      placeholder: @opts.placeholder
      helper: null
      cursorPosition: @opts.cursorPosition
      cursorOffset: @opts.cursorOffset
      distance: @opts.distance
      @horiLine = $('<div></div>').appendTo("body")
      @horiLine.css({
        'position': 'absolute',
        'height': '1px',
        'background-color': '#c0392b',
        'visibility': 'hidden',
        'z-Index': 200
      })
      @vertLine = $('<div></div>').appendTo("body")
      @vertLine.css({
        'position': 'absolute',
        'width': '1px',
        'background-color': '#c0392b',
        'height': '300px',
        'visibility': 'hidden',
        'z-Index': 200
      })
    @wrapper.data 'snap', @
    @_bind()

  _bind: ->
    @dragdrop.on 'dragstart', (e, obj) =>
      @trigger 'dragstart', obj
    @dragdrop.on 'dragenter', (e, obj) =>
      @trigger 'dragenter', obj
    @dragdrop.on 'before-dragend', (e, obj) =>
      @trigger 'before-dragend', obj
    @dragdrop.on 'dragend', (e, obj) =>
      if @opts.align
        @horiLine.css "visibility", "hidden"
        @vertLine.css "visibility", "hidden"
      @trigger 'dragend', obj
    @dragdrop.on 'drag', (e, obj) =>
      if @opts.align
        @forceHori = 0
        @forceVert = 0
        @_checkHori obj
        @_checkVert obj
        top = obj.helper.offset().top + @forceHori
        left = obj.helper.offset().left + @forceVert
        obj.helper.css 'top', top
        obj.helper.css 'left', left
      @trigger 'drag', obj


  _checkHori: (obj)->
    _lineAxis = 0
    $helper = obj.helper
    $stopObj = null
    @horiLine.css 'visibility', 'hidden'
    targetTop = $helper.offset().top
    targetBot = $helper.offset().top + $helper.height()
    targetMid = (targetTop + targetBot) / 2
    $.each $(obj.dragging).siblings(@opts.draggable), (index, ele) =>
      forceHori = null
      lineAxis = null
      $ele = $(ele)
      if parseInt($ele.css('z-index')) is 100
        return
      if @_outRage $helper, $ele
        return
      eleTop = $ele.offset().top
      eleBot = $ele.offset().top + $ele.height()
      eleMid = (eleTop + eleBot) / 2
      eleReference = [eleTop, eleMid, eleBot]
      if (lineAxis = @_compareReferences targetMid, eleReference, 1)?
        forceHori = lineAxis - targetMid
      else if (lineAxis = @_compareReferences targetTop, eleReference, @opts.alignOffset)?
        forceHori = lineAxis - targetTop
      else if (lineAxis = @_compareReferences targetBot, eleReference, @opts.alignOffset)?
        forceHori = lineAxis - targetBot
      if forceHori?
        if $stopObj
          distance1 = @_distance $helper, $stopObj
          distance2 = @_distance $helper, $ele
          if distance2.x >= distance1.x
            return
        $stopObj = $ele
        @forceHori = forceHori
        _lineAxis = lineAxis
    if $stopObj?
      p1 = $helper.offset().left
      p2 = $stopObj.offset().left
      startPoint = if p2 < p1 then p2 else p1
      width = (Math.abs p1 - p2 ) + if p2 < p1 then parseInt $helper.css 'width' else parseInt $stopObj.css 'width'
      @horiLine.css({
        'visibility': 'visible',
        'width': width,
        'top': _lineAxis,
        'left': startPoint
      })

  _checkVert: (obj)->
    _lineAxis = 0
    $helper = obj.helper
    $stopObj = null
    @vertLine.css 'visibility', 'hidden'
    targetLeft = $helper.offset().left
    targetRight = $helper.offset().left + $helper.width()
    targetMid = (targetLeft + targetRight) / 2
    $.each $(obj.dragging).siblings(@opts.draggable), (index, ele) =>
      forceVert = null
      lineAxis = null
      $ele = $(ele)
      if parseInt($ele.css('z-index')) is 100
        return
      if @_outRage $helper, $ele
        return
      eleLeft = $ele.offset().left
      eleRight = $ele.offset().left + $ele.width()
      eleMid = (eleLeft + eleRight) / 2
      eleReference = [eleLeft, eleRight, eleMid]
      if (lineAxis = @_compareReferences targetMid, eleReference, 1)?
        forceVert = lineAxis - targetMid
      else if (lineAxis = @_compareReferences targetLeft, eleReference, @opts.alignOffset)?
        forceVert = lineAxis - targetLeft
      else if (lineAxis = @_compareReferences targetRight, eleReference, @opts.alignOffset)?
        forceVert = lineAxis - targetRight
      if forceVert?
        if $stopObj
          distance1 = @_distance $helper, $stopObj
          distance2 = @_distance $helper, $ele
          if distance2.y >= distance1.y
            return
        $stopObj = $ele
        @forceVert = forceVert
        _lineAxis = lineAxis
    if $stopObj?
      p1 = $helper.offset().top
      p2 = $stopObj.offset().top
      startPoint = if p2 < p1 then p2 else p1
      height = (Math.abs p1 - p2 ) + if p2 < p1 then $helper.height() else parseInt $stopObj.height()
      @vertLine.css({
        'visibility': 'visible',
        'height': height,
        'left': _lineAxis,
        'top': startPoint
      })


  _compareReferences: (target, references, offset) ->
    for reference in references
      if Math.abs(target - reference) <= offset / 2
        reference
    null

  _outRage: (target, reference) ->
    rage = @opts.rage
    distance = @_distance target,reference
    return (distance.y > rage || distance.x > rage)

  _distance: (target, reference)->
    targetX = (target.offset().left * 2 + target.width()) / 2
    targetY = (target.offset().top * 2 + target.height()) / 2
    referenceX = (reference.offset().left * 2 + reference.width()) / 2
    referenceY = (reference.offset().top * 2 + reference.height()) / 2
    distance =
      y : Math.abs(referenceY - targetY) - (target.height() + reference.height()) / 2
      x : Math.abs(referenceX - targetX) - (target.width() + reference.width()) / 2
    distance

snap = (opts) ->
  new Snap(opts)
