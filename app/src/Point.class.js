'use strict';

import Util from './Util';
export default class Point {

    constructor(x = 0, y = 0, name='', color = '#34495e') {
        this.x = x;
        this.y = y;
        this.origin = {
            x: this.x,
            y: this.y
        };
        this.time = 0;
        this.color = color;
        this.speed = 50;
        this.iteration = 0;
        this.name = name;
    }

    update() {
        //console.log('this:', this.x, this.y);
        this.move();
        this.iteration++;
    }

    move() {
        if (this.destination && this.destination !== null) {
            //move a bit to the dest.
            this.x = Util.easeInOutQuad(this.iteration, this.x, this.destination.x - this.x, this.speed);
            this.y = Util.easeInOutQuad(this.iteration, this.y, this.destination.y - this.y, this.speed);
            if (Util.distanceBetweenPoints(this, this.destination) < 1) {
                this.destination = null;
            }
        } else {
            //this.destination = Util.getRandomPointInRadius(_point.origin, POINTS_MOVE_DIST);
            this.iteration = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();

        //debug
        //draw destination with line
        /*if (this.destination && !_.isNull(this.destination)) {
            ctx.fillStyle = '#7f8c8d';
            ctx.beginPath();
            ctx.arc(this.destination.x, this.destination.y, 2, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#2e4154';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.destination.x, this.destination.y);
            ctx.stroke();

        }*/

    }
}