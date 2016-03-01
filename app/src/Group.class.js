'use strict';

import Point from './Point.class';

export default class Group {

    constructor(color, boundary) {
        this.boundary = boundary;
        this.points = [];
        this.color = color;
        this.center = { x: boundary.width / 2, y: boundary.height / 2 };

        this.radius = 1;

        this.offCanvas = document.createElement('canvas');
        this.offCanvas.width = this.radius * 2;
        this.offCanvas.height = this.radius * 2;
        this.offCtx =  this.offCanvas.getContext('2d');

        this.offCtx.fillStyle = color;
        this.offCtx.beginPath();
        this.offCtx.arc(this.radius/2, this.radius/2, this.radius, 0, 2 * Math.PI);
        this.offCtx.closePath();
        this.offCtx.fill();

    }

    update() {
        _.forEach(this.points, (point) => {
            point.update();
        })
    }

    draw(ctx) {
        _.forEach(this.points, (point) => {


            //ctx.drawImage(this.offCanvas, 0, 0, this.radius*2, this.radius*2, point.x, point.y, this.radius*2, this.radius*2);



            ctx.fillStyle = this.color;
            ctx.beginPath();
            point.draw(ctx);
            ctx.closePath();
            ctx.fill();

        })
    }

    createPoints(amount) {
        for (let i=0; i<amount; i++) {
            let x = Math.random() * this.boundary.width;
            let y = Math.random() * this.boundary.height;
            let point =  new Point(x, y, 'p-'+i, this.color);

            this.points.push(point)
        }
    }

}