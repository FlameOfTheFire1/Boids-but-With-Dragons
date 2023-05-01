let screen = document.getElementById("screen");

//spriteCanvas.style = "display: none";

window.addEventListener("resize", resizeCanvas, false)
        function resizeCanvas() {
            screen.width = window.innerWidth;
            screen.height = window.innerHeight;
            //if (init_size) {
              //  init_size = false;
                //return;
            //}
            //for (var i = 0; i < agents.length; i++) {
              //  agents[i].canvas_resize();
            //}
        }
        resizeCanvas();



class sprite{
    //img = new image();

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

    getAnimation(){
        for(var i = this.amin, j = 0; i < this.amax; i++, j++)
        {
            image = new image();
            animation[j] = image;
        }
    }
    /*getImage(rectangle){
        //rips the correct frame from the spritesheet
        if(this.frame_counter <= this.sheetBounds[1])
        {
            this.frame_counter++;
        }  
        else
        {
            this.frame_counter = this.sheetBounds[0];
        }

        
        return image;
    }*/

    draw(ctx){

        if(this.frame_counter <= this.sheetBounds[1])
        {
            this.frame_counter++;
        }  
        else
        {
            this.frame_counter = this.sheetBounds[0];
        }

        //this.img = new Image();
        //this.img.src = this.url;

        ctx.drawImage(
            this.img,
            0,
            0,
            (this.img.width * this.frame_counter)/22,
            this.img.height,
            10,
            20,
            screen.width/4,
            screen.height/4
            );
    }
}

//var spriteSheetURL = 'dragon_FLY_NO_SHADOW_green.png';
// create a new image from the spritesheet
//var image = new Image();
//image.src = spriteSheetURL;
//image.crossOrigin = true;
// once the spritesheet loads,
// draw it on the canvas

var s = new sprite('dragon_FLY_NO_SHADOW_green.png', 0,6,96,96,96,2112);
var context = screen.getContext("2d");

//s.img.onload = function() {
    console.log("spritesheet loaded");

    s.draw(context);

console.log("spritesheet drawn");
//};