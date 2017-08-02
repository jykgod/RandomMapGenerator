class Generator{
    roomList:Room[];
    tilePixel:number = 16;
    minLengthOfRoom:number = 8;
    maxLengthOfRoom:number = 28;
    stepOneGenerateRooms(r:number){
        
    }

    generateAPointInCircle(id:number,r:number):Room{
        var t:number = Math.random();
        t = 2 * Math.PI * t;
        r = Math.random() * r;
        var w = Math.round(this.minLengthOfRoom + Math.random() * (this.maxLengthOfRoom - this.minLengthOfRoom)) * this.tilePixel;
        var h = Math.round(this.minLengthOfRoom + Math.random() * (this.maxLengthOfRoom - this.minLengthOfRoom)) * this.tilePixel;
        var newRoom = new Room(id,Math.cos(t) * r,Math.sin(t) * r,w,h);
        return newRoom;
    }
}