
class Snap extends SimpleModule
  @pluginName: 'Snap'

  _init: ->
    @dragdrop = @_module

Dragdrop.connect Snap
