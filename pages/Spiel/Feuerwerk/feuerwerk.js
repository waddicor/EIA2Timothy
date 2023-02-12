"use strict";
var FeuerwerkNamespace;
(function (FeuerwerkNamespace) {
    class Feuerwerk extends FeuerwerkNamespace.Moveable {
        constructor(_x, _y, _primaryColor, _secondaryColor, _radius, _particles) {
            super(new FeuerwerkNamespace.Vector(_x, _y));
            this.lineWidth = 2;
            this.innerRadius = 0;
            this.outerRadius = 0;
            this.primaryColor = _primaryColor;
            this.secondaryColor = _secondaryColor;
            this.radius = _radius;
            this.particles = _particles;
        }
        draw(_duration) {
            this.duration -= _duration;
            if (this.duration < 0) {
                this.expendable = true;
                return;
            }
            FeuerwerkNamespace.canvasRenderingContext.save();
            if (this.outerRadius < this.radius) {
                if ((this.outerRadius + _duration * 300) > this.radius) {
                    this.outerRadius = this.radius;
                    this.innerRadius = this.radius / 2;
                }
                else {
                    this.outerRadius += _duration * 300;
                    this.innerRadius += (_duration * 300) / 2;
                }
            }
            if (this.outerRadius == this.radius && this.innerRadius < this.radius) {
                if ((this.innerRadius + _duration * 150) > this.radius)
                    this.innerRadius = this.radius;
                else
                    this.innerRadius += _duration * 150;
            }
            if (this.innerRadius > this.outerRadius) {
                this.innerRadius = this.radius;
            }
            let circleSteps = Math.PI * 2 / this.particles;
            for (let i = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawExplosion(i);
            }
            FeuerwerkNamespace.canvasRenderingContext.restore();
        }
        drawExplosion(_circleStep) {
            FeuerwerkNamespace.canvasRenderingContext.setTransform(1, 0, 0, 1, this.position.x, this.position.y);
            FeuerwerkNamespace.canvasRenderingContext.rotate(_circleStep);
            if (this.outerRadius - this.innerRadius != 0) {
                let gradient = FeuerwerkNamespace.canvasRenderingContext.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.outerRadius);
                gradient.addColorStop(0, this.primaryColor);
                gradient.addColorStop(1, this.secondaryColor);
                FeuerwerkNamespace.canvasRenderingContext.fillStyle = gradient;
            }
            FeuerwerkNamespace.canvasRenderingContext.fillRect(-this.lineWidth / 2, this.innerRadius, this.lineWidth, this.outerRadius - this.innerRadius);
        }
    }
    FeuerwerkNamespace.Feuerwerk = Feuerwerk;
})(FeuerwerkNamespace || (FeuerwerkNamespace = {}));
