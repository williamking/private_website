#    > Author: William
#    > Email: williamjwking@gmail.com

$ ->
    # alert window.location.pathname
    if window.location.pathname is '/lab/drawing'
        # Get the canvas object
        canvas = $('#canvas')
        canvas[0].height = 600
        canvas[0].width = 800

        Text-cursor = (width, fill-style)!->
            this.fill-style = fill-style || 'rgba(0, 0, 0, 0.5)'
            this.width = width || 2
            this.left = 0
            this.top = 0

        Text-cursor.prototype =
            get-height: (context)->
                h = context.measure-text 'W' .width
                return h + h / 6
            ,
            create-path: (context)!->
                context.begin-path!
                context.rect this.left, this.top, this.width, this.getHeight(context)
            ,
            draw: (context, left, bottom)!->
                context.save!
                this.left = left
                this.top = bottom - this.get-height context
                this.create-path context
                context.fill!
                context.restore!
            ,
            erase: (context, image-data)!->
                context.put-image-data image-data, 0, 0, this.left, this.top, this.width, this.get-height context

        # Transfer the position in window to that in canvas
        window-to-canvas = (canvas, x, y)->

            bbox = canvas.get-bounding-client-rect!
            return {
                x: (x - bbox.left) * (canvas.width  / bbox.width)
                y: (y - bbox.top)  * (canvas.height / bbox.height)
            }

        # Canvas event listener, the parameter is jquery object
        canvas-listener = (canvas)!->

            this.canvas = canvas
            this.events = []

        # Add new event to listener
        canvas-listener.prototype.add-event = (x, y, width, height, type, callback)!->

            new-event =
                x       : x,
                y       : y,
                width   : width,
                height  : height,
                type    : type,

            event-func = (obj, canvas, i-frame, callback)!->
                return (event)->
                    loc = window-to-canvas canvas[0], event.client-x, event.client-y
                    if loc.x >= obj.x and loc.x < obj.x + obj.width
                    and loc.y >= obj.y and loc.y < obj.y + obj.height
                    then callback event, loc

            new-event.callback = event-func new-event, this.canvas, this, callback

            this.events.push new-event

            switch type
                case 'click'
                    this.canvas.click new-event.callback
                case 'mousemove'
                    this.canvas.mousemove new-event.callback
                case 'mousedown'
                    this.canvas.mousedown new-event.callback
                case 'mouseup'
                    this.canvas.mouseup new-event.callback

        # Create the drawing frame object
        drawingFrame = ->
            this.canvas = canvas[0]
            this.context = canvas[0].getContext('2d')
            this.listener = new canvas-listener canvas
            # Set the real drawing area
            this.originX = 0
            this.originY = 50
            this.height = canvas[0].height - this.origin-y
            this.width =  canvas[0].width - this.origin-X
            # Set button attributes
            this.buttons = []
            this.numOfButtons = 0
            this.BUTTON_MARGIN = 8
            this.BUTTON_SHADOW_COLOR = 'rgba(0, 0, 0, 0.7)'
            this.BUTTON_SHADOW_OFFSET = 1
            this.BUTTON_SHADOW_BLUR = 2
            this.BUTTON_HEIGHT = 30
            this.BUTTON_WIDTH = 30
            this.SELECT_BUTTON_SHADOW_OFFSET = 4
            this.SELECT_BUTTON_SHADOW_BLUR = 5
            this.BUTTON_BACKGROUND_STYLE = '#eeeeee'
            this.BUTTON_BORDER_STROKE_STYLE = 'rgb(100, 140, 230)'
            this.BUTTON_STROKE_STYLE = 'rgb(100, 140, 230, 0.5)'
            # Text cursor
            this.text-cursor = new Text-cursor!
            this.blinking-interval = false
            # Polygon
            this.polygon-list = []
            this.Polygon = (center-x, center-y, radius, sides, start-angle, stroke-style, fill-style, filled, dashed)!->
                this.Point = (x, y)!->
                    this.x = x
                    this.y = y
                this.x = center-x
                this.y = center-y
                this.radius = radius
                this.sides = sides
                this.start-angle = start-angle
                this.stroke-style = stroke-style
                this.fill-style = fill-style
                this.filled = filled
                this.dashed = dashed
            this.Polygon.prototype =
                get-points: ->
                    points = []
                    angle = this.start-angle || 0
                    for i from 0 to this.sides by 1
                        points.push new this.Point this.x + this.radius * Math.sin(angle), this.y - this.radius * Math.cos(angle)
                        angle += 2 * Math.PI / this.sides
                    points
                ,
                create-path: (context)!->
                    points = this.get-points!
                    context.begin-path!
                    context.move-to points[0].x, points[0].y
                    context.line-width = 1
                    if this.dashed then context.set-line-dash [2, 2]
                    for i from 1 to this.sides by 1
                        context.line-to points[i].x, points[i].y
                    # context.close-path!
                ,
                stroke: (context)!->
                    context.save!
                    this.create-path context
                    context.stroke-style = this.stroke-style
                    context.stroke!
                    context.restore!
                ,
                fill: (context)!->
                    context.save!
                    this.create-path context
                    context.fill-style = this.fill-style
                    context.fill!
                    context.restore!
                ,
                move: (x, y)!->
                    this.x = x
                    this.y = y

            # Set eraser attributes
            this.eraser-width = 30
            # Set the mode
            this.mode = "normal"
            # Save the drawing data
            this.drawing-surface-data = this.context.get-image-data this.originX, this.originY, this.width, this.height
            # Mouse position
            this.mousedown = {}
            this.last-loc = {}
            #
            this.rubberbandRect = {}
            #
            this.dragging = false
            #
            this.guidewires = true

        # Init the frame
        drawingFrame.prototype.init = ->

            this.context.strokeStyle = 'black'
            this.context.shadow-offset-x = 0
            this.context.shadow-offset-y = 0
            this.context.shadow-blur = 5

            this.init-buttons!

        # Init the buttons
        drawing-frame.prototype.init-buttons = ->
            this.addButton "eraser", false, (frame)!->
                frame.context.save!
                width = frame.BUTTON_WIDTH
                originX = this.originX + width / 2
                originY = this.originY + width / 2
                frame.context.begin-path!
                frame.context.arc originX, originY, (width - 10) / 2, 0, Math.PI * 2, false
                frame.context.fill-style = 'white'
                frame.context.fill!
                frame.context.restore!
            , (frame)!->
                frame.mode = 'eraser'
                frame.save-drawing-surface!
            this.addButton "line", false, (frame)!->
                frame.context.begin-path!
                frame.context.move-to this.originX + 5, this.originY + 5
                frame.context.line-to this.originX + frame.BUTTON_WIDTH - 5, this.originY + frame.BUTTON_WIDTH- 5
                frame.context.stroke!
            , (frame)!->
                frame.mode = 'line'
            this.addButton "pencil", false, (frame)!->
                width = frame.BUTTON_WIDTH
                frame.context.begin-path!
                frame.context.move-to this.originX + 5, this.originY + 5
                frame.context.quadratic-curve-to this.originX + 10, this.originY + 40, this.originX + width - 10, this.originY + 10
                frame.context.quadratic-curve-to this.originX + width - 10, this.originY + 10, this.originX + width - 5, this.originY + width - 5
                frame.context.stroke!
            , (frame)!->
                frame.mode = 'pencil'
            this.addButton "grid", false, (frame)!->
                width = frame.BUTTON_WIDTH
                frame.context.begin-path!
                frame.context.move-to this.originX + 5, this.originY + 10
                frame.context.line-to this.originX + width - 5, this.originY + 10
                frame.context.move-to this.originX + 5, this.originY + width - 10
                frame.context.line-to this.originX + width - 5, this.originY + width - 10
                frame.context.move-to this.originX + 10, this.originY + 5
                frame.context.line-to this.originX + 10, this.originY + width - 5
                frame.context.move-to this.originX + width - 10, this.originY + 5
                frame.context.line-to this.originX + width - 10, this.originY + width - 5
                frame.context.stroke!
            , (frame)!->
                frame.mode = 'grid'
                frame.draw-grid 'lightgray', 10, 10
            this.addButton "dashedline", false, (frame)!->
                frame.context.set-line-dash [2, 2]
                frame.context.begin-path!
                frame.context.move-to this.originX + 5, this.originY + 5
                frame.context.line-to this.originX + frame.BUTTON_WIDTH - 5, this.originY + frame.BUTTON_WIDTH- 5
                frame.context.stroke!
            , (frame)!->
                frame.mode = 'dashedline'
            this.add-button "circle", false, (frame)!->
                frame.context.begin-path!
                width = frame.BUTTON_WIDTH
                center-x = this.originX + width / 2
                center-y = this.originY + width /2
                frame.context.arc center-x, center-y, (width - 10) / 2, 0, Math.PI * 2, false
                frame.context.stroke!
            , (frame)!->
                frame.mode = 'circle'
            this.add-button "rectangle", false, (frame)!->
                frame.context.begin-path!
                width = frame.BUTTON_WIDTH - 6
                frame.context.rect this.originX + 3, this.originY + 3, width, width
                frame.context.stroke!
            , (frame)!->
                frame.mode = 'rectangle'
            this.add-button "polygon", false, (frame)!->
                width = frame.BUTTON_WIDTH
                center-x = this.originX + width / 2
                center-y = this.originY + width / 2
                if not frame.polygon-list[0]
                    polygon = new frame.Polygon center-x, center-y, (width - 8) / 2, 5, 0, 'black', 'yellow', true, false
                    $ '#polygon-stroke-style' .val 'black'
                    $ '#polygon-fill-style' .val 'yellow'
                    $ '#polygon-sides' .val 5
                    $ '#polygon-filled' .attr "checked", true
                    $ '#polygon-dashed' .attr "checked", false
                    $ '#polygon-fill-style' .val 'yellow'

                else
                    polygon = frame.polygon-list[0]
                polygon.stroke frame.context
                if polygon.filled
                    polygon.fill frame.context
                if not frame.polygon-list[0]
                    frame.polygon-list.push polygon
            , (frame)!->
                frame.mode = 'polygon'
                $ '#polygon-controller' .remove-class 'invisible'
            this.add-button 'bezier', false, (frame)!->
                width = frame.BUTTON_WIDTH
                frame.context.begin-path!
                frame.context.move-to this.originX + 5, this.originY + 5
                frame.context.bezier-curve-to this.originX + width - 5, this.originY + 5,
                                        this.originX + 5, this.originY + width-5,
                                        this.originX + width-5, this.originY + width-5
                frame.context.stroke!
            , (frame)!->
                frame.mode = 'bezier'
            this.add-button 'text', false, (frame)!->
                width = frame.BUTTON_WIDTH
                context = frame.context
                context.save!
                context.begin-path!
                context.font = 'italic 20px monaco'
                context.text-align = 'start'
                context.fill-style = 'cornflowerblue'
                context.fillText 'T', this.originX + width/2 - 6, this.originY + width/2 + 6
                context.restore!
            , (frame)!->
                frame.mode = 'text'

            this.update-buttons!

        # Init the event listener
        drawing-frame.prototype.init-events = !->

            changeButton = ((frame)->
                polygon = frame.polygon-list[0]
                return (e)!->
                    attr = e.current-target.name
                    polygon[attr] = $(e.current-target).val!
                    if (attr is 'sides') then polygon[attr] = parse-int polygon[attr]
                    if (attr is 'dashed' or attr is 'filled') then polygon[attr] = e.current-target.checked
                    frame.update-buttons!
            )(this)

            $ '#polygon-controller' .find 'input' .change changeButton

            this.listener.add-event this.originX, this.origin-y, this.width,
            this.height, 'mousedown', (e, loc)!->

                i-frame.mousedown.x = loc.x
                i-frame.mousedown.y = loc.y
                i-frame.last-loc = loc
                i-frame.dragging = true

                if i-frame.mode is 'line' or i-frame.mode is 'dashedline' or i-frame.mode is 'bezier' then
                    i-frame.save-drawing-surface!
                if i-frame.mode is 'circle' or i-frame.mode is 'rectangle' or i-frame.mode is 'polygon'
                    i-frame.save-drawing-surface!
                if i-frame.mode is 'pencil' then
                    i-frame.context.begin-path!
                if i-frame.mode is 'text' then
                    i-frame.move-cursor loc

            iFrame.listener.add-event i-frame.originX, i-frame.origin-y, i-frame.width,
            iFrame.height, 'mousemove', (e, loc)!->

                if i-frame.dragging and (i-frame.mode is 'rectangle' or i-frame.mode is 'circle' or i-frame.mode == 'line' or i-frame.mode == 'dashedline' or i-frame.mode is 'polygon' or i-frame.mode is 'bezier') then
                    i-frame.restore-drawing-surface!
                    i-frame.update-rubberband loc
                    if i-frame.guidewires then
                        i-frame.draw-guide-wires loc.x, loc.y

                if i-frame.mode == 'eraser' then
                    i-frame.restore-drawing-surface!
                    if i-frame.dragging
                        i-frame.clear-last-area i-frame.last-loc
                        i-frame.save-drawing-surface!
                    i-frame.draw-eraser loc
                    i-frame.last-loc = loc

                if i-frame.mode == 'pencil' then
                    if i-frame.dragging
                        i-frame.draw-path loc, 1
                        i-frame.save-drawing-surface!

            iFrame.listener.add-event i-frame.originX, i-frame.origin-y, i-frame.width,
            iFrame.height, 'mouseup', (e, loc)!->

                if not i-frame.dragging then return
                if i-frame.mode is 'line' or i-frame.mode is 'dashedline' or i-frame.mode is 'circle'
                or i-frame.mode is 'rectangle' or i-frame.mode is 'polygon' or i-frame.mode is 'bezier' then
                    i-frame.restore-drawing-surface!
                    i-frame.update-rubberband loc

                if i-frame.mode is 'eraser' then
                    i-frame.restore-drawing-surface!
                    i-frame.clear-last-area i-frame.last-loc
                    i-frame.save-drawing-surface!
                    i-frame.draw-eraser loc


                i-frame.dragging = false

        # Process of the text
        drawing-frame.prototype.move-cursor = (loc)!->
            this.text-cursor.erase this.context, this.drawing-surface-data
            this.text-cursor.draw this.context, loc.x, loc.y
            if not this.blinking-interval
                this.blink-cursor loc

        drawing-frame.prototype.blink-cursor = (loc)!->
            that = this
            context = this.context
            func = (context, cursor, drawing-surface-data)->
               (e)!->
                    cursor.erase context, drawing-surface-data
                    func2 = (context, cursor)->
                        (e)!->
                            cursor.draw context, cursor.left, cursor.top + cursor.get-height context
                    set-timeout func2(context, cursor), 500
            this.blinking-interval = set-interval func(this.context, this.text-cursor, this.drawing-surface-data), 500

        # Store the drawing surface
        drawing-frame.prototype.save-drawing-surface = !->
            this.drawing-surface-data = this.context.get-image-data this.originX, this.originY, this.width, this.height

        # Restore the drawing surface
        drawing-frame.prototype.restore-drawing-surface = !->
            this.context.put-image-data this.drawing-surface-data, this.originX, this.originY

        # Rubber bands
        drawing-frame.prototype.update-rubberband-rectangle = (loc)!->
            this.rubberband-rect.width = Math.abs(loc.x - this.mousedown.x)
            this.rubberband-rect.height = Math.abs(loc.y - this.mousedown.y)

            if loc.x > this.mousedown.x then
                this.rubberband-rect.left = this.mousedown.x
            else
                this.rubberband-rect.left = loc.x

            if loc.y > this.mousedown.y then
                this.rubberband-rect.top = this.mousedown.y
            else
                this.rubberband-rect.top = loc.y

        drawing-frame.prototype.draw-rubberband-shape = (loc)!->
            this.context.save!
            this.context.begin-path!
            if (this.mode is 'dashedline')
                this.context.set-line-dash [2, 2]
            if (this.mode is 'line' or this.mode is 'dashedline')
                this.context.move-to this.mousedown.x, this.mousedown.y
                this.context.line-to loc.x, loc.y
                this.context.stroke!
            if (this.mode is 'circle')
                x-dist = Math.abs loc.x - this.mousedown.x
                y-dist = Math.abs loc.y - this.mousedown.y
                radius = Math.sqrt x-dist * x-dist + y-dist * y-dist
                if Math.abs this.mousedown.x - this.originX < radius
                    radius = Math.abs this.mousedown.x - this.originX
                if Math.abs this.mousedown.y - this.originY < radius
                    radius = Math.abs this.mousedown.y - this.originY
                this.context.arc this.mousedown.x, this.mousedown.y, radius, 0, Math.PI * 2, false
                this.context.stroke!
            if (this.mode is 'rectangle')
                x-dist = Math.abs loc.x - this.mousedown.x
                y-dist = Math.abs loc.y - this.mousedown.y
                originX = this.mousedown.x
                originY = this.mousedown.y
                if loc.x < originX then originX = loc.x
                if loc.y < originY then originY = loc.y
                this.context.rect originX, originY, x-dist, y-dist
                this.context.stroke!
            if (this.mode is 'polygon')
                x-dist = Math.abs loc.x - this.mousedown.x
                y-dist = Math.abs loc.y - this.mousedown.y
                r = Math.sqrt x-dist * x-dist + y-dist + y-dist
                if Math.abs this.mousedown.x - this.originX < r
                    r = Math.abs this.mousedown.x - this.originX
                if Math.abs this.mousedown.y - this.originY < r
                    r = Math.abs this.mousedown.y - this.originY
                sides = parse-int($ '#polygon-sides' .val!)
                stroke-style = $ '#polygon-stroke-style' .val!
                fill-style = $ '#polygon-fill-style' .val!
                filled = $('#polygon-filled')[0].checked
                dashed = $('#polygon-dashed')[0].checked
                polygon = new this.Polygon this.mousedown.x, this.mousedown.y, r, sides, 0, stroke-style, fill-style, filled, dashed
                polygon.stroke this.context
                if polygon.filled then polygon.fill this.context
            if (this.mode is 'bezier')
                start-point = {}
                end-point = {}
                start-point.x = this.rubberband-rect.left
                start-point.y = this.rubberband-rect.top
                end-point.x = start-point.x + this.rubberband-rect.width
                end-point.y = start-point.y + this.rubberband-rect.height
                this.context.begin-path!
                this.context.arc start-point.x, end-point.y, 4, 0, 2 * Math.PI, false
                this.context.stroke!
                this.context.begin-path!
                this.context.arc end-point.x, start-point.y, 4, 0, 2 * Math.PI, false
                this.context.stroke!
                this.context.begin-path!
                this.context.move-to start-point.x, start-point.y
                this.context.bezier-curve-to start-point.x, end-point.y, end-point.x, start-point.y, end-point.x, end-point.y
                this.context.stroke!
                this.context.close-path!
            this.context.restore!

        drawing-frame.prototype.update-rubberband = (loc)!->
            this.update-rubberband-rectangle loc
            this.context.stroke-style = 'black'
            this.draw-rubberband-shape loc

        #Guidewires
        drawing-frame.prototype.draw-horizonal-line  = (y)!->
            this.context.begin-path!
            this.context.move-to this.originX, y + 0.5
            this.context.line-to this.width + this.originX, y + 0.5
            this.context.stroke!

        drawing-frame.prototype.draw-vertical-line  = (x)!->
            this.context.begin-path!
            this.context.move-to x + 0.5, this.origin-y
            this.context.line-to x + 0.5, this.height + this.origin-y
            this.context.stroke!

        drawing-frame.prototype.draw-guide-wires = (x, y)!->
            this.context.save!
            this.context.stroke-style = 'rgba(255, 0, 0, 1)'
            this.context.line-width = 0.5
            this.draw-vertical-line x
            this.draw-horizonal-line y
            this.context.restore!

        # Test the color
        drawingFrame.prototype.colorTest = !->

            that = this
            context = this.context
            this.init!
            context.font = '24px Helvetica'
            context.fillText 'Click anywhere to erase', 175, 200

            context.strokeStyle = 'goldenrod'
            context.fillStyle = 'rgba(0, 0, 255, 0.5)'

            context.strokeRect 75, 100, 200, 200
            context.fillRect 325, 100, 200, 200

            context.canvas.onmousedown = (e)->
                that.init!
                context.canvas.onmousedown = null

        # Test the Gradient
        drawingFrame.prototype.testLinearGardient = !->

            gradient = this.context.createLinearGradient this.originX, this.originY, this.width, this.originY

            gradient.addColorStop 0,    'blue'
            gradient.addColorStop 0.25, 'white'
            gradient.addColorStop 0.5,  'red'
            gradient.addColorStop 0.75, 'green'
            gradient.addColorStop 1,    'purple'

            this.context.fillStyle = gradient
            this.context.rect this.originX, this.originY, this.width, this.height
            this.context.fill!

        drawingFrame.prototype.testRidialGradient = !->

            gradient = this.context.createRadialGradient this.width/ 2 , this.height, 10, this.width / 2, 0, 100

            gradient.addColorStop 0,    'blue'
            gradient.addColorStop 0.25, 'white'
            gradient.addColorStop 0.5,  'red'
            gradient.addColorStop 0.75, 'green'
            gradient.addColorStop 1,    'purple'

            this.context.fillStyle = gradient
            this.context.rect this.originX, this.originY, this.width, this.height
            this.context.fill!

        # Add the buttons

        drawingFrame.prototype.addButton = (text, is-on, banner, callback)!->

            x = (this.BUTTON_WIDTH + this.BUTTON_MARGIN) * this.numOfButtons

            this.context.shadowOffsetX = this.context.shadowOffsetY = 0
            this.context.shadow-blur = 0
            this.context.font = '10px Helvetica'
            this.context.fillText text, x + 20, 20

            ++this.numOfButtons

            new-button =
                name: text
                is-on: is-on
                originX: x + 10
                originY: 10
                banner: banner
                callback: callback

            this.buttons.push new-button

            button-func = (button, frame)->
                return (e, loc)!->
                    button.is-on = true
                    for btn in frame.buttons
                        if btn isnt button then btn.is-on = false
                    frame.update-buttons!
                    $ '#polygon-controller' .add-class 'invisible'
                    button.callback frame

            new-button.func = button-func new-button, this

            this.listener.add-event x + 10, 10, this.BUTTON_WIDTH, this.BUTTON_HEIGHT, 'click', new-button.func, this

        drawingFrame.prototype.update-buttons = ->
            this.context.clearRect 0, 0, this.width, this.originY

            for button in this.buttons
                this.context.save!
                this.context.shadowColor = this.BUTTON_SHADOW_COLOR
                this.context.stroke-style = this.BUTTON_BORDER_STROKE_STYLE
                this.context.fill-style = this.BUTTON_BACKGROUND_STYLE
                if not button.is-on then
                    this.context.shadowOffsetX = this.context.shadowOffsetY = this.BUTTON_SHADOW_OFFSET
                    this.context.shadowBlur = this.BUTTON_SHADOW_BLUR
                else
                    this.context.shadowOffsetX = this.context.shadowOffsetY = this.SELECT_BUTTON_SHADOW_OFFSET
                    this.context.shadowBlur = this.SELECT_BUTTON_SHADOW_BLUR

                this.context.fill-rect button.originX, button.origin-y, this.BUTTON_WIDTH, this.BUTTON_HEIGHT
                this.context.stroke-rect button.originX, button.origin-y, this.BUTTON_WIDTH, this.BUTTON_HEIGHT

                this.context.stroke-style = 'black'

                #this.context.stroke-text button.name, button.originX + 10, button.originY + 15
                button.banner this
                this.context.restore!

        # Draw the bound between buttons and painting area

        drawingFrame.prototype.drawBounding = !->

            context = this.context
            context.line-width = 1
            context.begin-path!
            context.move-to 0, this.originY
            context.line-to this.originX + this.width, this.originY
            context.stroke!

        # Draw the grid

        drawing-frame.prototype.draw-grid = (color, stepx, stepy)!->

            context = this.context
            context.stroke-style = color
            context.linewidth = 0.5

            for i from this.originX + stepx + 0.5 to context.canvas.width - 0.1 by stepx
                context.begin-path!
                context.move-to i, this.originY
                context.line-to i, context.canvas.height
                context.stroke!

            for i from this.originY + stepy + 0.5 to context.canvas.height - 0.1 by stepy
                context.begin-path!
                context.move-to this.originX, i
                context.line-to context.canvas.width, i
                context.stroke!

            context.stroke-style = 'black'

        # Draw the path of earser

        drawing-frame.prototype.draw-eraser = (loc)!->

            eraser-width = this.eraser-width

            if loc.x - eraser-width/2 < this.originX or loc.y - eraser-width/2 < this.originY then
                return

            context = this.context
            context.save!
            context.begin-path!

            context.arc loc.x, loc.y, eraser-width / 2, 0, Math.PI * 2, false
            context.clip!
            context.stroke!
            context.restore!

        drawing-frame.prototype.clear-last-area = (loc)!->

            if loc.x - this.eraser-width/2 <= this.originX or loc.y - this.eraser-width/2 <= this.originY then
                return

            context = this.context
            context.save!
            context.begin-path!
            context.arc loc.x, loc.y, this.eraser-width / 2 + 0.5, 0, Math.PI * 2, false
            context.clip!
            context.clearRect(this.originX, this.originY, this.width + 0.5, this.height)
            context.restore!

        # The pencil part

        drawing-frame.prototype.draw-pencil = (loc, width)!->

            if loc.x - width/2 < this.originX or loc.y - width/2 < this.originY then
                return

            context = this.context
            context.fill-style = 'black'
            context.save!
            context.begin-path!

            context.arc loc.x, loc.y, width / 2, 0, Math.PI * 2, false
            context.clip!
            context.fill!
            context.restore!

        drawing-frame.prototype.draw-path = (loc, width)!->

            context = this.context
            context.save!
            context.line-to loc.x, loc.y
            context.line-width = width
            context.stroke!
            context.restore!

#       Polygon
        Point = (x, y)!->
            this.x = x
            this.y = y


        # Run the frame
        iFrame = new drawingFrame!

        iFrame.draw-bounding!

        i-frame.init-buttons!

        i-frame.init-events!

