'use strict';

var Util = {
    getClosestPoints: function(point, points, no) {
      var _this = this;

      points = points.map(function(p) {
        p.dist = _this.distanceBetweenPoints(point, p);
        return p;
      });

      var pointsByDistance = points.sort(function(p1, p2) {
        return p1.dist - p2.dist;
      });

      if (!_.isUndefined(no) && no < pointsByDistance.length) {

        return pointsByDistance.slice(0, no);
      }

      return pointsByDistance;
    },
    getClosestPoint: function(point, points) {
        return this.getClosestPoints(point, points)[0]
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

}
export default Util;