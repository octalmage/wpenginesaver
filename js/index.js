setTimeout(() => {
  playPuzzle();
}, 2000);

var gap = 5;
    var width = 80;
    var circleR = 10;
    var size = width * 3 + gap * 2;

    var shape1 = "M20 0 H 80 V 80 H 0 V 20 Z"; // one notch
    var shape2 = "M20 0 H 60 L80 20 V 80 H 0 V 20 Z"; // two notches

    var blocks = [{
      path: shape1,
      x: 0,
      y: 0,
      a: 0
    }, {
      path: shape2,
      x: 1,
      y: 0,
      a: 180
    }, {
      path: shape1,
      x: 2,
      y: 0,
      a: 270
    }, {
      path: shape1,
      x: 0,
      y: 1,
      a: 180
    }, {
      path: shape2,
      x: 2,
      y: 1,
      a: 270
    }, {
      path: shape2,
      x: 0,
      y: 2,
      a: 90
    }, {
      path: shape2,
      x: 1,
      y: 2,
      a: 0
    }, {
      path: shape1,
      x: 2,
      y: 2,
      a: 90
    }];

    var blank = {
      x: 1,
      y: 1
    };

    function translate(x, y) {
      var x1 = (width + gap) * x;
      var y1 = (width + gap) * y;
      return "translate(" + x1 + " " + y1 + ")";
    }

    function transform(block) {
      var center = width / 2;
      var rotate = "rotate(" + block.a + " " + center + " " + center + ")";

      return translate(block.x, block.y) + rotate;
    }

    var svg = d3.select('svg#logo')
      .attr('width', size)
      .attr('height', size);

    var dot = svg.selectAll('circle')
      .data([blank])

    var dotX = function(d) {
      return ((width + gap) * d.x + (width / 2));
    };

    var dotY = function(d) {
      return ((width + gap) * d.y + (width / 2));
    };

    dot.enter()
      .append('circle')
      .attr('r', circleR)
      .attr('cx', dotX)
      .attr('cy', dotY);

    var paths = svg.selectAll('path')
      .data(blocks)

    paths.enter()
      .append('path')
      .attr('d', function(d, i) {
        return d.path
      })
      .attr('transform', transform);

    function swapWithBlank(block) {
      // swap block with the blank position
      var x = blank.x;
      var y = blank.y;
      blank.x = block.x;
      blank.y = block.y;
      block.x = x;
      block.y = y;

      // transition all blocks into their new positions
      paths.transition()
        .attr('transform', transform);

      // transition dot to the new position
      dot.transition()
        .attr('cx', dotX)
        .attr('cy', dotY);
    }

    function playPuzzle() {
      var lastMoved = null;

      function pickNeighbor() {
        var neighbors = blocks.reduce(function(ns, b) {
          if (((b.y == blank.y) && Math.abs(b.x - blank.x) == 1) ||
            ((b.x == blank.x) && Math.abs(b.y - blank.y) == 1)) {
            if (b != lastMoved) {
              ns.push(b);
            }
          }
          return ns;
        }, []);
        lastMoved = neighbors[Math.floor(Math.random() * neighbors.length)];
        return lastMoved;
      }

      // move a block every 0.5 seconds
      setInterval(function() {
        // pick the block to move
        var block = pickNeighbor();

        // swap it
        swapWithBlank(block);
      }, 500);
    }

    var delayByIndex = function(d, i) {
      return 100 * i;
    };

    // move all blocks to one position
    function collapseTo(x, y) {
      paths.transition()
        .transition()
        .duration(500)
        .delay(delayByIndex)
        .attr('transform', translate(x, y));
    }

    // move blocks to original positions
    function reset(x, y) {
      paths.transition()
        .ease('elastic')
        .attr('transform', transform);
    }

    // install a mouse listener that will stack & reset blocks
    function stackOnClick() {
      collapsed = false;
      paths.on('click', function(d) {
        if (collapsed) {
          reset();
        } else {
          collapseTo(d.x, d.y);
        }
        collapsed = !collapsed;
      });
    }

    // install a mouse listener that will move a block like a puzzle piece
    function moveOnClick() {
      paths.on('click', function(d) {
        console.log(d);
        swapWithBlank(d);
      });
    }

    // move all blocks off screen
    function blowAway() {
      paths.transition()
        .duration(1000)
        .attr('transform', function(d, i) {
          return translate(10, d.y);
        });
    }

