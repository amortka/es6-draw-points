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

    update(time) {
        _.forEach(this.objects, (object) => {
            if (_.isFunction(object.update)) {
                object.update();
            }
        });
        this.draw();


        this.time = time;
        this.raf = requestAnimationFrame(this.update.bind(this));
    }

    add(object) {
        this.objects.push(object);
    }

    init() {
        let groups = [
            {color: '#e74c3c', amount: 200},
            {color: '#3498db', amount: 200},
            {color: '#9b59b6', amount: 200}
        ];

//        groups = [{color: '#e74c3c', amount: 5}];

        _.forEach(groups, (group) => {
            let newGroup = new PointsCollection(group.color, this.boundary);
            newGroup.createPoints(group.amount);
            newGroup.createLinks();
            this.add(newGroup);
        });


        this.update();
    }
}