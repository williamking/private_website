// Generated by LiveScript 1.3.1
(function(){
  $(function(){
    var that, canvas, windowToCanvas, canvasListener, drawingFrame, Point, iFrame;
    if (that = window.location.pathname === '/lab/drawing') {
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
        eventFunc = function(obj, canvas, iFrame, callback){
          return function(event){
            var loc;
            loc = windowToCanvas(canvas[0], event.clientX, event.clientY);
            if (loc.x >= obj.x && loc.x < obj.x + obj.width && loc.y >= obj.y && loc.y < obj.y + obj.height) {
              return callback(event, loc);
            }
          };
        };
        newEvent.callback = eventFunc(newEvent, this.canvas, this, callback);
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
        this.originY = 50;
        this.height = canvas[0].height - this.originY;
        this.width = canvas[0].width - this.originX;
        this.buttons = [];
        this.numOfButtons = 0;
        this.BUTTON_MARGIN = 8;
        this.BUTTON_SHADOW_COLOR = 'rgba(0, 0, 0, 0.7)';
        this.BUTTON_SHADOW_OFFSET = 1;
        this.BUTTON_SHADOW_BLUR = 2;
        this.BUTTON_HEIGHT = 30;
        this.BUTTON_WIDTH = 30;
        this.SELECT_BUTTON_SHADOW_OFFSET = 4;
        this.SELECT_BUTTON_SHADOW_BLUR = 5;
        this.BUTTON_BACKGROUND_STYLE = '#eeeeee';
        this.BUTTON_BORDER_STROKE_STYLE = 'rgb(100, 140, 230)';
        this.BUTTON_STROKE_STYLE = 'rgb(100, 140, 230, 0.5)';
        this.polygonList = [];
        this.Polygon = function(centerX, centerY, radius, sides, startAngle, strokeStyle, fillStyle, filled, dashed){
          this.Point = function(x, y){
            this.x = x;
            this.y = y;
          };
          this.x = centerX;
          this.y = centerY;
          this.radius = radius;
          this.sides = sides;
          this.startAngle = startAngle;
          this.strokeStyle = strokeStyle;
          this.fillStyle = fillStyle;
          this.filled = filled;
          this.dashed = dashed;
        };
        this.Polygon.prototype = {
          getPoints: function(){
            var points, angle, i$, to$, i;
            points = [];
            angle = this.startAngle || 0;
            for (i$ = 0, to$ = this.sides; i$ <= to$; ++i$) {
              i = i$;
              points.push(new this.Point(this.x + this.radius * Math.sin(angle), this.y - this.radius * Math.cos(angle)));
              angle += 2 * Math.PI / this.sides;
            }
            return points;
          },
          createPath: function(context){
            var points, i$, to$, i;
            points = this.getPoints();
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineWidth = 1;
            if (this.dashed) {
              context.setLineDash([2, 2]);
            }
            for (i$ = 1, to$ = this.sides; i$ <= to$; ++i$) {
              i = i$;
              context.lineTo(points[i].x, points[i].y);
            }
          },
          stroke: function(context){
            context.save();
            this.createPath(context);
            context.strokeStyle = this.strokeStyle;
            context.stroke();
            context.restore();
          },
          fill: function(context){
            context.save();
            this.createPath(context);
            context.fillStyle = this.fillStyle;
            context.fill();
            context.restore();
          },
          move: function(x, y){
            this.x = x;
            this.y = y;
          }
        };
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
        this.context.shadowBlur = 5;
        return this.initButtons();
      };
      drawingFrame.prototype.initButtons = function(){
        this.addButton("eraser", false, function(frame){
          var width, originX, originY;
          frame.context.save();
          width = frame.BUTTON_WIDTH;
          originX = this.originX + width / 2;
          originY = this.originY + width / 2;
          frame.context.beginPath();
          frame.context.arc(originX, originY, (width - 10) / 2, 0, Math.PI * 2, false);
          frame.context.fillStyle = 'white';
          frame.context.fill();
          frame.context.restore();
        }, function(frame){
          frame.mode = 'eraser';
          frame.saveDrawingSurface();
        });
        this.addButton("line", false, function(frame){
          frame.context.beginPath();
          frame.context.moveTo(this.originX + 5, this.originY + 5);
          frame.context.lineTo(this.originX + frame.BUTTON_WIDTH - 5, this.originY + frame.BUTTON_WIDTH - 5);
          frame.context.stroke();
        }, function(frame){
          frame.mode = 'line';
        });
        this.addButton("pencil", false, function(frame){
          var width;
          width = frame.BUTTON_WIDTH;
          frame.context.beginPath();
          frame.context.moveTo(this.originX + 5, this.originY + 5);
          frame.context.quadraticCurveTo(this.originX + 10, this.originY + 40, this.originX + width - 10, this.originY + 10);
          frame.context.quadraticCurveTo(this.originX + width - 10, this.originY + 10, this.originX + width - 5, this.originY + width - 5);
          frame.context.stroke();
        }, function(frame){
          frame.mode = 'pencil';
        });
        this.addButton("grid", false, function(frame){
          var width;
          width = frame.BUTTON_WIDTH;
          frame.context.beginPath();
          frame.context.moveTo(this.originX + 5, this.originY + 10);
          frame.context.lineTo(this.originX + width - 5, this.originY + 10);
          frame.context.moveTo(this.originX + 5, this.originY + width - 10);
          frame.context.lineTo(this.originX + width - 5, this.originY + width - 10);
          frame.context.moveTo(this.originX + 10, this.originY + 5);
          frame.context.lineTo(this.originX + 10, this.originY + width - 5);
          frame.context.moveTo(this.originX + width - 10, this.originY + 5);
          frame.context.lineTo(this.originX + width - 10, this.originY + width - 5);
          frame.context.stroke();
        }, function(frame){
          frame.mode = 'grid';
          frame.drawGrid('lightgray', 10, 10);
        });
        this.addButton("dashedline", false, function(frame){
          frame.context.setLineDash([2, 2]);
          frame.context.beginPath();
          frame.context.moveTo(this.originX + 5, this.originY + 5);
          frame.context.lineTo(this.originX + frame.BUTTON_WIDTH - 5, this.originY + frame.BUTTON_WIDTH - 5);
          frame.context.stroke();
        }, function(frame){
          frame.mode = 'dashedline';
        });
        this.addButton("circle", false, function(frame){
          var width, centerX, centerY;
          frame.context.beginPath();
          width = frame.BUTTON_WIDTH;
          centerX = this.originX + width / 2;
          centerY = this.originY + width / 2;
          frame.context.arc(centerX, centerY, (width - 10) / 2, 0, Math.PI * 2, false);
          frame.context.stroke();
        }, function(frame){
          frame.mode = 'circle';
        });
        this.addButton("rectangle", false, function(frame){
          var width;
          frame.context.beginPath();
          width = frame.BUTTON_WIDTH - 6;
          frame.context.rect(this.originX + 3, this.originY + 3, width, width);
          frame.context.stroke();
        }, function(frame){
          frame.mode = 'rectangle';
        });
        this.addButton("polygon", false, function(frame){
          var width, centerX, centerY, polygon;
          width = frame.BUTTON_WIDTH;
          centerX = this.originX + width / 2;
          centerY = this.originY + width / 2;
          if (!frame.polygonList[0]) {
            polygon = new frame.Polygon(centerX, centerY, (width - 8) / 2, 5, 0, 'black', 'yellow', true, false);
            $('#polygon-stroke-style').val('black');
            $('#polygon-fill-style').val('yellow');
            $('#polygon-sides').val(5);
            $('#polygon-filled').attr("checked", true);
            $('#polygon-dashed').attr("checked", false);
            $('#polygon-fill-style').val('yellow');
          } else {
            polygon = frame.polygonList[0];
          }
          polygon.stroke(frame.context);
          if (polygon.filled) {
            polygon.fill(frame.context);
          }
          if (!frame.polygonList[0]) {
            frame.polygonList.push(polygon);
          }
        }, function(frame){
          frame.mode = 'polygon';
          $('#polygon-controller').removeClass('invisible');
        });
        this.addButton('bezier', false, function(frame){
          var width;
          width = frame.BUTTON_WIDTH;
          frame.context.beginPath();
          frame.context.moveTo(this.originX + 5, this.originY + 5);
          frame.context.bezierCurveTo(this.originX + width - 5, this.originY + 5, this.originX + 5, this.originY + width - 5, this.originX + width - 5, this.originY + width - 5);
          frame.context.stroke();
        }, function(frame){
          frame.mode = 'bezier';
        });
        return this.updateButtons();
      };
      drawingFrame.prototype.initEvents = function(){
        var changeButton;
        changeButton = function(frame){
          var polygon;
          polygon = frame.polygonList[0];
          return function(e){
            var attr;
            attr = e.currentTarget.name;
            polygon[attr] = $(e.currentTarget).val();
            if (attr === 'sides') {
              polygon[attr] = parseInt(polygon[attr]);
            }
            if (attr === 'dashed' || attr === 'filled') {
              polygon[attr] = e.currentTarget.checked;
            }
            frame.updateButtons();
          };
        }(this);
        $('#polygon-controller').find('input').change(changeButton);
        this.listener.addEvent(this.originX, this.originY, this.width, this.height, 'mousedown', function(e, loc){
          iFrame.mousedown.x = loc.x;
          iFrame.mousedown.y = loc.y;
          iFrame.lastLoc = loc;
          iFrame.dragging = true;
          if (iFrame.mode === 'line' || iFrame.mode === 'dashedline' || iFrame.mode === 'bezier') {
            iFrame.saveDrawingSurface();
          }
          if (iFrame.mode === 'circle' || iFrame.mode === 'rectangle' || iFrame.mode === 'polygon') {
            iFrame.saveDrawingSurface();
          }
          if (iFrame.mode === 'pencil') {
            iFrame.context.beginPath();
          }
        });
        iFrame.listener.addEvent(iFrame.originX, iFrame.originY, iFrame.width, iFrame.height, 'mousemove', function(e, loc){
          if (iFrame.dragging && (iFrame.mode === 'rectangle' || iFrame.mode === 'circle' || iFrame.mode === 'line' || iFrame.mode === 'dashedline' || iFrame.mode === 'polygon' || iFrame.mode === 'bezier')) {
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
        iFrame.listener.addEvent(iFrame.originX, iFrame.originY, iFrame.width, iFrame.height, 'mouseup', function(e, loc){
          if (!iFrame.dragging) {
            return;
          }
          if (iFrame.mode === 'line' || iFrame.mode === 'dashedline' || iFrame.mode === 'circle' || iFrame.mode === 'rectangle' || iFrame.mode === 'polygon' || iFrame.mode === 'bezier') {
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
        var xDist, yDist, radius, originX, originY, r, sides, strokeStyle, fillStyle, filled, dashed, polygon, startPoint, endPoint;
        this.context.save();
        this.context.beginPath();
        if (this.mode === 'dashedline') {
          this.context.setLineDash([2, 2]);
        }
        if (this.mode === 'line' || this.mode === 'dashedline') {
          this.context.moveTo(this.mousedown.x, this.mousedown.y);
          this.context.lineTo(loc.x, loc.y);
          this.context.stroke();
        }
        if (this.mode === 'circle') {
          xDist = Math.abs(loc.x - this.mousedown.x);
          yDist = Math.abs(loc.y - this.mousedown.y);
          radius = Math.sqrt(xDist * xDist + yDist * yDist);
          if (Math.abs(this.mousedown.x - this.originX < radius)) {
            radius = Math.abs(this.mousedown.x - this.originX);
          }
          if (Math.abs(this.mousedown.y - this.originY < radius)) {
            radius = Math.abs(this.mousedown.y - this.originY);
          }
          this.context.arc(this.mousedown.x, this.mousedown.y, radius, 0, Math.PI * 2, false);
          this.context.stroke();
        }
        if (this.mode === 'rectangle') {
          xDist = Math.abs(loc.x - this.mousedown.x);
          yDist = Math.abs(loc.y - this.mousedown.y);
          originX = this.mousedown.x;
          originY = this.mousedown.y;
          if (loc.x < originX) {
            originX = loc.x;
          }
          if (loc.y < originY) {
            originY = loc.y;
          }
          this.context.rect(originX, originY, xDist, yDist);
          this.context.stroke();
        }
        if (this.mode === 'polygon') {
          xDist = Math.abs(loc.x - this.mousedown.x);
          yDist = Math.abs(loc.y - this.mousedown.y);
          r = Math.sqrt(xDist * xDist + yDist + yDist);
          if (Math.abs(this.mousedown.x - this.originX < r)) {
            r = Math.abs(this.mousedown.x - this.originX);
          }
          if (Math.abs(this.mousedown.y - this.originY < r)) {
            r = Math.abs(this.mousedown.y - this.originY);
          }
          sides = parseInt($('#polygon-sides').val());
          strokeStyle = $('#polygon-stroke-style').val();
          fillStyle = $('#polygon-fill-style').val();
          filled = $('#polygon-filled')[0].checked;
          dashed = $('#polygon-dashed')[0].checked;
          polygon = new this.Polygon(this.mousedown.x, this.mousedown.y, r, sides, 0, strokeStyle, fillStyle, filled, dashed);
          polygon.stroke(this.context);
          if (polygon.filled) {
            polygon.fill(this.context);
          }
        }
        if (this.mode === 'bezier') {
          startPoint = {};
          endPoint = {};
          startPoint.x = this.rubberbandRect.left;
          startPoint.y = this.rubberbandRect.top;
          endPoint.x = startPoint.x + this.rubberbandRect.width;
          endPoint.y = startPoint.y + this.rubberbandRect.height;
          this.context.beginPath();
          this.context.arc(startPoint.x, endPoint.y, 4, 0, 2 * Math.PI, false);
          this.context.stroke();
          this.context.beginPath();
          this.context.arc(endPoint.x, startPoint.y, 4, 0, 2 * Math.PI, false);
          this.context.stroke();
          this.context.beginPath();
          this.context.moveTo(startPoint.x, startPoint.y);
          this.context.bezierCurveTo(startPoint.x, endPoint.y, endPoint.x, startPoint.y, endPoint.x, endPoint.y);
          this.context.stroke();
          this.context.closePath();
        }
        this.context.restore();
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
        this.context.strokeStyle = 'rgba(255, 0, 0, 1)';
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
      drawingFrame.prototype.addButton = function(text, isOn, banner, callback){
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
          banner: banner,
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
            $('#polygon-controller').addClass('invisible');
            button.callback(frame);
          };
        };
        newButton.func = buttonFunc(newButton, this);
        this.listener.addEvent(x + 10, 10, this.BUTTON_WIDTH, this.BUTTON_HEIGHT, 'click', newButton.func, this);
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
          this.context.strokeStyle = 'black';
          button.banner(this);
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
        if (loc.x - this.eraserWidth / 2 <= this.originX || loc.y - this.eraserWidth / 2 <= this.originY) {
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
      Point = function(x, y){
        this.x = x;
        this.y = y;
      };
      iFrame = new drawingFrame();
      iFrame.drawBounding();
      iFrame.initButtons();
      return iFrame.initEvents();
    }
  });
}).call(this);
