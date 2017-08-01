class Room{
    id:number;
    x:number;
    y:number;
    width:number;
    height:number;
    neighbor:number[];

    constructor(id:number,x:number,y:number,width:number,height:number){
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    addNeighbor(id:number){
        this.neighbor.push(id);
    }

    print(){
        console.log("x:" + this.x + ";y:" + this.y + ";width:" + this.width+";height:" + this.height);
    }
}