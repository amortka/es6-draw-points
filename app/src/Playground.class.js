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
            }
        });
    }

    update() {
        _.forEach(this.objects, (object) => {
            if (_.isFunction(object.update)) {
                object.update();
            }
        });

        this.draw();

        this.raf = requestAnimationFrame(this.update.bind(this));
    }

    add(object) {
        this.objects.push(object);
    }

    init() {
         let groups = [
            {color: '#7f8c8d', amount: 250},
            {color: '#e74c3c', amount: 100},
            {color: '#e67e22', amount: 100},
            //{color: '#ecf0f1', amount: 1000}
        ];

        _.forEach(groups, (group) => {
            let newGroup = new PointsCollection(group.color, this.boundary);
            newGroup.createPoints(group.amount);
            newGroup.createLinks();
            this.add(newGroup);
        });


        this.update();
    }
}