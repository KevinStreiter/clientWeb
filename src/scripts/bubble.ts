export class Bubble {
    readonly radius: number;
    readonly id: number;
    private _x: number;
    private _y: number;
    private _vx: number;
    private _vy: number;

    public constructor(rowCounter:number, width: number, height: number, maxRadius:number) {
        let velocity = Math.random() * 2 + 1;
        let angle = Math.random() * 360;
        this.id = rowCounter;
        this.radius = Math.floor(Math.random() * (maxRadius - 1) + 5);
        this._x = this.generateRandomNumber(width);
        this._y = this.generateRandomNumber(height);
        this._vx = velocity * Math.cos(angle * Math.PI / 180);
        this._vy = velocity * Math.sin(angle * Math.PI / 180);
    }

    public generateRandomNumber(value:number): number {
        return Math.floor(Math.random() * (value - (this.radius*4))) + (this.radius*2);
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get vx(): number {
        return this._vx;
    }

    set vx(value: number) {
        this._vx = value;
    }

    get vy(): number {
        return this._vy;
    }

    set vy(value: number) {
        this._vy = value;
    }
}
