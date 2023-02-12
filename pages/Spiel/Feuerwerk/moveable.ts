namespace FeuerwerkNamespace {

    export abstract class Moveable {
        public position: Vector;
        public expendable: boolean = false;
        public duration: number = 4;

        constructor(_position?: Vector) {
            if (_position) {
                this.position = _position.copy();
            }
            else {
                this.position = new Vector (0, 0);
            }
        }

        public abstract draw(_timeslice: number): void;
    }
}