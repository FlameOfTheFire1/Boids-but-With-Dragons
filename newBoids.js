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
        this.x_y = [100,100];
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
        //this.heading = 0; //heading starts at 0 degrees
        this.referenceV = [0,1];
        this.bk_img = new Image();
        this.refN = [0,1];
        this.refS = [0,-1];
        this.refE = [1, 0];
        this.refW = [-1, 0];
        this.bk_img.src = "https://storage.googleapis.com/pai-images/c155138152e9452aac7afaffad655039.jpeg";
    }

    updateAngle(){ 

        if(this.v[1] >= 0){
            //all vectors headed in an  upwards direction
            console.log("vector is " + this.v[0] + "," + this.v[1]);
            this.heading = Math.atan(this.v[1]/this.v[0]);
            console.log("calculated angle is in QI or QII and is " + this.heading + " radians");
            if(this.v[0] >= 0){ //angle in QI
                //do nothing, rotate clockwise
                this.heading = this.heading + Math.PI/2;
                console.log("QI");
            }
            else{ //angle in QII
                //rotate counter clockwise
                //this.heading = -this.heading;
                console.log("QII");
            }

            console.log("FINAL calculated angle is in QI or QII and is " + this.heading + " radians");
        }
        else //vector points downwards in QIII or QIV
        {
            this.heading = Math.atan(this.v[1]/this.v[0]);
            console.log("calculate angle is in QIII or QIV and is " + (this.heading * (Math.PI/180)) + " degrees.");
            if(this.v[0] >= 0) //QIII
            {
                this.heading = this.heading + Math.PI; //rotate 90 degrees clockwise plus calculated angle
                console.log("QIII");
            }

            if(this.v[0] < 0)
            {
                this.heading = this.heading + 1.5 * Math.PI;
                console.log("QIV");
            }
        }

        /*
        if(this.v[1] >= 0) //current vector is located in I or II quadrant (y is positive)
        {
            console.log("currently in quadrant I or II");
            this.referenceV = [this.v[0], 1]; //put the reference vector tail to tail with velocity vector
            this.heading = Math.acos((this.referenceV[0]*this.v[0] + 1*this.v[1])/(Math.sqrt((this.referenceV[0] * this.referenceV[0])+ 1) * Math.sqrt((this.v[0]*this.v[0])+(this.v[1]*this.v[1]))));
            console.log("rotate " + this.heading + " radians ");
            this.heading = (this.heading * 180.0) / Math.PI;
            console.log("rotate " + this.heading + " degrees ");

            if(){ //clockwise rotation needed

            }
            else{ //counter clockwise rotation needed

            }
        }
        else //current vector is located in III or IV quadrant (y is negative)
        {
            console.log("currently in quadrant III or IV");
            this.referenceV = [this.v[0], -1];
            this.heading = Math.acos((this.referenceV[0]*this.v[0] + (-1)*this.v[1])/(Math.sqrt((this.referenceV[0] * this.referenceV[0])+ 1) * Math.sqrt((this.v[0]*this.v[0])+(this.v[1]*this.v[1]))));
            console.log("rotate " + this.heading + " radians ");
            this.heading = (this.heading * 180.0) / Math.PI;
            console.log("rotate " + this.heading + " degrees ");
        }*/

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
        this.v = [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1];
        this.updateAngle();
        //this.v[1] = Math.floor(Math.random() * 100);
    }

    giveEndPt(){
        this.v0 = [x_y[0] + v[0], x_y[1] + v[1]];
    }

    collideWithWall(){
        this.v[0] = -1 * (Math.floor(Math.random() * 10) + 1);
        this.v[1] = -1* (Math.floor(Math.random() * 10) + 1);
        this.updateAngle();
        //this.v[0] = -1 * Math.sign(this.v[0])*Math.floor(Math.random() * 100);
        //this.v[1] = -1* Math.sign(this.v[1])*Math.floor(Math.random() * 100);
        //this.v[0] = -1 * this.v[0];
        //this.v[1] = -1 * this.v[1];
        //console.log("here");
        //console.log(v[0]);
    }

    draw(){

        if(this.frame_counter < this.sheetBounds[1])
        {
            this.frame_counter++;
        }  
        else
        {
            this.frame_counter = this.sheetBounds[0];
        }

        this.updatePosition();

        if(this.x_y[0] > window.innerWidth || this.x_y[1] > window.innerHeight)
        {
            this.collideWithWall(); //give random negative vector to flip around
        }
        if(this.x_y[0] < 0 || this.x_y[1] < 0)
        {
            this.giveVector();
        }

        this.ctx.clearRect(0,0,screen.width, screen.height);
        this.ctx.drawImage(this.bk_img, 0, 0, screen.width, screen.height);
        //this.heading = this.heading + 0.01;     
        
        this.ctx.translate(this.x_y[0], this.x_y[1]); //change the origin to the center of where the image will be placed on the canvas
        console.log("rotating by " + this.heading);
        this.ctx.rotate(this.heading); //rotate the canvas by the heading
        this.ctx.drawImage(
            this.img,
            parseInt((this.img.width * this.frame_counter)/24),
            0,
            this.sh_w[1], //width
            this.img.height,
            -48,
            -48,
            parseInt(screen.width/6),
            parseInt(screen.height/6)
            );

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    }
    
}

var context = screen.getContext("2d");
var spr = [];
//for(var i = 0; i < 4; i++)
//{
 //   spr[i] = new sprite('dragon_FLY_NO_SHADOW_green.png', 6,11,96,96,96,2304, context);
//}
var s = new sprite('dragon_FLY_NO_SHADOW_green.png', 6,11,96,96,96,2304, context);
s.giveVector();
var p = new sprite('dragon_FLY_NO_SHADOW_green.png', 11,17,96,96,96,2304, context);
var last_animation_time = new Date().getTime();
var time_delta = 100;
var bk_img = null;

p.img.onload = function() {

function call_me_on_draw() {
    window.requestAnimationFrame(call_me_on_draw);

    if ((time_delta + last_animation_time) > new Date().getTime()) {

        return;

    }

    console.log("past time delta");

    last_animation_time = new Date().getTime();

    //context.clearRect(0,0,screen.width, screen.height);
    
    //for(var i = 0; i < 4; i++)
    //{
      //  spr[i].draw(context);
       // console.log("drawing sprite " + (i+1));
    //}
    s.draw();
    console.log("sprite s has velocity " +  s.v[0] + "," + s.v[1]);
    //p.giveVector();
    p.draw();
    console.log("sprite p has velocity " +  p.v[0] + "," + p.v[1]);

}
call_me_on_draw();

};