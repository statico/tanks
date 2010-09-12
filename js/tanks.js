if (!window.Class) alert('`Class` object missing. base.js is required.');
if (!window._) alert('`_` object missing. underscore.js is required.');
if (!window.Raphael)
    alert('`Raphael` object missing. raphael.js is required.');

var STAGE = {
  paper: null,
  rx: 0,
  ry: 0,
};

var Actor = Class.extend({

  init: function() {
    this.paper = STAGE.paper;
    this.x = 0;
    this.y = 0;
    this.oldx = this.x;
    this.oldy = this.y;
    this.offsetx = 0;
    this.offsety = 0;
    this.r = 0;
    this.el = this.draw();
  },

  step: function() {
    var newx = this.x + this.offsetx + STAGE.rx;
    var newy = this.y + this.offsety + STAGE.ry;
    this.el.translate(newx - this.oldx, newy - this.oldy);
    this.oldx = newx;
    this.oldy = newy;
    this.el.rotate(this.r, true);
  },

});

var Midpoint = Actor.extend({

  draw: function() {
    return this.paper
      .path("M -20 0 H 20 M 0 -20 V 20")
      .attr({ stroke: 'red', 'stroke-width': '2px' });
  },

});

var Tank = Actor.extend({

  draw: function() {
    var img = this.paper.image('images/ship.png', 0, 0, 27, 27);
    this.offsetx = this.offsety = -13;
    return img;
  },

});

var MainLoop = Class.extend({

  init: function(speed, fn) {
    this.speed = speed;
    this.fn = fn;
  },

  start: function() {
    var self = this;
    var loop;
    loop = function() {
      var start_time = new Date();

      self.fn();

      var elapsed = new Date() - start_time;
      var delay = Math.max(1,
          Math.min(self.speed, self.speed - elapsed - 4));
      self.timer = setTimeout(loop, delay);
    };
    loop();
  },

  stop: function() {
    if (this.timer) clearTimeout(this.timer);
  },

});

$(document).ready(function() {

  var body = $('body');
  var doc = $(document);
  var paper = Raphael(body.get()[0], doc.width() - 5, doc.height() - 5);
  var bg = paper.rect(0, 0, paper.width, paper.height).attr({ fill: 'grey' });

  STAGE.rx = parseInt(paper.width / 2);
  STAGE.ry = parseInt(paper.height / 2);
  STAGE.paper = paper;

  // -----------------------

  var old_rx, old_ry;

  var onDragStart = function() {
    old_rx = STAGE.rx;
    old_ry = STAGE.ry;
    body.addClass('dragging');
  };

  var onDrag = function(dx, dy) {
    STAGE.rx = old_rx + dx;
    STAGE.ry = old_ry + dy;
  };

  var onDragFinish = function() {
    body.removeClass('dragging');
  };

  bg.drag(onDrag, onDragStart, onDragFinish);

  // ---------------------------

  var midpoint = new Midpoint();
  var player = new Tank();

  var actors = [player, midpoint];

  var keys = {};
  body.keydown(function(e) {
    keys[e.which] = true;
  });
  body.keyup(function(e) {
    delete keys[e.which];
  });

  var loop = new MainLoop(20, function() {

    for (key in keys) {
      switch (key) {
        case '37':
          player.r = (player.r - 3) % 360;
          break;
        case '39':
          player.r = (player.r + 3) % 360;
          break;
        case '38':
          var rad = Raphael.rad(player.r);
          player.x += Math.sin(rad) * 3;
          player.y -= Math.cos(rad) * 3;
          break;
      }
    }

    _.each(actors, function(actor) {
      actor.step();
    });

  });

  loop.start();

});
