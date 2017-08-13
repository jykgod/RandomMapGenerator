var MapGenerate;
(function (MapGenerate) {
    var Room = (function () {
        function Room(id, x, y, width, height) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Room.prototype.getDistanceToCenter = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        Room.prototype.getSqrDistanceToCenter = function () {
            return this.x * this.x + this.y * this.y;
        };

        Room.prototype.inCollisionWithOtherRoom = function (r) {
            var minRx = r.x - r.width / 2;
            var maxRx = r.x + r.width / 2;
            var minRy = r.y - r.height / 2;
            var maxRy = r.y + r.height / 2;
            var minx = this.x - this.width / 2;
            var maxx = this.x + this.width / 2;
            var miny = this.y - this.height / 2;
            var maxy = this.y + this.height / 2;
            return (minRx <= maxx && maxRx >= minx) && (minRy <= maxy && maxRy >= miny);
        };

        Room.prototype.addNeighbor = function (room) {
            this.neighbor.push(room);
        };

        Room.prototype.print = function () {
            console.log("x:" + this.x + ";y:" + this.y + ";width:" + this.width + ";height:" + this.height);
        };
        return Room;
    })();
    MapGenerate.Room = Room;
})(MapGenerate || (MapGenerate = {}));
