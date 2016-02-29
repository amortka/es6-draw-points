'use strict';

import _ from 'lodash';

import Point from './Point.class';
import PointsCollection from './PointsCollection.class';
import Rect from './Rect.class';

export default class Playground {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.dirty = true;
        this.startTime = null;
        this.raf = null;

        this.boundary = new Rect(0, 0, this.canvas.width, this.canvas.height);
        this.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        this.objects = [];
    }

    draw() {
        this.ctx.clearRect(0, 0, this.boundary.width, this.boundary.height);

        _.forEach(this.objects, (object) => {
            if (_.isFunction(object.draw)) {
                object.draw(this.ctx);
                //                this.dirty = true;
            }
        });
    }

    update() {
        _.forEach(this.objects, (object) => {
            if (_.isFunction(object.update)) {
                object.update();
            }

        });


        if (!_.some(this.objects, function (object) {
                return !_.isNull(object.destination);
            })) {
            setTimeout(()=> {
                this.points.movePoints('sin');
            }, 10);

        }
        
        this.draw();

        this.raf = requestAnimationFrame(this.update.bind(this));
    }

    add(objects) {
        this.objects = this.objects.concat(objects);
    }

    init() {
        this.points = new PointsCollection(this.boundary);
        this.points.createPoints(1500);
        this.points.movePoints('sin');

        this.add(this.points.getPoints());

        this.update();
    }
}