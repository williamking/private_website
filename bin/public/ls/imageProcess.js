// Generated by LiveScript 1.3.1
(function(){
  $(function(){
    var ImageProcessor, canvas, imageProcessor;
    if (window.location.pathname === '/lab/imageprocess') {
      ImageProcessor = function(canvas, path, scale){
        var func;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.image = new Image();
        if (path) {
          this.setImage(path);
        }
        this.scale = 1 || scale;
        func = function(imageProcessor){
          return function(e){
            imageProcessor.canvas.width = imageProcessor.image.width;
            imageProcessor.canvas.height = imageProcessor.image.height;
            imageProcessor.canvas.style.width = imageProcessor.image.width + 'px';
            imageProcessor.canvas.style.height = imageProcessor.image.height + 'px';
            imageProcessor.drawImage();
            imageProcessor.averageFilter();
          };
        };
        this.image.onload = func(this);
      };
      ImageProcessor.prototype = {
        setImage: function(path){
          this.image.src = path;
        },
        drawImage: function(){
          var w, h, sw, sh;
          w = this.canvas.width;
          h = this.canvas.height;
          sw = this.canvas.width * this.scale;
          sh = this.canvas.height * this.scale;
          this.context.clearRect(0, 0, w, h);
          this.context.drawImage(this.image, -sw / 2 + w / 2, -sh / 2 + h / 2, sw, sh);
        },
        averageFilter: function(){
          var filter, imageData, w, h, val, i$, to$, i, j$, to1$, j, r, g, b, k$, x, l$, y;
          filter = [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]];
          imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
          w = this.canvas.width;
          h = this.canvas.height;
          val = function(x, y, z){
            if (x >= 0 && x < h && y >= 0 && y < w) {
              return imageData[(x * w + y) * 4 + z];
            } else {
              return 0;
            }
          };
          for (i$ = 0, to$ = this.canvas.height - 1; i$ <= to$; ++i$) {
            i = i$;
            for (j$ = 0, to1$ = this.canvas.width - 1; j$ <= to1$; ++j$) {
              j = j$;
              r = 0;
              g = 0;
              b = 0;
              for (k$ = 0; k$ <= 2; ++k$) {
                x = k$;
                for (l$ = 0; l$ <= 2; ++l$) {
                  y = l$;
                  r += val(i - 1 + x, j - 1 + y, 0) * filter[x][y];
                  g += val(i - 1 + x, j - 1 + y, 1) * filter[x][y];
                  b += val(i - 1 + x, j - 1 + y, 2) * filter[x][y];
                }
              }
              imageData[(i * w + j) * 4] = r;
              imageData[(i * w + j) * 4 + 1] = g;
              imageData[(i * w + j) * 4 + 2] = b;
            }
          }
          this.context.putImageData(imageData, 0, 0);
        }
      };
      canvas = document.getElementById('image-shower');
      imageProcessor = new ImageProcessor(canvas, '/images/ll1.png', 1);
    }
  });
}).call(this);