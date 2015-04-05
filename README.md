simple-snap
=============

A snap extension for simple-dragdrop

###使用方法:
首先，需要在页面里引用相关脚本:
 ```
 <script type="text/javascript" src="path/to/jquery.min.js"></script>
 <script type="text/javascript" src="path/to/module.js"></script>
 <script type="text/javascript" src="path/to/dragdrop.js"></script>
 <script type="text/javascript" src="path/to/snap.js"></script>
```
实例化
```
simple.snap({
    draggable: '.ball',
});
```
###初始化选项：
####wrapper
可选，容器元素，默认为documen。
####draggable
必选，可以被drag的元素的选择符selector string
####droppable
必选，可以被drop的元素的选择符selector string
####placeholder
可选，开始拖动之后被拖拽元素会隐藏，显示placeholder，可以是Dom/function，如果为空，则是一个空白的占位元素
####cursorPosition
可选，确定helper的相对于鼠标的位置，默认为'auto'，还可以为'center'（中心）, 'cornor'（左上角）
####cursorOffset
可选，对helper位置进行微调，需要传入top以及left
####axis
可选，拖拽的方向，默认为'both', 可以为'x', 'y'
####align
可选，是否产生对齐，默认为true
####alignOffset
可选，发生对齐的最大误差，默认为10
####rage
可选，两个物体产生对齐的最大距离，默认为100

###事件

#####dragstart opts: dragging, helper, placeholder

当拖拽发生时触发

#####dragenter opts: dragging, target, helper, placeholder

当被拖拽元素进入可以放置区域时触发

#####dragleave opts: dragging, target, helper, placeholder

当被拖拽元素离开可以放置区域时触发

#####drag opts: dragging, helper, placeholder

被拖拽的时候，持续触发

#####before-dragend opts: dragging, helper, placeholder

当拖拽结束前触发，此时，helper以及placeholder都没有被移除

#####dragend opts: dragging

当拖拽结束的时候触发，此时，helper以及placeholder已经被移除

#####drop opts: dragging, target

当拖拽元素放置到可放置区域时触发