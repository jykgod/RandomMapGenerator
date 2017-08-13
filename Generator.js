/// <reference path="Room.ts" />
/// <reference path="Edge.ts" />
var MapGenerate;
(function (MapGenerate) {
    var Generator = (function () {
        function Generator() {
            this.tilePixel = 16;
            this.minLengthOfRoom = 8;
            this.maxLengthOfRoom = 28;
            this.mainRoomSize = 60;
            this.roomNumbers = 100;
            this.radius = 50;
        }
        Generator.prototype.stepOneGenerateRooms = function (r) {
            for (var i = 0; i < this.roomNumbers; i++) {
                this.roomList[i] = this.generateRoomInCircle(i, this.radius);
            }
        };

        Generator.prototype.stepTwoDisperseRooms = function () {
            this.roomList.sort(function (a, b) {
                return a.getSqrDistanceToCenter() - b.getSqrDistanceToCenter();
            });
            for (var i = 0; i < this.roomList.length; i++) {
                for (var j = 0; j < i; j++) {
                    if (this.roomList[i].inCollisionWithOtherRoom(this.roomList[j])) {
                        var gcd = this.gcd(Math.abs(this.roomList[i].x), Math.abs(this.roomList[i].y));
                        var lcm = this.roomList[i].x * this.roomList[i].y / gcd;
                        var gy = lcm / this.roomList[i].x;
                        var gx = lcm / this.roomList[i].y;
                        var fx = gx / Math.abs(gx) * this.tilePixel;
                        var fy = gy / Math.abs(gy) * this.tilePixel;
                        gx = Math.abs(gx);
                        gy = Math.abs(gy);
                        var k = 0;
                        var flag = false;
                        do {
                            if (k < 2 * gx && k < 2 * gy) {
                                if (k % 2 == 0) {
                                    this.roomList[i].x += fx;
                                } else {
                                    this.roomList[i].y += fy;
                                }
                            } else {
                                if (gx > gy) {
                                    this.roomList[i].x += fx;
                                } else {
                                    this.roomList[i].y += fy;
                                }
                            }

                            for (var j = 0; j < i; j++) {
                                if (this.roomList[i].inCollisionWithOtherRoom(this.roomList[j])) {
                                    flag = true;
                                    return;
                                }
                            }
                            k = (k + 1) % (gx + gy);
                        } while(flag);
                    }
                }
            }
        };

        Generator.prototype.stepThreeFindMainRoom = function () {
            for (var i = 0; i < this.roomList.length; i++) {
                if (this.roomList[i].x >= this.mainRoomSize && this.roomList[i].y >= this.mainRoomSize) {
                    this.mainRoomList.push(this.roomList[i]);
                }
            }
        };

        Generator.prototype.stepFourKruskal = function () {
            var edges;
            for (var i = 0; i < this.mainRoomList.length; i++) {
                for (var j = 0; j < i; j++) {
                    edges.push(new MapGenerate.Edge(this.mainRoomList[i], this.mainRoomList[j]));
                }
            }
            edges.sort(function (a, b) {
                return a.sqrDis - b.sqrDis;
            });
            for (var i = 0; i < edges.length; i++) {
                edges[i].Room1.addNeighbor(edges[i].Room2);
                edges[i].Room2.addNeighbor(edges[i].Room1);
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
        return Generator;
    })();
    MapGenerate.Generator = Generator;
})(MapGenerate || (MapGenerate = {}));
