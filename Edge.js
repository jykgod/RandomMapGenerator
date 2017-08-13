/// <reference path="Room.ts" />
var MapGenerate;
(function (MapGenerate) {
    var Edge = (function () {
        function Edge(Room1, Room2) {
            this.Room1 = Room1;
            this.Room2 = Room2;
            this.sqrDis = (Room1.x - Room2.x) * (Room1.x - Room2.x) + (Room1.y - Room2.y) * (Room1.y - Room2.y);
        }
        return Edge;
    })();
    MapGenerate.Edge = Edge;
})(MapGenerate || (MapGenerate = {}));
