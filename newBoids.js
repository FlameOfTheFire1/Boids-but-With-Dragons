//get canvas, context, and draw background image
let screen = document.getElementById("screen");
var context = screen.getContext("2d");
var bk_img = new Image();
bk_img.src = "https://storage.googleapis.com/pai-images/c155138152e9452aac7afaffad655039.jpeg";
bk_img.onload = function(){
      context.drawImage(bk_img, 0, 0, screen.width, screen.height);
}


//resize canvas
window.addEventListener("resize", resizeCanvas, false)
        function resizeCanvas() {
            screen.width = window.innerWidth;
            screen.height = window.innerHeight;
            context.drawImage(bk_img, 0, 0, screen.width, screen.height);
        }
        resizeCanvas();


class sprite{

    constructor(spriteSheet, amin, amax, s_height, s_width, ss_height, ss_width, context){
        this.offscreen = new OffscreenCanvas(window.innerWidth, window.innerHeight);
        this.url = spriteSheet;
        this.x_y = [Math.floor(Math.random() * (window.innerWidth - 100) + 50), Math.floor(Math.random() * (window.innerHeight - 100)+ 50)];
        this.sh_w = [s_height,s_width];
        this.sheetBounds = [amin,amax];
        this.frame_counter = amin;
        this.sheet_hxw = [ss_height,ss_width];
        this.img = new Image();
        this.img.src = spriteSheet;
        this.animation = [];
        this.velocity = [1,1];
        this.ctx = this.offscreen.getContext("2d");
        this.giveVector();
        //this.heading = 0; //heading starts at 0 degrees
        this.referenceV = [0,1];
        //this.bk_img = new Image();
        this.refN = [0,1];
        this.refS = [0,-1];
        this.refE = [1, 0];
        this.refW = [-1, 0];
        this.sp_lim = [10,10];
        this.al_v = [0,0];
        //this.bk_img.src = "https://storage.googleapis.com/pai-images/c155138152e9452aac7afaffad655039.jpeg";
    }

    updateAngle(){ 

        if(this.v[1] >= 0){
            //all vectors headed in an  upwards direction
            //console.log("vector is " + this.v[0] + "," + this.v[1]);
            this.heading = Math.atan(this.v[1]/this.v[0]);
            //console.log("calculated angle is in QI or QII and is " + this.heading + " radians");
            if(this.v[0] >= 0){ //angle in QI
                //do nothing, rotate clockwise
                this.heading = this.heading + Math.PI/2;
                //console.log("QI");
            }//
            else{ //angle in QII
                //rotate counter clockwise
                //this.heading = -this.heading;
                //console.log("QII");
            }

            //console.log("FINAL calculated angle is in QI or QII and is " + this.heading + " radians");
        }
        else //vector points downwards in QIII or QIV
        {
            this.heading = Math.atan(this.v[1]/this.v[0]);
            //console.log("calculate angle is in QIII or QIV and is " + (this.heading * (Math.PI/180)) + " degrees.");
            if(this.v[0] >= 0) //QIII
            {
                this.heading = this.heading + Math.PI; //rotate 90 degrees clockwise plus calculated angle
                //console.log("QIII");
            }

            if(this.v[0] < 0)
            {
                this.heading = this.heading + 1.5 * Math.PI;
                //console.log("QIV");
            }
        }

    }
    
    stop(){
        this.v = [0,0];
    }

    speedLimit(){
        if(this.v[0] > this.sp_lim[0], this.v[1] > this.sp_lim[1])
        {
            this.v = [(this.v[0]/Math.abs(this.v[0])) * this.sp_lim[0], (this.v[1]/Math.abs(this.v[1])) * this.sp_lim[1]];
        }
    }

    updatePosition(){
        this.v[0] = this.v[0] + this.coh_v[0]; + this.sep_v[0] + this.al_v[0];
        this.v[1] = this.v[1] + this.coh_v[1]; + this.sep_v[1] + this.al_v[1];
        this.updateAngle();
        //this.speedLimit();
        console.log("velocity in updatepos is " + this.v[0] + "," + this.v[1]);
        //this.v = this.v2;

        this.x_y[0] = this.x_y[0] + this.v[0];
        this.x_y[1] = this.x_y[1] + this.v[1];
    }

    giveVector(){
        this.v = [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1];
        this.v2 = this.v;
        this.updateAngle();
    }

    collideWithWall(){
        this.v[0] = -1 * (Math.floor(Math.random() * 5) + 1);
        this.v[1] = -1* (Math.floor(Math.random() * 5) + 1);
        this.v2 = this.v;
        this.updateAngle();
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

        this.ctx.width = window.innerWidth;
        this.ctx.height = window.innerHeight;

        this.ctx.clearRect(0,0,screen.width, screen.height);
        //this.ctx.drawImage(this.bk_img, 0, 0, screen.width, screen.height);
        //this.heading = this.heading + 0.01;     
        
        this.ctx.translate(this.x_y[0], this.x_y[1]); //change the origin to the center of where the image will be placed on the canvas
        //console.log("rotating by " + this.heading);
        this.ctx.rotate(this.heading); //rotate the canvas by the heading
        this.ctx.drawImage(
            this.img,
            parseInt((this.img.width * this.frame_counter)/24),
            0,
            this.sh_w[1], //width
            this.img.height,
            -48,
            -48,
            parseInt(screen.width/8),
            parseInt(screen.height/8)
            );

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    }
    
    
    cohesion(i, sprs, num){ //figure sprite offset vector for cohesion
        //calulate the average center position of all sprites (minus the center sprite)
        var sum = [0,0];

        //add the positions of all other sprites
        for(var j = 0; j < num; j++)
        {
            if(j != i)
            {
                sum[0] = sum[0] + sprs[j].x_y[0]; //get the sum of all positions of all but center sprite
                sum[1] = sum[1] + sprs[j].x_y[1]; 
            }
        }
        
        this.rel_center = [sum[0]/(num - 1), sum[1]/(num - 1)]; //average position

        this.coh_v = [(this.rel_center[0] - this.x_y[0])/1000, (this.rel_center[1] - this.x_y[1])/1000];//offset vector for cohesion
    }

    separation(i, sprs, num) //calculate separation vector offset for sprite
    {
        this.sep_v = [0,0];

        for(var j = 0; j < num; j++) //compare to all other sprites
        {
            if(j != i)
            {
                //this.sep_v = [(this.sep_v[0] - (sprs[j].x_y[0] - this.x_y[0])), (this.sep_v[1] - (sprs[j].x_y[1] - this.x_y[1]))];
                if(Math.abs(sprs[j].x_y[0] - this.x_y[0]) < 200 || Math.abs(sprs[j].x_y[1] - this.x_y[1]) < 200) //if any sprites are too close
                {
                    //console.log((sprs[j].x_y[0] - this.x_y[0]) + "+" + (sprs[j].x_y[1] - this.x_y[1]));
                    this.sep_v = [(this.sep_v[0] - (sprs[j].x_y[0] - this.x_y[0])), (this.sep_v[1] - (sprs[j].x_y[1] - this.x_y[1]))]; //get vector offset
                    //console.log("sep_v " + this.sep_v[0] + "," + this.sep_v[1]);
                }
            }
        }
        this.sep_v = [this.sep_v[0]*0.6, this.sep_v[1]*0.6];
        console.log("sep_v " + this.sep_v[0] + "," + this.sep_v[1]);
    }

    alignment(i, sprs, num){
        this.al_v[0,0];

        for(var j = 0; j< num; j++)
        {
            if(i != j)
            {
                this.al_v = [this.al_v[0] + sprs[j].v[0], this.al_v[1] + sprs[j].v[1]];
            }
        }
        this.al_v = [this.al_v[0]/(num - 1), this.al_v[1]/(num - 1)];
        this.al_v = [(this.al_v[0] - this.v[0]/8), (this.al_v[0] - this.v[1]/8)];
    }
}




const num_spr = 10;
var spr = [];
for(var i = 0; i < num_spr; i++)
{
   spr[i] = new sprite('dragon_FLY_NO_SHADOW_green.png', 6,11,96,96,96,2304, context);
}
//var s = new sprite('dragon_FLY_NO_SHADOW_green.png', 6,11,96,96,96,2304, context);
//s.x_y = [400,400];

//s.giveVector();
//var p = new sprite('dragon_FLY_NO_SHADOW_green.png', 6,11,96,96,96,2304, context);
//p.velocity = [0,0];
//p.x_y = [400,400];
//p.stop();
var last_animation_time = new Date().getTime();
var time_delta = 90;
//var bk_img = null;
//js .then create func as async func
spr[num_spr-1].img.onload = function() {

function call_me_on_draw() {
    window.requestAnimationFrame(call_me_on_draw);

    if ((time_delta + last_animation_time) > new Date().getTime()) {

        return;

    }

    console.log("past time delta");

    last_animation_time = new Date().getTime();

    context.clearRect(0,0,screen.width, screen.height);
    context.drawImage(bk_img, 0, 0, screen.width, screen.height);

    for(var j = 0; j < num_spr; j++){

        if(j == 0){
            console.log("sprite 0's position is " + spr[j].x_y[0] +  "," + spr[j].x_y[1]);
            //console.log("sprite 0's velocity is " + spr[j].v[0] +  "," + spr[j].v[1]);
        }

        spr[j].cohesion(j, spr, num_spr);
        spr[j].separation(j, spr, num_spr);
        spr[j].alignment(j, spr, num_spr);
        spr[j].draw();
        context.drawImage(spr[j].offscreen, 0, 0);
    }
    
    //s.draw();
    //context.drawImage(s.offscreen, 0, 0);
    //console.log("sprite s has velocity " +  s.v[0] + "," + s.v[1] + " and is at " + s.x_y[0] + "," + s.x_y[1]);
    //p.giveVector();
    //p.draw();
    //context.drawImage(p.offscreen, 0, 0);
    //console.log("sprite p has velocity " +  p.v[0] + "," + p.v[1] + " and is at " + p.x_y[0] + "," + p.x_y[1]);

}
call_me_on_draw();

};