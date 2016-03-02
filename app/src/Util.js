'use strict';

var Util = {
    getClosestPoints: function (point, points, no) {
        var _this = this;

        points = points.map(function (p) {
            p.dist = _this.distanceBetweenPoints(point, p);
            return p;
        });

        var pointsByDistance = points.sort(function (p1, p2) {
            return p1.dist - p2.dist;
        });

        if (!_.isUndefined(no) && no < pointsByDistance.length) {

            return pointsByDistance.slice(0, no);
        }

        return pointsByDistance;
    },
    getClosestPoint: function (point, points) {
        return this.getClosestPoints(point, points)[0]
    },
    distanceBetweenPoints: function (p1, p2) {
        return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
    },
    getRandomPointInRadius(centerPoint, radius) {
        var angle = Math.random() * Math.PI * 2;
        return {
            x: centerPoint.x + radius * Math.cos(angle),
            y: centerPoint.y + radius * Math.sin(angle)
        };
    },
    getMousePos: function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    },
    //t: currentTime, b: startVal, c: change, d: duration
    linearTween: function (t, b, c, d) {
        return c * t / d + b;
    },
    easeInOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    },
    rand: function (rMi, rMa) {
        return ~~((Math.random() * (rMa - rMi + 1)) + rMi);
    },
    hex2hsl: function (hex) {
        hex = hex[0] === '#' ? hex.substr(1) : hex;
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4, 6), 16) / 255;

        //r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }

        h *= 360;
        s *= 100;
        l *= 100;
        return {h, s, l};
    }
}
export default Util;