/// <reference path="Room.ts" />
/// <reference path="Edge.ts" />
module MapGenerate {
    export class Generator {
        roomList: Room[];
        mainRoomList: Room[];
        tilePixel: number = 16;
        minLengthOfRoom: number = 8;
        maxLengthOfRoom: number = 28;
        mainRoomSize: number = 15;
        roomNumbers: number = 20;
        radius: number = 50;
        root: number[];
        stepOneGenerateRooms(r: number) {
            this.roomList = new Array();
            for (var i = 0; i < this.roomNumbers; i++) {
                this.roomList.push(this.generateRoomInCircle(i, this.radius));
            }
        }

        stepTwoDisperseRooms() {
            this.roomList.sort((a, b) => {
                return a.getSqrDistanceToCenter() - b.getSqrDistanceToCenter();
            });
            for (var i: number = 0; i < this.roomList.length; i++) {
                for (var j: number = 0; j < i; j++) {
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
                        var dis: number = this.roomList[i].getDistanceToCenter();
                        var dx: number = this.roomList[i].x / dis;
                        var dy: number = this.roomList[i].y / dis;
                        console.log("dx:" + dx + ";dy:" + dy);
                        // var k: number = 0;
                        var flag: boolean = false;
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
                            //这里其实能优化，就在之前的计算中如果roomA和roomB没有相交了，那么移动之后也不会再相交了，可以不用重复判断。
                            for (var j: number = 0; j < i; j++) {
                                if (this.roomList[i].inCollisionWithOtherRoom(this.roomList[j])) {
                                    flag = true;
                                    break;
                                }
                            }
                            // k = (k + 1) % (gx + gy);
                        } while (flag);
                    }
                }
            }
        }

        stepThreeFindMainRoom() {
            this.mainRoomList = new Array();
            for (var i: number = 0; i < this.roomList.length; i++) {
                if (this.roomList[i].width >= this.mainRoomSize * this.tilePixel && this.roomList[i].height >= this.mainRoomSize * this.tilePixel) {
                    this.mainRoomList.push(this.roomList[i]);
                }
            }
        }

        stepFourKruskal() {
            var edges: Edge[];
            edges = new Array();
            for (var i: number = 0; i < this.mainRoomList.length; i++) {
                for (var j: number = 0; j < i; j++) {
                    edges.push(new Edge(this.mainRoomList[i], this.mainRoomList[j]));
                }
            }
            edges.sort((a, b) => {
                return a.sqrDis - b.sqrDis;
            });
            this.root = new Array();
            for (var i: number = 0; i < this.mainRoomList.length; i++) {
                this.mainRoomList[i].id = i;
                this.root[i] = i;
            }
            for (var i: number = 0; i < edges.length; i++) {
                var fa = this.father(edges[i].Room2.id);
                var fb = this.father(edges[i].Room1.id);
                if(fa !=fb){
                    this.root[fa] = fb;
                    edges[i].Room1.addNeighbor(edges[i].Room2);
                    edges[i].Room2.addNeighbor(edges[i].Room1);
                }
            }
        }

        //Tools

        gcd(a: number, b: number): number {
            if (a < b) {
                a = a + b;
                b = a - b;
                a = a - b;
            }
            if (a % b == 0) {
                return b;
            }
            return this.gcd(b, a % b);
        }

        generateRoomInCircle(id: number, r: number): Room {
            var t: number = Math.random();
            t = 2 * Math.PI * t;
            r = Math.random() * r;
            var w = Math.round(this.minLengthOfRoom + Math.random() * (this.maxLengthOfRoom - this.minLengthOfRoom)) * this.tilePixel;
            var h = Math.round(this.minLengthOfRoom + Math.random() * (this.maxLengthOfRoom - this.minLengthOfRoom)) * this.tilePixel;
            var newRoom = new Room(id, Math.cos(t) * r, Math.sin(t) * r, w, h);
            return newRoom;
        }

        father(x: number): number {
            if (x == this.root[x]) return x;
            return this.root[x] = this.father(this.root[x]);
        }
    }
}