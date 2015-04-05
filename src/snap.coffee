
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
    alignMode: 1,
    alignOffset: 10,

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
        'position' : 'absolute',
        'height' : '1px',
        'background-color': 'red',
        'visibility' : 'hidden',
        'z-Index': 200
      })
    @wrapper.data 'sortable', @
    @showAlign = null
    @_bind()

  _bind: ->
    @dragdrop.on 'dragstart', (e,obj) =>
      @trigger 'dragstart',obj
    @dragdrop.on 'dragenter', (e,obj) =>
      @trigger 'dragenter', obj
    @dragdrop.on 'before-dragend', (e,obj) =>
      @trigger 'before-dragend', obj
    @dragdrop.on 'dragend', (e,obj) =>
      @trigger 'dragend', obj
    @dragdrop.on 'drag' ,(e,obj) =>
      clearTimeout @showAlign
      @forceTop = null
      @forceLeft = null
      @_checkHori obj
      @trigger 'drag',obj

  _checkHori: (obj)->
    offsetHori = @opts.alignOffset
    _forceHori = 0
    _lineAxis = 0
    $helper = obj.helper
    $stopObj = null
    @horiLine.css 'visibility','hidden'
    targetTop = $helper.offset().top
    targetBot = $helper.offset().top + $helper.height()
    targetMid = (targetTop + targetBot) / 2
    $.each $(obj.dragging).siblings("."+$(obj.dragging).attr('class')), (index,ele) =>
      forceHori = null
      lineAxis = null
      $ele = $(ele)
      if parseInt($ele.css('z-index')) is 100
        return
      eleTop = $ele.offset().top
      eleBot = $ele.offset().top + $ele.height()
      eleMid = (eleTop + eleBot) / 2
      eleReference = [eleTop , eleMid , eleBot]
      if (lineAxis = @_compareMid targetMid , eleMid)?
        forceHori = lineAxis - targetMid
      else if (lineAxis = @_compareReferences targetTop, eleReference)?
        forceHori = lineAxis - targetTop
      else if (lineAxis = @_compareReferences targetBot, eleReference)?
        forceHori = lineAxis - targetBot

#      if targetTop - eleTop >= 0 && targetTop - eleTop <= offsetHori
#        forceHori  = eleTop - targetTop
#        lineAxis = eleTop
#      else if targetTop - eleBot >= 0 && targetTop - eleBot <= offsetHori
#        forceHori  = eleBot - targetTop
#        lineAxis = eleBot
#      else if eleBot - targetBot >= 0 && eleBot - targetBot <= offsetHori
#        forceHori  = eleBot - targetBot
#        lineAxis = eleBot
#      else if eleTop - targetBot >= 0 && eleTop - targetBot <= offsetHori
#        forceHori = eleTop - targetBot
#        lineAxis = eleTop
      if forceHori?
        if $stopObj
          distance1 = Math.abs ($stopObj.offset().left - $helper.offset().left)
          distance2 = Math.abs($ele.offset().left - $helper.offset().left)
          if distance2 >= distance1
            return
        $stopObj = $ele
        _forceHori = forceHori
        _lineAxis = lineAxis
    if $stopObj?
      p1 = $helper.offset().left
      p2 = $stopObj.offset().left
      startPoint = if p2 < p1 then p2 else p1
      width = (Math.abs p1 - p2 ) + if p2 < p1 then parseInt $helper.css 'width' else parseInt $stopObj.css 'width'
      @horiLine.css({
        'visibility' : 'visible',
        'width' : width,
        'top' : _lineAxis,
        'left' : startPoint
      })

  _compareMid : (target,reference) ->
    offsetHori = @opts.alignOffset
    if Math.abs(target - reference) <= offsetHori/2
      return reference
    null

  _compareReferences: (target,references) ->
    offsetHori = @opts.alignOffset
    for reference in references
      if Math.abs(target - reference) <= offsetHori/2
        return reference
    null

snap = (opts) ->
  new Snap(opts)
