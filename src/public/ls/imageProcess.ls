$ !->
    if window.location.pathname is '/lab/imageprocess'

        ImageProcessor = (canvas, path, scale)!->
            this.canvas = canvas
            this.context = canvas.get-context '2d'
            this.image = new Image()
            if path
                this.set-image path
            this.scale = 1 || scale

            func = (image-processor)->
                (e)!->
                    image-processor.canvas.width = image-processor.image.width
                    image-processor.canvas.height = image-processor.image.height
                    image-processor.canvas.style.width = image-processor.image.width + 'px'
                    image-processor.canvas.style.height = image-processor.image.height + 'px'
                    image-processor.draw-image!
                    image-processor.average-filter!
            this.image.onload = func(this)

        ImageProcessor.prototype =
            set-image: (path)!->
                this.image.src = path
            ,
            draw-image: !->
                w = this.canvas.width
                h = this.canvas.height
                sw = this.canvas.width * this.scale
                sh = this.canvas.height * this.scale

                this.context.clear-rect 0, 0, w, h
                this.context.draw-image this.image, -sw/2+w/2, -sh/2+h/2, sw, sh
            ,
            average-filter: !->
                filter = [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]]
                image-data = this.context.get-image-data 0, 0, this.canvas.width, this.canvas.height
                w = this.canvas.width
                h = this.canvas.height

                val = (x, y, z)->
                    if x >= 0 and x < h and y >= 0 and y < w then return image-data[(x * w + y) * 4 + z]
                    else return 0

                for i from 0 to this.canvas.height - 1
                    for j from 0 to this.canvas.width - 1
                        r = 0
                        g = 0
                        b = 0
                        for x from 0 to 2
                            for y from 0 to 2
                                r += val(i - 1 + x, j - 1 + y, 0) * filter[x][y]
                                g += val(i - 1 + x, j - 1 + y, 1) * filter[x][y]
                                b += val(i - 1 + x, j - 1 + y, 2) * filter[x][y]
                        image-data[(i * w + j) * 4] = r
                        image-data[(i * w + j) * 4 + 1] = g
                        image-data[(i * w + j) * 4 + 2] = b
                this.context.put-image-data image-data, 0, 0
        # Init the processor
        canvas = document.get-element-by-id 'image-shower'
        image-processor = new ImageProcessor canvas, '/images/ll1.png', 1
