/// <reference path="Generator.ts" />
var a: HTMLCanvasElement;
a = <HTMLCanvasElement>document.createElement("canvas");
var context = a.getContext("2d");
a.width = 3000;
a.height = 3000;
document.body.appendChild(a);
var b: MapGenerate.Generator = new MapGenerate.Generator();
b.stepOneGenerateRooms(100);
b.stepTwoDisperseRooms();
b.stepThreeFindMainRoom();
b.stepFourKruskal();
console.log(b.roomList);

context.clearRect(0, 0, a.width, a.height);
//context.fillStyle = "#0000ff";
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
    context.strokeStyle = "red"
    context.lineWidth = 2;
    context.moveTo(b.mainRoomList[i].x + a.width / 2 - b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 - b.mainRoomList[i].height / 2);
    context.lineTo(b.mainRoomList[i].x + a.width / 2 - b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 + b.mainRoomList[i].height / 2);
    context.lineTo(b.mainRoomList[i].x + a.width / 2 + b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 + b.mainRoomList[i].height / 2);
    context.lineTo(b.mainRoomList[i].x + a.width / 2 + b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 - b.mainRoomList[i].height / 2);
    context.lineTo(b.mainRoomList[i].x + a.width / 2 - b.mainRoomList[i].width / 2, b.mainRoomList[i].y + a.height / 2 - b.mainRoomList[i].height / 2);
    context.stroke();
}

for (var i = 0; i < b.mainRoomList.length; i++) {
    for(var j =0;j<b.mainRoomList[i].neighbor.length;j++){
        context.beginPath();
        context.strokeStyle = "red"
        context.lineWidth = 2;
        context.moveTo(b.mainRoomList[i].x + a.width / 2, b.mainRoomList[i].y + a.height / 2);
        context.lineTo(b.mainRoomList[i].neighbor[j].x + a.width / 2, b.mainRoomList[i].neighbor[j].y + a.height / 2);
        context.stroke();
    }
}
