namespace FeuerwerkNamespace {
    export class Feuerwerk extends Moveable {
       
        public lineWidth: number = 2;

        public primaryColor: string;
        public secondaryColor: string;
        public radius: number;
        public particles: number;
        
        public innerRadius: number = 0; 
        public outerRadius: number = 0; 

        constructor(_x: number, _y: number, _primaryColor: string, _secondaryColor: string, _radius: number, _particles: number) {
            super(new Vector (_x, _y));
            this.primaryColor = _primaryColor;
            this.secondaryColor = _secondaryColor;
            this.radius = _radius;
            this.particles = _particles;
        }

        public draw(_duration: number): void {
            this.duration -= _duration;

            if (this.duration < 0) {       
                this.expendable = true;
                return;
            }
            canvasRenderingContext.save();                   
        
            
            if (this.outerRadius < this.radius) {                          
                if ((this.outerRadius + _duration * 300) > this.radius)   {
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

            let circleSteps: number = Math.PI * 2 / this.particles;

            for (let i: number = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawExplosion(i);
            }

            canvasRenderingContext.restore();
        }

        private drawExplosion(_circleStep: number): void {   
            canvasRenderingContext.setTransform(1, 0, 0, 1, this.position.x, this.position.y);
            canvasRenderingContext.rotate(_circleStep);
            if (this.outerRadius - this.innerRadius != 0) {
                let gradient: CanvasGradient = canvasRenderingContext.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.outerRadius);                 
                gradient.addColorStop(0, this.primaryColor);
                gradient.addColorStop(1, this.secondaryColor);
                canvasRenderingContext.fillStyle = gradient;
            }
            
            canvasRenderingContext.fillRect(-this.lineWidth / 2, this.innerRadius, this.lineWidth, this.outerRadius - this.innerRadius); 
            }
    }
}