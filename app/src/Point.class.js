'use strict';

import Util from './Util';
export default class Point {

    constructor(x = 0, y = 0, name='', color = '#34495e') {
        this.x = x;
        this.y = y;
        this.XY = {x, y};

        this.time = 0;
        this.radius = 1;
        this.color = color;
        this.hsl = Util.hex2hsl(color);
        this.speed = Util.rand(100, 300);
        this.iteration = 0;
        this.name = name;
        this.destination = null;
        this.links = null;
        
        this.rotation = 0;
        this.origin = null;
    }
    
    getXY() {
        return {
            x: this.x,
            y: this.y
        }
    }

    update() {
        this.move();
        this.XY = _.isNull(this.origin) ? this.getXY() : Util.rotatePoint(this.getXY(), this.origin, this.rotation);
        this.iteration++;
    }
    
    setColorByAngle(angle) {
       this.hsl = {
            h: angle,
            s: '100',
            l: Util.rand(30, 75)
       };
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
            this.iteration = 0;
        }
    }
    
    rotate(angle, origin) {
        this.rotation = angle;
        this.origin = origin;
    }

    drawLinks(ctx) {
        ctx.strokeStyle = 'hsla('+Util.rand(this.hsl.h-30, this.hsl.h+30)+', 100%, '+Util.rand(40, 75)+'%, 0.07)';            
        ctx.beginPath();
        _.forEach(this.links, (link) => {
            ctx.moveTo(this.XY.x, this.XY.y);
            ctx.lineTo(link.XY.x, link.XY.y);
        });
        ctx.stroke();
    }

    draw(ctx) {
        ctx.fillStyle = 'hsla('+Util.rand(this.hsl.h-30, this.hsl.h+30)+', 100%, '+Util.rand(30, 75)+'%, 0.1)'; 
        ctx.beginPath();
        ctx.arc(this.XY.x + this.radius/2, this.XY.y + this.radius/2, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        
        this.drawLinks(ctx);
    }
}