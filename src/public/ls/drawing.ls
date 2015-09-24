#    > Author: William
#    > Email: williamjwking@gmail.com

$ ->
    # alert window.location.pathname
    if window.location.pathname is '/lab/drawing'
        # Get the canvas object
        canvas = $('#canvas')
        canvas[0].height = 600
        canvas[0].width = 800

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

            event-func = (obj, canvas, callback)!->
                return (event)->
                    loc = window-to-canvas canvas[0], event.client-x, event.client-y
                    if loc.x >= obj.x and loc.x < obj.x + obj.width
                    and loc.y >= obj.y and loc.y < obj.y + obj.height
                    then callback event, loc

            new-event.callback = event-func new-event, this.canvas, callback

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
            this.originY = 40
            this.height = canvas[0].height - this.origin-y
            this.width =  canvas[0].width - this.origin-X
            # Set button attributes
            this.buttons = []
            this.numOfButtons = 0
            this.BUTTON_MARGIN = 8
            this.BUTTON_SHADOW_COLOR = 'rgba(0, 0, 0, 0.7)'
            this.BUTTON_SHADOW_OFFSET = 1
            this.BUTTON_SHADOW_BLUR = 2
            this.BUTTON_HEIGHT = 20
            this.BUTTON_WIDTH = 80
            this.SELECT_BUTTON_SHADOW_OFFSET = 4
            this.SELECT_BUTTON_SHADOW_BLUR = 5
            this.BUTTON_BACKGROUND_STYLE = '#eeeeee'
            this.BUTTON_BORDER_STROKE_STYLE = 'rgb(100, 140, 230)'
            this.BUTTON_STROKE_STYLE = 'rgb(100, 140, 230, 0.5)'
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
            this.context.begin-path!
            this.context.move-to this.mousedown.x, this.mousedown.y
            this.context.line-to loc.x, loc.y
            this.context.stroke!

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
            this.context.stroke-style = 'rgba(0, 0, 230, 0.4)'
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

        drawingFrame.prototype.addButton = (text, is-on, callback)!->

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
                callback: callback

            this.buttons.push new-button

            button-func = (button, frame)->
                return (e, loc)!->
                    button.is-on = true
                    for btn in frame.buttons
                        if btn isnt button then btn.is-on = false
                    frame.update-buttons!
                    button.callback!

            new-button.func = button-func

            this.listener.add-event x + 10, 10, this.BUTTON_WIDTH, this.BUTTON_HEIGHT, 'click', button-func new-button, this

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

                this.context.stroke-style = '#ff0000'

                this.context.font = '15pt Arial'
                this.context.stroke-text button.name, button.originX + 10, button.originY + 15
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

            if loc.x - this.eraser-width/2 < this.originX or loc.y - this.eraser-width/2 < this.originY then
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

        # Run the frame
        iFrame = new drawingFrame!
        iFrame.draw-bounding!
        iFrame.addButton "eraser", false, !->
            i-frame.mode = 'eraser'
            i-frame.save-drawing-surface!
        iFrame.addButton "line", false, !->
            iFrame.mode = 'line'
        iFrame.addButton "pencil", false, !->
            i-frame.mode = 'pencil'
        iFrame.addButton "grid", false, !->
            i-frame.mode = 'grid'
            i-frame.draw-grid 'lightgray', 10, 10

        i-frame.update-buttons!

        iFrame.listener.add-event i-frame.originX, i-frame.origin-y, i-frame.width,
        iFrame.height, 'mousedown', (e, loc)!->

            if i-frame.mode is 'line' then
                i-frame.save-drawing-surface!
            i-frame.mousedown.x = loc.x
            i-frame.mousedown.y = loc.y
            i-frame.last-loc = loc
            i-frame.dragging = true

            if i-frame.mode is 'pencil' then
                i-frame.context.begin-path!

        iFrame.listener.add-event i-frame.originX, i-frame.origin-y, i-frame.width,
        iFrame.height, 'mousemove', (e, loc)!->

            if i-frame.dragging and i-frame.mode == 'line' then
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
            if i-frame.mode is 'line' then
                i-frame.restore-drawing-surface!
                i-frame.update-rubberband loc

            if i-frame.mode is 'eraser' then
                i-frame.restore-drawing-surface!
                i-frame.clear-last-area i-frame.last-loc
                i-frame.save-drawing-surface!
                i-frame.draw-eraser loc


            i-frame.dragging = false

