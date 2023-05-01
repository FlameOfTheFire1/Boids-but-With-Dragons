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
        this.x_y = [10,20];
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

        if(this.frame_counter < this.sheetBounds[1])
        {
            this.frame_counter++;
        }  
        else
        {
            this.frame_counter = this.sheetBounds[0];
        }

        //console.log("frame counter" + this.frame_counter);
        //console.log(parseInt((this.img.width * this.frame_counter)/24));
        //console.log(parseInt((this.img.width * (this.frame_counter + 2 - 1))/24));
        //console.log(parseInt(screen.height/4));

        ctx.drawImage(
            this.img,
            parseInt((this.img.width * this.frame_counter)/24),
            0,
            this.sh_w[1],
            this.img.height,
            this.x_y[0],
            this.x_y[1],
            parseInt(screen.width/4),
            parseInt(screen.height/4)
            );
    }
}

var context = screen.getContext("2d");
var s = new sprite('dragon_FLY_NO_SHADOW_green.png', 6,11,96,96,96,2304, context);
var last_animation_time = new Date().getTime();
var time_delta = 150;
var bk_img = null;

s.img.onload = function() {
    //console.log("spritesheet loaded");

    //s.draw(context);

//console.log("spritesheet drawn");

function call_me_on_draw() {
    window.requestAnimationFrame(call_me_on_draw);

    if ((time_delta + last_animation_time) > new Date().getTime()) {

        return;

    }

    console.log("past time delta");

    last_animation_time = new Date().getTime();

    if (bk_img != null) {

        context.putImageData(bk_img, s.x_y[0], s.x_y[1]);

    }

    
    bk_img = context.getImageData(s.x_y[0], s.x_y[1], parseInt(screen.width/4), parseInt(screen.height/4));

    s.draw(context);

}
call_me_on_draw();

};