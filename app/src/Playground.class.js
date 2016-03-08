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
        
        this.time = time;
    }
    
    loop() {
        this.update();
        this.draw();
        
        this.raf = requestAnimationFrame(this.loop.bind(this));
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
            {color: '#3498db', amount: 260, rotation: -0.8, density: 1},
            {color: '#9b59b6', amount: 220, rotation: 0.7},
            {color: '#2ecc71', amount: 100, rotation: 0.6}
        ];
        
        //groups = [{color: '#3498db', amount: 20}];

        _.forEach(groups, (group) => {
            let newGroup = new PointsCollection(group.color, this.boundary, group.rotation, group.density);
            newGroup.createPoints(group.amount);
            newGroup.createLinks();
            this.add(newGroup);
        });

        this.loop();
        
        window.addEventListener('resize', () => {
            this.prepareCanvas(window.innerWidth, window.innerHeight);    
            this.resizeObjects();
        }, false);
    }
}