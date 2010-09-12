if (!window.Class) alert('`Class` object missing. base.js is required.');
if (!window._) alert('`_` object missing. underscore.js is required.');
if (!window.Raphael)
    alert('`Raphael` object missing. raphael.js is required.');

$(document).ready(function() {

  var body = $('body');
  var doc = $(document);
  var paper = Raphael(body.get()[0], doc.width() - 5, doc.height() - 5);
  var bg = paper.rect(0, 0, paper.width, paper.height).attr({ fill: 'green' });

  var rx = parseInt(paper.width / 2), ry = parseInt(paper.height / 2);

  var center = paper
    .text(rx, ry, "*")
    .attr({ 'font-size': '30px', fill: 'black' });
  center.x = center.y = 0;

  var player = paper
    .image('images/ship.png', rx, ry, 27, 27);
  player.x = player.y = 0;

  var actors = [center, player];


  // -----------------------

  var old_rx, old_ry;

  var onDragStart = function() {
    old_rx = rx;
    old_ry = ry;
    body.addClass('dragging');
  };

  var onDrag = function(dx, dy) {
    rx = old_rx + dx;
    ry = old_ry + dy;
    _.each(actors, function(el) {
      el.attr({x: el.x + rx, y: el.y + ry});
    });
  };

  var onDragFinish = function() {
    body.removeClass('dragging');
  };

  bg.drag(onDrag, onDragStart, onDragFinish);


  // ---------------------------

  var x = 0, y = 0;


});
