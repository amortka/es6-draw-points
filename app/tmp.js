(function() {

  var POINTS_NUMBER = 300;
  var POINTS_MOVE_DIST = 20;
  var MIN_SPEED = 100;
  var MAX_SPEED = 300;
  var SPEED = 400;
  var DEBUG = false;
  var CONNECTIONS = 5;

  var Util = {
    getClosestPoints: function(point, points, no) {
      var _this = this;

      //remove point from points to not make link to itself
      points = points.filter(function(nextPoint) {
        if (point.name === nextPoint.name) {
          return false;
        }

        if (_.some(nextPoint.links, {
            name: point.name
          })) {
          return false;
        }

        return true;
      });

      points = points.map(function(p) {
        p.dist = _this.distanceBetweenPoints(point, p);
        return _.omit(p, 'links');
      });

      var pointsByDistance = points.sort(function(p1, p2) {
        return p1.dist - p2.dist;
      });

      if (!_.isUndefined(no) && no < pointsByDistance.length) {

        return pointsByDistance.slice(0, no);
      }

      return pointsByDistance;
    },
    distanceBetweenPoints: function(p1, p2) {
      return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
    },
    getRandomPointInRadius(centerPoint, radius) {
      var angle = Math.random() * Math.PI * 2;
      return {
        x: centerPoint.x + radius * Math.cos(angle),
        y: centerPoint.y + radius * Math.sin(angle)
      };
    },
    getMousePos: function(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    },
    //t: currentTime, b: startVal, c: change, d: duration
    linearTween: function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInOutQuad: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

  };

  var Stars = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.dirty = true;
    this.startTime = null;

  };

  Stars.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.boundary.width, this.boundary.height);

    /*-- draw points */
    _.forEach(this.points, function(point) {
      point.draw();
    })
  };

  Stars.prototype.movePoints = function() {
    _this = this;
    _.forEach(this.points, function(point) {
      point.move();
      point.updateLinksPosition(_this.points);
    })
    this.dirty = true;
  }

  Stars.prototype.create = function() {
    this.boundary = new Rect(0, 0, this.canvas.width, this.canvas.height)

    var points = [];

    for (var i = 0; i < POINTS_NUMBER; i++) {
      var p = new Point(this.ctx, 0, 0, null, i);
      p.setRandom(this.boundary);
      points.push(p);
    }

    _.forEach(points, function(point) {
      point.linkClosest(CONNECTIONS, points);
    })

    this.points = points;
  };
  
  Stars.prototype.highlight = function(mousePos) {
    var _this = this;
    
    if (mousePos) {
      this.highlightPoint = mousePos;
    } else if (this.highlightPoint) {
      var hoverPoints = Util.getClosestPoints(this.highlightPoint, _this.points, 3);
      
      this.points = _.map(this.points, function(point) {
        point.hover = _.some(hoverPoints, {x: point.x, y: point.y});
        return point;
      });

    }
    
    
  };

  Stars.prototype.update = function(timestamp) {
    this.movePoints();
    this.highlight();

    if (this.dirty) {
      this.draw();
      this.dirty = false;
    }

    if (this.startTime === null) {
      this.startTime = timestamp;
    }

    this.iteration = timestamp - this.startTime;

    requestAnimationFrame(this.update.bind(this));
  };

  Stars.prototype.bindEvents = function() {
    var _this = this;
    this.canvas.onmousemove = function(event) {
      _this.highlight(Util.getMousePos(_this.canvas, event));
    };
  }

  Stars.prototype.init = function() {
    this.create();
    this.bindEvents();
    this.update();
  };

  var Point = function(ctx, x, y, color, name) {
    this.ctx = ctx;
    this.x = x || 0;
    this.y = y || 0;
    this.origin = {
      x: this.x,
      y: this.y
    };
    this.color = color || '#1abc9c';
    this.hover = false;
    this.name = name.toString() || '';
    this.iteration = 0;
    this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
  };

  Point.prototype.setRandom = function(rect) {
    this.x = Math.random() * (rect.x2 - rect.x) + rect.x;
    this.y = Math.random() * (rect.y2 - rect.y) + rect.y;
    this.origin = {
      x: this.x,
      y: this.y
    };
  };

  Point.prototype.linkClosest = function(no, points) {
    var _point = this;
    var newLinks = Util.getClosestPoints(this, points, no);
    newLinks = newLinks.map(function(o) {
      return _.omit(o, 'links');
    });
    _point.links = newLinks;
  };

  Point.prototype.updateLinksPosition = function(points) {
    var _point = this;
    _point.links = _.map(_point.links, function(link) {
      //find new position of link
      var p = _.find(points, {
        name: link.name
      });
      link.x = p.x;
      link.y = p.y;

      return link;
    });
  }

  Point.prototype.move = function() {
    var _point = this;

    if (this.destination && this.destination !== null) {
      //move a bit to the dest.
      this.x = Util.easeInOutQuad(_point.iteration, this.x, this.destination.x - this.x, SPEED - this.speed);
      this.y = Util.easeInOutQuad(_point.iteration, this.y, this.destination.y - this.y, SPEED - this.speed);
      if (Util.distanceBetweenPoints(_point, _point.destination) < 1) {
        this.destination = null;
      }
    } else {
      _point.start = {
        x: _.clone(this.x),
        y: _.clone(this.y)
      }
      _point.destination = Util.getRandomPointInRadius(_point.origin, POINTS_MOVE_DIST);
      _point.iteration = 0;
    }
    this.iteration++;
  };

  Point.prototype.draw = function() {
    var _point = this;
    //draw link
    if (this.links) {
      _point.ctx.strokeStyle = _point.hover ? '#FFFFFF' : '#2e4154';
      _.forEach(this.links, function(link) {
        _point.ctx.beginPath();
        _point.ctx.moveTo(_point.x, _point.y);
        _point.ctx.lineTo(link.x, link.y);
        _point.ctx.stroke();
      });

    };

    // draw point
    _point.ctx.fillStyle = _point.hover ? '#FFFFFF' : this.color;
    _point.ctx.beginPath();
    _point.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, false);
    _point.ctx.closePath();
    _point.ctx.fill();

    // draw destination
    if (_point.destination && DEBUG) {
      _point.ctx.fillStyle = '#FF0000';
      _point.ctx.beginPath();
      _point.ctx.arc(this.destination.x, this.destination.y, 3, 0, 2 * Math.PI, false);
      _point.ctx.closePath();
      _point.ctx.fill();
    }

  };

  var Rect = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x2 = x + width;
    this.y2 = y + height;
  };

  console.clear();
  var stars = new Stars('playground');
  stars.init();

})();