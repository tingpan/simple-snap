
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
      @topLine = $('<div></div>').appendTo("body")
      @topLine.css({
        'position' : 'absolute',
        'height' : '1px',
        'background-color': 'red',
        'visibility' : 'hidden'
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
      @_checkAlign obj
      @trigger 'drag',obj

  _checkAlign: (obj)->
    topAlign = @opts.alignOffset
    alignTop = null
    $helper = obj.helper
    $stopObj = $helper
    $startObj = $helper
    @topLine.css 'visibility','hidden'
    $.each $('.ball'), (index,ele) =>
      $ele = $(ele)
      if parseInt($ele.css('z-index')) isnt 100
        top = parseInt $ele.css 'top'
        targetTop = parseInt $helper.css 'top'
        if targetTop - top > 0 and targetTop - top <= topAlign
          alignTop = top
          left = $ele.css 'left'
          if left < $startObj.css 'left'
            $startObj = $ele
          if left > $stopObj.css 'left'
            $stopObj =$ele
      if alignTop?
          lineStart = parseInt $startObj.css('left')
          lineStop = parseInt $stopObj.css('left')
          width = lineStop - lineStart + parseInt $stopObj.css('width')
          @topLine.css({
            'visibility' : 'visible'
            'width' : width
            'top' : alignTop,
            'left' : lineStart,
          })
          @forceTop = alignTop

snap = (opts) ->
  new Snap(opts)
