#    > Author: William
#    > Email: williamjwking@gmail.com

$ ->
    if window.location.pathname is '/factory/drawing'
        # Get the canvas object
        canvas = $('#canvas')
        canvas[0].height = 600
        canvas[0].width = 800


        # Canvas event listener, the parameter is jquery object
        canvas-listener = (canvas)!->
            this.canvas = canvas
            that = this
            func = (obj)->
                that = obj
                return that.deal-events
            this.canvas.click = func this
            this.events = []

        # Add new event to listener
        canvas-listener.prototype.add-event = (x, y, width, height, callback)!->
            new-event =
                x       : x,
                y       : y,
                width   : width,
                height  : height,
                callback: callback
            this.events.push new-event

        canvas-listener.prototype.deal-events = (e)!->

            # Get the position of event
            if e.layer-x or e.layer-x ~= 0
            then
                event-x = e.layer-x
                event-y = e.layer-y
            else
                if e.offset-x or e.layer-x ~= 0
                then
                    event-x = e.offset-x
                    event-y = e.effset-y

            for event in that.events
                if event-x >= event.x and event-x < event.x + event.width
                and event-y >= event.y and event-y < event.y + event.height
                    event.callback!

        # Create the drawing frame object
        drawingFrame = ->
            this.canvas = canvas[0]
            this.context = canvas[0].getContext('2d')
            this.listener = new canvas-listener canvas
            # Set the real drawing area
            this.originX = 0
            this.originY = 40
            this.height = canvas[0].height - this.originX
            this.width =  canvas[0].width - this.originY
            # Set button attributes
            this.numOfButtons = 0
            this.BUTTON_MARGIN = 4
            this.BUTTON_SHADOW_COLOR = 'rgba(0, 0, 0, 0.7)'
            this.BUTTON_SHADOW_OFFSET = 1
            this.BUTTON_SHADOW_BLUR = 2
            this.BUTTON_HEIGHT = 20
            this.BUTTON_WIDTH = 50


        # Init the frame
        drawingFrame.prototype.init = ->
            this.context.clearRect this.originX, this.originY, this.width, this.height

        # Test drawing rectangle
        drawingFrame.prototype.rectTest = !->

            that = this
            this.init!
            context = this.context
            context.lineWidth = 20

            context.font = '24px Helvetica'
            context.fillText 'Click anywhere to erase', 175, 40

            context.strokeRect 75, 100, 200, 200
            context.fillRect 325, 100, 200, 200

            context.canvas.onmousedown = (e)->
                that.init!
                context.canvas.onmousedown = null

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

        drawingFrame.prototype.addButton = (text, callback)!->

            this.shadowColor = this.BUTTON_SHADOW_COLOR
            this.shadowOffsetX = this.shadowOffsetY = this.BUTTON_SHADOW_OFFSET
            this.shadowBlur = this.BUTTON_SHADOW_BLUR

            x = (this.BUTTON_WIDTH + this.BUTTON_MARGIN) * this.numOfButtons
            this.context.strokeRect x, 0, this.BUTTON_WIDTH, this.BUTTON_HEIGHT

            this.context.font = '10px Helvetica'
            this.context.fillText(text, x + 10, 10)
            ++this.numOfButtons

            if callback then
                this.listener.add-event x, 0, this.BUTTON_WIDTH, this.BUTTON_HEIGHT, callback

        drawingFrame.prototype.drawBounding = !->

            context = this.context
            context.line-width = 1
            context.begin-path!
            context.move-to 0, this.originY
            context.line-to this.originX + this.width, this.originY
            context.stroke!


        # Run the frame
        iFrame = new drawingFrame!
        iFrame.drawBounding!
        iFrame.addButton "eraser", ->
            alert("hehe")
        iFrame.addButton "line"
        iFrame.addButton "curve"
        iFrame.testRidialGradient!

