export class Vector {
    readonly x: number;
    readonly y: number;
    readonly id: number;
    public constructor(rowCounter:number, width: number, height: number, radius:number) {
        this.x = this.generateRandomNumber(width, radius);
        this.y = this.generateRandomNumber(height, radius);
        this.id = rowCounter;
    }

    public generateRandomNumber(value: number, radius:number): number {
        return Math.floor(Math.random() * (value - (radius*4))) + (radius*2);
    }
}