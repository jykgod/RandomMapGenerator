module MapGenerate {
    export class Room {
        id: number;
        x: number;
        y: number;
        width: number;
        height: number;
        neighbor: Room[];

        constructor(id: number, x: number, y: number, width: number, height: number) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        getDistanceToCenter(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        getSqrDistanceToCenter(): number {
            return this.x * this.x + this.y * this.y;
        }

        inCollisionWithOtherRoom(r: Room): boolean {
            var minRx = r.x - r.width / 2;
            var maxRx = r.x + r.width / 2;
            var minRy = r.y - r.height / 2;
            var maxRy = r.y + r.height / 2;
            var minx = this.x - this.width / 2;
            var maxx = this.x + this.width / 2;
            var miny = this.y - this.height / 2;
            var maxy = this.y + this.height / 2;
            return (minRx <= maxx && maxRx >= minx) && (minRy <= maxy && maxRy >= miny);
        }

        addNeighbor(room: Room) {
            this.neighbor.push(room);
        }

        print() {
            console.log("x:" + this.x + ";y:" + this.y + ";width:" + this.width + ";height:" + this.height);
        }
    }
}