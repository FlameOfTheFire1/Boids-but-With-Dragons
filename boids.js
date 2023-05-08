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
        this.giveVector();
        this.heading = 0; //heading starts at 0 degrees
        this.referenceV = [0,1];
        this.bk_img = null;
    }

    updateAngle(){ /*face palm-  remember canvas is not setup like standard x, y graph, there are no quadrants though you can have negative vectors . . . */
        //could try to determine what "quadrant" the vector would be in and then use this to determine whether to rotate clockwise or counterclockwise

        if(this.v[1] >= 0) //current vector is located in I or II quadrant (y is positive)
        {
            console.log("currently in quadrant I or II");
            this.referenceV = [this.v[0], 1]; //put the reference vector tail to tail with velocity vector
            this.heading = Math.acos((this.referenceV[0]*this.v[0] + 1*this.v[1])/(Math.sqrt((this.referenceV[0] * this.referenceV[0])+ 1) * Math.sqrt((this.v[0]*this.v[0])+(this.v[1]*this.v[1]))));
            console.log("rotate " + this.heading + " radians ");
            this.heading = (this.heading * 180.0) / Math.PI;
            console.log("rotate " + this.heading + " degrees ");
        }
        else //current vector is located in III or IV quadrant (y is negative)
        {
            console.log("currently in quadrant III or IV");
            this.referenceV = [this.v[0], -1];
            this.heading = Math.acos((this.referenceV[0]*this.v[0] + (-1)*this.v[1])/(Math.sqrt((this.referenceV[0] * this.referenceV[0])+ 1) * Math.sqrt((this.v[0]*this.v[0])+(this.v[1]*this.v[1]))));
            console.log("rotate " + this.heading + " radians ");
            this.heading = (this.heading * 180.0) / Math.PI;
            console.log("rotate " + this.heading + " degrees ");
        }

    }
    

    //add vector b's xy velocities to vector a's
    addVector(va, vb){
        va[0] = va[0] + vb[0];
        va[1] = va[1] + vb[1];
    }

    updatePosition(){
        this.x_y[0] = this.x_y[0] + this.v[0];
        this.x_y[1] = this.x_y[1] + this.v[1];
    }

    giveVector(){
        this.v = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)];
        this.updateAngle();
        //this.v[1] = Math.floor(Math.random() * 100);
    }

    collideWithWall(){
        this.v[0] = -1 * Math.floor(Math.random() * 100);
        this.v[1] = -1*Math.floor(Math.random() * 100);
        this.updateAngle();
        //this.v[0] = -1 * Math.sign(this.v[0])*Math.floor(Math.random() * 100);
        //this.v[1] = -1* Math.sign(this.v[1])*Math.floor(Math.random() * 100);
        //this.v[0] = -1 * this.v[0];
        //this.v[1] = -1 * this.v[1];
        //console.log("here");
        //console.log(v[0]);
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

        this.ctx.translate(this.x_y[0], this.x_y[1]); //change the origin to the center of where the previous image was on the canvas
        this.ctx.rotate(this.heading); //rotate the canvas by the previous heading
        this.bk_img = this.ctx.getImageData(this.x_y[0], this.x_y[1], parseInt(screen.width/4), parseInt(screen.height/4));
        this.ctx.putImageData(this.bk_img, this.x_y[0], this.x_y[1]);

        this.updatePosition();

        if(this.x_y[0] > window.innerWidth || this.x_y[1] > window.innerHeight)
        {
            this.collideWithWall(); //give random negative vector to flip around
        }
        if(this.x_y[0] < 0 || this.x_y[1] < 0)
        {
            //this.giveVector();  //give random positive vector to flip the other direction
            this.giveVector();
        }

        
        //this.updateAngle();
        //this.img.style.transform = 'rotate(' + this.heading + ')';

        //this.ctx.save();
        //this.ctx.translate(this.x_y[0], this.x_y[1]);
        //this.ctx.rotate(this.heading);
        //this.ctx.translate(-1*parseInt(this.img.height), -1*parseInt(((this.img.width * this.frame_counter)/24)/2));
        
        this.ctx.translate(this.x_y[0], this.x_y[1]); //change the origin to the center of where the image will be placed on the canvas
        this.ctx.rotate(this.heading); //rotate the canvas by the heading
        //this.bk_img = this.ctx.getImageData(this.x_y[0], this.x_y[1], parseInt(screen.width/4), parseInt(screen.height/4));
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
        this.ctx.rotate(-1*this.heading);
        this.ctx.translate(-1*this.x_y[0], -1*this.x_y[1]);
        //this.ctx.restore();
    }

    
    drawBack(){
        this.bk_img.onload = function() {
        //this.ctx.putImageData(this.bk_img, this.x_y[0], this.x_y[1]);
        }
    }
    
}

var context = screen.getContext("2d");
var s = new sprite('dragon_FLY_NO_SHADOW_green.png', 6,11,96,96,96,2304, context);
var last_animation_time = new Date().getTime();
var time_delta = 150;
var bk_img = null;

s.img.onload = function() {

function call_me_on_draw() {
    window.requestAnimationFrame(call_me_on_draw);

    if ((time_delta + last_animation_time) > new Date().getTime()) {

        return;

    }

    console.log("past time delta");

    last_animation_time = new Date().getTime();

    //var context = screen.getContext("2d");

    //if (bk_img != null) {

        //context.putImageData(bk_img, s.x_y[0], s.x_y[1]);
        //s.drawBack();

    //}

    
    //bk_img = context.getImageData(s.x_y[0], s.x_y[1], parseInt(screen.width/4), parseInt(screen.height/4));

    s.draw(context);

}
call_me_on_draw();

};