/// <reference path="Room.ts" />
module MapGenerate{
    export class Edge{
        Room1:Room;
        Room2:Room;
        sqrDis:number;
        constructor(Room1:Room,Room2:Room){
            this.Room1 =Room1;
            this.Room2 = Room2;
            this.sqrDis = (Room1.x - Room2.x) * (Room1.x - Room2.x) + (Room1.y - Room2.y) * (Room1.y - Room2.y); 
        }
    }
}