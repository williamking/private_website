/* Created by William */
// Generated by LiveScript 1.3.1
(function(){
  $(function(){
    var that, canvas, windowToCanvas, canvasListener, drawingFrame, iFrame;
    if (that = window.location.pathname === '/factory/drawing') {
      canvas = $('#canvas');
      canvas[0].height = 600;
      canvas[0].width = 800;
      windowToCanvas = function(canvas, x, y){
        var bbox;
        bbox = canvas.getBoundingClientRect();
        return {
          x: (x - bbox.left) * (canvas.width / bbox.width),
          y: (y - bbox.top) * (canvas.height / bbox.height)
        };
      };
      canvasListener = function(canvas){
        this.canvas = canvas;
        this.events = [];
      };
      canvasListener.prototype.addEvent = function(x, y, width, height, type, callback){
        var newEvent, eventFunc;
        newEvent = {
          x: x,
          y: y,
          width: width,
          height: height,
          type: type
        };
        eventFunc = function(obj, canvas, callback){
          return function(event){
            var loc;
            loc = windowToCanvas(canvas[0], event.clientX, event.clientY);
            if (loc.x >= obj.x && loc.x < obj.x + obj.width && loc.y >= obj.y && loc.y < obj.y + obj.height) {
              return callback(event, loc);
            }
          };
        };
        newEvent.callback = eventFunc(newEvent, this.canvas, callback);
        this.events.push(newEvent);
        switch (type) {
        case 'click':
          this.canvas.click(newEvent.callback);
          break;
        case 'mousemove':
          this.canvas.mousemove(newEvent.callback);
          break;
        case 'mousedown':
          this.canvas.mousedown(newEvent.callback);
          break;
        case 'mouseup':
          this.canvas.mouseup(newEvent.callback);
        }
      };
      drawingFrame = function(){
        this.canvas = canvas[0];
        this.context = canvas[0].getContext('2d');
        this.listener = new canvasListener(canvas);
        this.originX = 0;
        this.originY = 40;
        this.height = canvas[0].height - this.originY;
        this.width = canvas[0].width - this.originX;
        this.buttons = [];
        this.numOfButtons = 0;
        this.BUTTON_MARGIN = 8;
        this.BUTTON_SHADOW_COLOR = 'rgba(0, 0, 0, 0.7)';
        this.BUTTON_SHADOW_OFFSET = 1;
        this.BUTTON_SHADOW_BLUR = 2;
        this.BUTTON_HEIGHT = 20;
        this.BUTTON_WIDTH = 80;
        this.SELECT_BUTTON_SHADOW_OFFSET = 4;
        this.SELECT_BUTTON_SHADOW_BLUR = 5;
        this.BUTTON_BACKGROUND_STYLE = '#eeeeee';
        this.BUTTON_BORDER_STROKE_STYLE = 'rgb(100, 140, 230)';
        this.BUTTON_STROKE_STYLE = 'rgb(100, 140, 230, 0.5)';
        this.eraserWidth = 30;
        this.mode = "normal";
        this.drawingSurfaceData = this.context.getImageData(this.originX, this.originY, this.width, this.height);
        this.mousedown = {};
        this.lastLoc = {};
        this.rubberbandRect = {};
        this.dragging = false;
        return this.guidewires = true;
      };
      drawingFrame.prototype.init = function(){
        this.context.strokeStyle = 'black';
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        return this.context.shadowBlur = 5;
      };
      drawingFrame.prototype.saveDrawingSurface = function(){
        this.drawingSurfaceData = this.context.getImageData(this.originX, this.originY, this.width, this.height);
      };
      drawingFrame.prototype.restoreDrawingSurface = function(){
        this.context.putImageData(this.drawingSurfaceData, this.originX, this.originY);
      };
      drawingFrame.prototype.updateRubberbandRectangle = function(loc){
        this.rubberbandRect.width = Math.abs(loc.x - this.mousedown.x);
        this.rubberbandRect.height = Math.abs(loc.y - this.mousedown.y);
        if (loc.x > this.mousedown.x) {
          this.rubberbandRect.left = this.mousedown.x;
        } else {
          this.rubberbandRect.left = loc.x;
        }
        if (loc.y > this.mousedown.y) {
          this.rubberbandRect.top = this.mousedown.y;
        } else {
          this.rubberbandRect.top = loc.y;
        }
      };
      drawingFrame.prototype.drawRubberbandShape = function(loc){
        this.context.beginPath();
        this.context.moveTo(this.mousedown.x, this.mousedown.y);
        this.context.lineTo(loc.x, loc.y);
        this.context.stroke();
      };
      drawingFrame.prototype.updateRubberband = function(loc){
        this.updateRubberbandRectangle(loc);
        this.context.strokeStyle = 'black';
        this.drawRubberbandShape(loc);
      };
      drawingFrame.prototype.drawHorizonalLine = function(y){
        this.context.beginPath();
        this.context.moveTo(this.originX, y + 0.5);
        this.context.lineTo(this.width + this.originX, y + 0.5);
        this.context.stroke();
      };
      drawingFrame.prototype.drawVerticalLine = function(x){
        this.context.beginPath();
        this.context.moveTo(x + 0.5, this.originY);
        this.context.lineTo(x + 0.5, this.height + this.originY);
        this.context.stroke();
      };
      drawingFrame.prototype.drawGuideWires = function(x, y){
        this.context.save();
        this.context.strokeStyle = 'rgba(0, 0, 230, 0.4)';
        this.context.lineWidth = 0.5;
        this.drawVerticalLine(x);
        this.drawHorizonalLine(y);
        this.context.restore();
      };
      drawingFrame.prototype.colorTest = function(){
        var that, context;
        that = this;
        context = this.context;
        this.init();
        context.font = '24px Helvetica';
        context.fillText('Click anywhere to erase', 175, 200);
        context.strokeStyle = 'goldenrod';
        context.fillStyle = 'rgba(0, 0, 255, 0.5)';
        context.strokeRect(75, 100, 200, 200);
        context.fillRect(325, 100, 200, 200);
        context.canvas.onmousedown = function(e){
          that.init();
          return context.canvas.onmousedown = null;
        };
      };
      drawingFrame.prototype.testLinearGardient = function(){
        var gradient;
        gradient = this.context.createLinearGradient(this.originX, this.originY, this.width, this.originY);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(0.25, 'white');
        gradient.addColorStop(0.5, 'red');
        gradient.addColorStop(0.75, 'green');
        gradient.addColorStop(1, 'purple');
        this.context.fillStyle = gradient;
        this.context.rect(this.originX, this.originY, this.width, this.height);
        this.context.fill();
      };
      drawingFrame.prototype.testRidialGradient = function(){
        var gradient;
        gradient = this.context.createRadialGradient(this.width / 2, this.height, 10, this.width / 2, 0, 100);
        gradient.addColorStop(0, 'blue');
        gradient.addColorStop(0.25, 'white');
        gradient.addColorStop(0.5, 'red');
        gradient.addColorStop(0.75, 'green');
        gradient.addColorStop(1, 'purple');
        this.context.fillStyle = gradient;
        this.context.rect(this.originX, this.originY, this.width, this.height);
        this.context.fill();
      };
      drawingFrame.prototype.addButton = function(text, isOn, callback){
        var x, newButton, buttonFunc;
        x = (this.BUTTON_WIDTH + this.BUTTON_MARGIN) * this.numOfButtons;
        this.context.shadowOffsetX = this.context.shadowOffsetY = 0;
        this.context.shadowBlur = 0;
        this.context.font = '10px Helvetica';
        this.context.fillText(text, x + 20, 20);
        ++this.numOfButtons;
        newButton = {
          name: text,
          isOn: isOn,
          originX: x + 10,
          originY: 10,
          callback: callback
        };
        this.buttons.push(newButton);
        buttonFunc = function(button, frame){
          return function(e, loc){
            var i$, ref$, len$, btn;
            button.isOn = true;
            for (i$ = 0, len$ = (ref$ = frame.buttons).length; i$ < len$; ++i$) {
              btn = ref$[i$];
              if (btn !== button) {
                btn.isOn = false;
              }
            }
            frame.updateButtons();
            button.callback();
          };
        };
        newButton.func = buttonFunc;
        this.listener.addEvent(x + 10, 10, this.BUTTON_WIDTH, this.BUTTON_HEIGHT, 'click', buttonFunc(newButton, this));
      };
      drawingFrame.prototype.updateButtons = function(){
        var i$, ref$, len$, button, results$ = [];
        this.context.clearRect(0, 0, this.width, this.originY);
        for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
          button = ref$[i$];
          this.context.save();
          this.context.shadowColor = this.BUTTON_SHADOW_COLOR;
          this.context.strokeStyle = this.BUTTON_BORDER_STROKE_STYLE;
          this.context.fillStyle = this.BUTTON_BACKGROUND_STYLE;
          if (!button.isOn) {
            this.context.shadowOffsetX = this.context.shadowOffsetY = this.BUTTON_SHADOW_OFFSET;
            this.context.shadowBlur = this.BUTTON_SHADOW_BLUR;
          } else {
            this.context.shadowOffsetX = this.context.shadowOffsetY = this.SELECT_BUTTON_SHADOW_OFFSET;
            this.context.shadowBlur = this.SELECT_BUTTON_SHADOW_BLUR;
          }
          this.context.fillRect(button.originX, button.originY, this.BUTTON_WIDTH, this.BUTTON_HEIGHT);
          this.context.strokeRect(button.originX, button.originY, this.BUTTON_WIDTH, this.BUTTON_HEIGHT);
          this.context.strokeStyle = '#ff0000';
          this.context.font = '15pt Arial';
          this.context.strokeText(button.name, button.originX + 10, button.originY + 15);
          results$.push(this.context.restore());
        }
        return results$;
      };
      drawingFrame.prototype.drawBounding = function(){
        var context;
        context = this.context;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, this.originY);
        context.lineTo(this.originX + this.width, this.originY);
        context.stroke();
      };
      drawingFrame.prototype.drawGrid = function(color, stepx, stepy){
        var context, i$, to$, i;
        context = this.context;
        context.strokeStyle = color;
        context.linewidth = 0.5;
        for (i$ = this.originX + stepx + 0.5, to$ = context.canvas.width - 0.1; stepx < 0 ? i$ >= to$ : i$ <= to$; i$ += stepx) {
          i = i$;
          context.beginPath();
          context.moveTo(i, this.originY);
          context.lineTo(i, context.canvas.height);
          context.stroke();
        }
        for (i$ = this.originY + stepy + 0.5, to$ = context.canvas.height - 0.1; stepy < 0 ? i$ >= to$ : i$ <= to$; i$ += stepy) {
          i = i$;
          context.beginPath();
          context.moveTo(this.originX, i);
          context.lineTo(context.canvas.width, i);
          context.stroke();
        }
        context.strokeStyle = 'black';
      };
      drawingFrame.prototype.drawEraser = function(loc){
        var eraserWidth, context;
        eraserWidth = this.eraserWidth;
        if (loc.x - eraserWidth / 2 < this.originX || loc.y - eraserWidth / 2 < this.originY) {
          return;
        }
        context = this.context;
        context.save();
        context.beginPath();
        context.arc(loc.x, loc.y, eraserWidth / 2, 0, Math.PI * 2, false);
        context.clip();
        context.stroke();
        context.restore();
      };
      drawingFrame.prototype.clearLastArea = function(loc){
        var context;
        if (loc.x - this.eraserWidth / 2 < this.originX || loc.y - this.eraserWidth / 2 < this.originY) {
          return;
        }
        context = this.context;
        context.save();
        context.beginPath();
        context.arc(loc.x, loc.y, this.eraserWidth / 2 + 0.5, 0, Math.PI * 2, false);
        context.clip();
        context.clearRect(this.originX, this.originY, this.width + 0.5, this.height);
        context.restore();
      };
      drawingFrame.prototype.drawPencil = function(loc, width){
        var context;
        if (loc.x - width / 2 < this.originX || loc.y - width / 2 < this.originY) {
          return;
        }
        context = this.context;
        context.fillStyle = 'black';
        context.save();
        context.beginPath();
        context.arc(loc.x, loc.y, width / 2, 0, Math.PI * 2, false);
        context.clip();
        context.fill();
        context.restore();
      };
      drawingFrame.prototype.drawPath = function(loc, width){
        var context;
        context = this.context;
        context.save();
        context.lineTo(loc.x, loc.y);
        context.lineWidth = width;
        context.stroke();
        context.restore();
      };
      iFrame = new drawingFrame();
      iFrame.drawBounding();
      iFrame.addButton("eraser", false, function(){
        iFrame.mode = 'eraser';
        iFrame.saveDrawingSurface();
      });
      iFrame.addButton("line", false, function(){
        iFrame.mode = 'line';
      });
      iFrame.addButton("pencil", false, function(){
        iFrame.mode = 'pencil';
      });
      iFrame.addButton("grid", false, function(){
        iFrame.mode = 'grid';
        iFrame.drawGrid('lightgray', 10, 10);
      });
      iFrame.updateButtons();
      iFrame.listener.addEvent(iFrame.originX, iFrame.originY, iFrame.width, iFrame.height, 'mousedown', function(e, loc){
        if (iFrame.mode === 'line') {
          iFrame.saveDrawingSurface();
        }
        iFrame.mousedown.x = loc.x;
        iFrame.mousedown.y = loc.y;
        iFrame.lastLoc = loc;
        iFrame.dragging = true;
        if (iFrame.mode === 'pencil') {
          iFrame.context.beginPath();
        }
      });
      iFrame.listener.addEvent(iFrame.originX, iFrame.originY, iFrame.width, iFrame.height, 'mousemove', function(e, loc){
        if (iFrame.dragging && iFrame.mode === 'line') {
          iFrame.restoreDrawingSurface();
          iFrame.updateRubberband(loc);
          if (iFrame.guidewires) {
            iFrame.drawGuideWires(loc.x, loc.y);
          }
        }
        if (iFrame.mode === 'eraser') {
          iFrame.restoreDrawingSurface();
          if (iFrame.dragging) {
            iFrame.clearLastArea(iFrame.lastLoc);
            iFrame.saveDrawingSurface();
          }
          iFrame.drawEraser(loc);
          iFrame.lastLoc = loc;
        }
        if (iFrame.mode === 'pencil') {
          if (iFrame.dragging) {
            iFrame.drawPath(loc, 1);
            iFrame.saveDrawingSurface();
          }
        }
      });
      return iFrame.listener.addEvent(iFrame.originX, iFrame.originY, iFrame.width, iFrame.height, 'mouseup', function(e, loc){
        if (!iFrame.dragging) {
          return;
        }
        if (iFrame.mode === 'line') {
          iFrame.restoreDrawingSurface();
          iFrame.updateRubberband(loc);
        }
        if (iFrame.mode === 'eraser') {
          iFrame.restoreDrawingSurface();
          iFrame.clearLastArea(iFrame.lastLoc);
          iFrame.saveDrawingSurface();
          iFrame.drawEraser(loc);
        }
        iFrame.dragging = false;
      });
    }
  });
}).call(this);
