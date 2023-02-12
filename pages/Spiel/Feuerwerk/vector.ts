namespace FeuerwerkNamespace {

    export class Vector {
        public x: number;
        public y: number;

        constructor(_x: number, _y: number) {
            this.x = _x;
            this.y = _y;
        }

        public set(_x: number, _y: number): void {
            this.x = _x;
            this.y = _y;
        }

        public copy(): Vector {
            return new Vector(this.x, this.y);
        }
    }
}