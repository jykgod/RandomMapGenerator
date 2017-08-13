var MapGenerate;
(function (MapGenerate) {
    var Room = (function () {
        function Room(id, x, y, width, height) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.neighbor = new Array();
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
/// <reference path="Room.ts" />
/// <reference path="Edge.ts" />
var MapGenerate;
(function (MapGenerate) {
    var Generator = (function () {
        function Generator() {
            this.tilePixel = 16;
            this.minLengthOfRoom = 8;
            this.maxLengthOfRoom = 28;
            this.mainRoomSize = 15;
            this.roomNumbers = 20;
            this.radius = 50;
        }
        Generator.prototype.stepOneGenerateRooms = function (r) {
            this.roomList = new Array();
            for (var i = 0; i < this.roomNumbers; i++) {
                this.roomList.push(this.generateRoomInCircle(i, this.radius));
            }
        };

        Generator.prototype.stepTwoDisperseRooms = function () {
            this.roomList.sort(function (a, b) {
                return a.getSqrDistanceToCenter() - b.getSqrDistanceToCenter();
            });
            for (var i = 0; i < this.roomList.length; i++) {
                for (var j = 0; j < i; j++) {
                    if (this.roomList[i].inCollisionWithOtherRoom(this.roomList[j])) {
                        // var gcd: number = this.gcd(Math.abs(this.roomList[i].x), Math.abs(this.roomList[i].y));
                        // var lcm: number = this.roomList[i].x * this.roomList[i].y / gcd;
                        // var gy: number = lcm / this.roomList[i].x;
                        // var gx: number = lcm / this.roomList[i].y;
                        // var fx: number = gx / Math.abs(gx) * this.tilePixel;
                        // var fy: number = gy / Math.abs(gy) * this.tilePixel;
                        // gx = Math.abs(gx);
                        // gy = Math.abs(gy);
                        // console.log("gx:"+gx+";gy:"+gy);
                        var dis = this.roomList[i].getDistanceToCenter();
                        var dx = this.roomList[i].x / dis;
                        var dy = this.roomList[i].y / dis;
                        console.log("dx:" + dx + ";dy:" + dy);

                        // var k: number = 0;
                        var flag = false;
                        do {
                            flag = false;

                            // if (k < 2 * gx && k < 2 * gy) {
                            //     if (k % 2 == 0) {
                            //         this.roomList[i].x += fx;
                            //     } else {
                            //         this.roomList[i].y += fy;
                            //     }
                            // } else {
                            //     if (gx > gy) {
                            //         this.roomList[i].x += fx;
                            //     } else {
                            //         this.roomList[i].y += fy;
                            //     }
                            // }
                            this.roomList[i].x += dx * this.tilePixel;
                            this.roomList[i].y += dy * this.tilePixel;

                            for (var j = 0; j < i; j++) {
                                if (this.roomList[i].inCollisionWithOtherRoom(this.roomList[j])) {
                                    flag = true;
                                    break;
                                }
                            }
                            // k = (k + 1) % (gx + gy);
                        } while(flag);
                    }
                }
            }
        };

        Generator.prototype.stepThreeFindMainRoom = function () {
            this.mainRoomList = new Array();
            for (var i = 0; i < this.roomList.length; i++) {
                if (this.roomList[i].width >= this.mainRoomSize * this.tilePixel && this.roomList[i].height >= this.mainRoomSize * this.tilePixel) {
                    this.mainRoomList.push(this.roomList[i]);
                }
            }
        };

        Generator.prototype.stepFourKruskal = function () {
            var edges;
            edges = new Array();
            for (var i = 0; i < this.mainRoomList.length; i++) {
                for (var j = 0; j < i; j++) {
                    edges.push(new MapGenerate.Edge(this.mainRoomList[i], this.mainRoomList[j]));
                }
            }
            edges.sort(function (a, b) {
                return a.sqrDis - b.sqrDis;
            });
            this.root = new Array();
            for (var i = 0; i < this.mainRoomList.length; i++) {
                this.mainRoomList[i].id = i;
                this.root[i] = i;
            }
            for (var i = 0; i < edges.length; i++) {
                var fa = this.father(edges[i].Room2.id);
                var fb = this.father(edges[i].Room1.id);
                if (fa != fb) {
                    this.root[fa] = fb;
                    edges[i].Room1.addNeighbor(edges[i].Room2);
                    edges[i].Room2.addNeighbor(edges[i].Room1);
                }
            }
        };

        //Tools
        Generator.prototype.gcd = function (a, b) {
            if (a < b) {
                a = a + b;
                b = a - b;
                a = a - b;
            }
            if (a % b == 0) {
                return b;
            }
            return this.gcd(b, a % b);
        };

        Generator.prototype.generateRoomInCircle = function (id, r) {
            var t = Math.random();
            t = 2 * Math.PI * t;
            r = Math.random() * r;
            var w = Math.round(this.minLengthOfRoom + Math.random() * (this.maxLengthOfRoom - this.minLengthOfRoom)) * this.tilePixel;
            var h = Math.round(this.minLengthOfRoom + Math.random() * (this.maxLengthOfRoom - this.minLengthOfRoom)) * this.tilePixel;
            var newRoom = new MapGenerate.Room(id, Math.cos(t) * r, Math.sin(t) * r, w, h);
            return newRoom;
        };

        Generator.prototype.father = function (x) {
            if (x == this.root[x])
                return x;
            return this.root[x] = this.father(this.root[x]);
        };
        return Generator;
    })();
    MapGenerate.Generator = Generator;
})(MapGenerate || (MapGenerate = {}));
/// <reference path="Generator.ts" />
var a;
a = document.createElement("canvas");
var context = a.getContext("2d");
a.width = 3000;
a.height = 3000;
document.body.appendChild(a);
var b = new MapGenerate.Generator();
b.stepOneGenerateRooms(100);
b.stepTwoDisperseRooms();
b.stepThreeFindMainRoom();
b.stepFourKruskal();
console.log(b.roomList);

context.clearRect(0, 0, a.width, a.height);

for (var i = 0; i < b.roomList.length; i++) {
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(b.roomList[i].x + a.width / 2 - b.roomList[i].width / 2, b.roomList[i].y + a.height / 2 - b.roomList[i].height / 2);
    context.lineTo(b.roomList[i].x + a.width / 2 - b.roomList[i].width / 2, b.roomList[i].y + a.height / 2 + b.roomList[i].height / 2);
    context.lineTo(b.roomList[i].x + a.width / 2 + b.roomList[i].width / 2, b.roomList[i].y + a.height / 2 + b.roomList[i].height / 2);
    context.lineTo(b.roomList[i].x + a.width / 2 + b.roomList[i].width / 2, b.roomList[i].y + a.height / 2 - b.roomList[i].height / 2);
    context.lineTo(b.roomList[i].x + a.width / 2 - b.roomList[i].width / 2, b.roomList[i].y + a.height / 2 - b.roomList[i].height / 2);
    context.stroke();
}

for (var i = 0; i < b.mainRoomList.length; i++) {
    context.beginPath();
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.moveTo(b.mainRoomList[i].x + a.width / 2 - b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 - b.mainRoomList[i].height / 2);
    context.lineTo(b.mainRoomList[i].x + a.width / 2 - b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 + b.mainRoomList[i].height / 2);
    context.lineTo(b.mainRoomList[i].x + a.width / 2 + b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 + b.mainRoomList[i].height / 2);
    context.lineTo(b.mainRoomList[i].x + a.width / 2 + b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 - b.mainRoomList[i].height / 2);
    context.lineTo(b.mainRoomList[i].x + a.width / 2 - b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 - b.mainRoomList[i].height / 2);
    context.stroke();
}

for (var i = 0; i < b.mainRoomList.length; i++) {
    for (var j = 0; j < b.mainRoomList[i].neighbor.length; j++) {
        context.beginPath();
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.moveTo(b.mainRoomList[i].x + a.width / 2, b.mainRoomList[i].y + a.height / 2);
        context.lineTo(b.mainRoomList[i].neighbor[j].x + a.width / 2, b.mainRoomList[i].neighbor[j].y + a.height / 2);
        context.stroke();
    }
}
