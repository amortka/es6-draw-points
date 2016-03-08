'use strict';

import _ from 'lodash';

import Point from './Point.class';
import PointsCollection from './PointsCollection.class';
import Rect from './Rect.class';

export default class Playground {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.prepareCanvas(window.clientWidth, window.clientHeight);
        
        this.dirty = true;
        this.raf = null;        
        this.objects = [];
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.boundary.width, this.boundary.height);

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
    
    prepareCanvas(w, h) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.boundary = new Rect(0, 0, this.canvas.width, this.canvas.height);
        this.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
    }
    
    resizeObjects() {
        _.forEach(this.objects, (object) => {
            if (object instanceof PointsCollection) {
                object.setBoundary(this.boundary);
            }            
        });
    }
    
    init() {
        let groups = [
           // {color: '#e74c3c', amount: 200}, 
            {color: '#3498db', amount: 200},
            {color: '#9b59b6', amount: 200},
            {color: '#2ecc71', amount: 200}
        ];

//        groups = [{color: '#e74c3c', amount: 500}];

        _.forEach(groups, (group) => {
            let newGroup = new PointsCollection(group.color, this.boundary);
            newGroup.createPoints(group.amount);
            newGroup.createLinks();
            this.add(newGroup);
        });


        this.update();
        
        window.addEventListener('resize', () => {
            this.prepareCanvas(window.innerWidth, window.innerHeight);    
            this.resizeObjects();
        }, false);
    }
}