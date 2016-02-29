'use strict';

import _ from 'lodash';
import Point from './Point.class';
import Util from './Util';

export default class PointsCollection {
    constructor(boundary) {
        this.boundary = boundary;        
        this.points = [];
        this.center = { x:boundary.width / 2, y:boundary.height / 2 };
    }
    
    createPoints(amount) {
        for (let i=0; i<amount; i++) {
            let x = Math.random() * this.boundary.width;
            let y = Math.random() * this.boundary.height;
            let point =  new Point(x, y, 'p-'+i);
            
            this.points.push(point)
        }
    }
    
    movePoints(pattern) {
        let newPoints = _.shuffle(this.getPattern(pattern));

        _.forEach(this.points, (point) => {
            /*
             let closest = Util.getClosestPoint(point, newPoints);
            let idx = _.findIndex(newPoints, (newPoint) => {
                return closest.x === newPoint.x && closest.y === newPoint.y;
            });
            newPoints.splice(idx, 1);

            point.destination = closest;
            */
            point.destination = newPoints.pop();
        });
    }
    
    getPattern(pattern) {
        let points = [];
        let amount = this.points.length;

        let shortest = Math.min(this.boundary.width, this.boundary.height);

        let radius = Math.random() * (shortest * 0.5 - 20) + 20;
        let density = Math.floor(Math.random() * 20) + 1;

        if (pattern === 'circle') {
            let step = 1 / amount;


            for (let i=0; i < amount; i++) {
                let angle = (step * i) * Math.PI * 2;
                let x = this.center.x + radius * Math.cos(angle);
                let y = this.center.y + radius * Math.sin(angle);
                let point =  new Point(x, y);
                points.push(point);
            }
        } else if (pattern === 'sin') {
            let step = (Math.PI * 2) / amount;

            for (let i = 0; i < amount; i++) {
                let radiusModifier = Math.sin(step * i * density) * shortest * 0.1;//* (Math.random() < 0.5 ? -1 : 1);
                let angle = step * i;
                let x = this.center.x + (radius + radiusModifier) * Math.cos(angle);
                let y = this.center.y + (radius + radiusModifier) * Math.sin(angle);
                let point = new Point(x, y);
                points.push(point);
            }
        }

        return points;
    }
    
    getPoints() {
        return this.points;
    }
}