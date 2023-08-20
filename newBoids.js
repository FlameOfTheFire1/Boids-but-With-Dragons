//constants
var ROTATION = true; //turns off/on rotation
var COHESION = 1000; //effects how aggressively the sprites try to stay with each other
var SEPARATION = 0.6; //effects how aggressively sprites separate from each other
var ALIGNMENT = 8; //effects how aggressively the sprites will align their velocities
var num_spr = 2; //effects number of sprites
var SPEED = 2; //effects random speed at which the sprites start and bounce from walls
var time_delta = 2500; //effects the speed at which the sprite animation occurs

//get canvas, context, and draw background image
let screen = document.getElementById("screen");
var context = screen.getContext("2d");
var play = true;

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
        this.referenceV = [0,1];
        this.refN = [0,1];
        this.refS = [0,-1];
        this.refE = [1, 0];
        this.refW = [-1, 0];
        this.sp_lim = [10,10];
        this.al_v = [0,0];
        this.v0 = [0,0];
    }


    changeColor(color){

    }

    updateAngle(){ 

        if(this.v[1] >= 0){//vector is headed towards maximum hieght value of the screen.  
            this.heading = Math.atan(this.v[1]/this.v[0]);
            //this.heading = Math.abs(Math.atan(this.v[1]/this.v[0]));
            console.log("Initial calculated angle is " + (this.heading * (180/Math.PI)).toFixed(0));
            if(this.v[0] >= 0){ //angle in QI

                //this.heading = this.heading + Math.PI/2; //rotate angle + 45 degrees clockwise
                //this.heading = (Math.PI/2 - Math.abs(this.heading));
                this.heading = (Math.PI/2 + Math.abs(this.heading));
                console.log("Angle is in QI " + (this.heading * (180/Math.PI)).toFixed(0));
            }//
            else //QIII
            {
                this.heading = (this.heading - Math.PI/2);
                console.log("Angle is in QIII " + (this.heading * (180/Math.PI)).toFixed(0));
            }
            
            /*else{ //angle in QII
                //rotate counter clockwise
                this.heading = -(Math.PI/2 - Math.abs(this.heading));
                console.log("Angle is in QII " + (this.heading * (180/Math.PI)).toFixed(0)); //calculated angle is from negative x axis, so we wan tthe other angle formed from the 
                //pos y axis and the calculated angle.  the final angle should be negative or counterclockwise in direction from the pos y axis
            }*/

            //console.log("FINAL calculated angle is in QI or QII and is " + this.heading + " radians");
        }
        else //vector headed away from the max hieght of the screen
        {
            this.heading = Math.atan(this.v[1]/this.v[0]);
            //console.log("calculate angle is in QIII or QIV and is " + (this.heading * (Math.PI/180)) + " degrees.");
            /*
            if(this.v[0] >= 0) //QIII
            {
                this.heading = this.heading + Math.PI; //rotate 90 degrees clockwise plus calculated angle
                console.log("Angle is in QIII " + (this.heading * (180/Math.PI)).toFixed(0));
            }*/

            if(this.v[0] < 0)
            {
                //this.heading = this.heading + 1.5 * Math.PI; //rotate 90 + 45 degrees clockwise plus calculated anlge
                
                console.log("Angle is in QIV " + (this.heading * (180/Math.PI)).toFixed(0));
            }
            else
            {
                console.log("Angle is in QIV ");
            }
        }

    }
    
    stop(){
        this.v = [0,0];
    }

    //keeps the angle from changing too rapidly by limiting the change in direction of the vectors.
    angleLimit(){
        //if the sign of the vector flips, then it is an unnatural turn
        //cap the angle chang at no more than 30 degrees from the prior vector
        //to cap the angle change, limit the change in vector

        if(Math.sign(this.v0[0]) != Math.sign(this.v[0]) && Math.sign(this.v0[1]) != Math.sign(this.v[1])) //x and y sign change
        {
                this.v[0] = this.v1[0] + (Math.sign(this.v[0]) * this.v[0]) * 0.99;
                this.v[1] = this.v1[1] + (Math.sign(this.v[1]) * this.v[1]) * 0.99;
        }

        /*
        if(Math.sign(this.v0[0]) == Math.sign(this.v1[0])) //x sign change, instead of completely flipping around, decrease rapidly, hit zero and then increment
        {
            this.v[0] = this.v1[0] - Math.sign(this.v;
        }
        if(Math.sign(this.v0[1]) == Math.sign(this.v1[1])) //y sign change
        {

        }
        //if(change too great){

        
        //}*/
    }

    speedLimit(){
        if(this.v[0] > this.sp_lim[0], this.v[1] > this.sp_lim[1])
        {
            this.v = [(this.v[0]/Math.abs(this.v[0])) * this.sp_lim[0], (this.v[1]/Math.abs(this.v[1])) * this.sp_lim[1]];
        }
    }

    updatePosition(){

        //save prior vector
        console.log("velocity initial is " + (this.v[0]).toFixed(1) +  "," + (this.v[1]).toFixed(1));
        this.v0[0] = this.v[0];
        this.v0[1] = this.v[1];

        this.v[0] = this.v[0] + this.coh_v[0]; + this.sep_v[0] + this.al_v[0];
        this.v[1] = this.v[1] + this.coh_v[1]; + this.sep_v[1] + this.al_v[1];
        
        if(this.v[0] == 0.0) //keep vectors from hitting zero since the math cannot be computed
        {
            this.v[0] = 0.1
        }
        if(this.v[1] == 0.0)
        {
            this.v[1] = 0.1;
        } 

        //this.angleLimit();

        if(ROTATION)
        {
            this.updateAngle();
        }
        console.log("velocity in updatepos is " + (this.v[0]).toFixed(1) + "," + (this.v[1]).toFixed(1));

        this.x_y[0] = this.x_y[0] + this.v[0];
        this.x_y[1] = this.x_y[1] + this.v[1];
    }

    giveVector(){
        this.v = [Math.floor(Math.random() * SPEED) + 1, Math.floor(Math.random() * SPEED) + 1];
        this.updateAngle();
    }

    collideWithWall(){
        this.v[0] = -1 * (Math.floor(Math.random() * SPEED) + 1);
        this.v[1] = -1* (Math.floor(Math.random() * SPEED) + 1);
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

        this.coh_v = [(this.rel_center[0] - this.x_y[0])/COHESION, (this.rel_center[1] - this.x_y[1])/COHESION];//offset vector for cohesion
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
        this.sep_v = [this.sep_v[0]*SEPARATION, this.sep_v[1]*SEPARATION];
        //console.log("sep_v " + this.sep_v[0] + "," + this.sep_v[1]);
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
        this.al_v = [(this.al_v[0] - this.v[0]/ALIGNMENT), (this.al_v[0] - this.v[1]/ALIGNMENT)];
    }
}



//independent sprite demonstrates proper angle change independent of boid behavior
//var s = new sprite('dragon_FLY_NO_SHADOW_blue.png', 6,11,96,96,96,2304, context);


var spr = [];
for(var i = 0; i < num_spr; i++)
{
    if(i == 0)
    {
        spr[i] = new sprite('dragon_FLY_NO_SHADOW_blue.png', 6,11,96,96,96,2304, context); //blue is index 0
    }
    else
    {
        spr[i] = new sprite('dragon_FLY_NO_SHADOW_green.png', 6,11,96,96,96,2304, context); //green is index 1

    }
   console.log("index " + i);
}



screen.addEventListener('click', function(e) {
    //when the canvas is clicked, pause or resume animation
    play = !play;
});

var last_animation_time = new Date().getTime();
spr[num_spr - 1].img.onload = function() {



function call_me_on_draw() {
    window.requestAnimationFrame(call_me_on_draw);

    if ((time_delta + last_animation_time) > new Date().getTime() || play == false) { //can add a pause condition here

        return;

    }

    //console.log("past time delta");

    last_animation_time = new Date().getTime();

    context.clearRect(0,0,screen.width, screen.height);
    context.drawImage(bk_img, 0, 0, screen.width, screen.height);

    //s.draw();
    //context.drawImage(s.offscreen, 0, 0);
    for(var j = 0; j < num_spr; j++){

        //console.log("index2 " + j);
        if(j == 0)
        {
            console.log("BLUE DRAGON");
        }
        else
        {
            console.log("GREEN DRAGON");
        }
        spr[j].cohesion(j, spr, num_spr);
        spr[j].separation(j, spr, num_spr);
        spr[j].alignment(j, spr, num_spr);
        spr[j].draw();
        context.drawImage(spr[j].offscreen, 0, 0);
    }
    
    
}
call_me_on_draw();

};