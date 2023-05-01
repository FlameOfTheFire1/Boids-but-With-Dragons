let screen = document.getElementById("screen");


window.addEventListener("resize", resizeCanvas, false)
        function resizeCanvas() {
            screen.width = window.innerWidth;
            screen.height = window.innerHeight;
        }
        resizeCanvas();



class sprite{

    constructor(spriteSheet, amin, amax, s_height, s_width, ss_height, ss_width, context){
        this.url = spriteSheet;
        this.x_y = [0,0];
        this.sh_w = [s_height,s_width];
        this.sheetBounds = [amin,amax];
        this.frame_counter = amin;
        this.sheet_hxw = [ss_height,ss_width];
        this.img = new Image();
        this.img.src = spriteSheet;
        this.animation = [];
        this.velocity = [1,1];
        this.ctx = context;
    }

    //add vector b's xy velocities to vector a's
    addVector(va, vb){
        va[0] = va[0] + vb[0];
        va[1] = va[1] + vb[1];
    }

    draw(ctx){

        if(this.frame_counter <= this.sheetBounds[1])
        {
            this.frame_counter++;
        }  
        else
        {
            this.frame_counter = this.sheetBounds[0];
        }

        console.log("here");
        console.log(parseInt((this.img.width * this.frame_counter)/22));
        console.log(parseInt(screen.width/4));
        console.log(parseInt(screen.height/4));

        ctx.drawImage(
            this.img,
            0,
            0,
            parseInt((this.img.width * this.frame_counter)/22),
            this.img.height,
            10,
            20,
            parseInt(screen.width/4),
            parseInt(screen.height/4)
            );
    }
}

var context = screen.getContext("2d");
var s = new sprite('dragon_FLY_NO_SHADOW_green.png', 0,6,96,96,96,2112);


s.img.onload = function() {
    console.log("spritesheet loaded");

    s.draw(context);

console.log("spritesheet drawn");
};