'use strict';
/* Draws, rotates and then undraws(traces back the draw) lissajous curves.
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      23rd April, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/Lissajous 
 * @license:   GNU General Public License v3.0
 */
//a lissajous curve 
/* A lissajous curve is a graph of the following two parametric equations: 
 * 
 * x = Asin(at+?)  --------- (1)
 * y = Bsin(bt)    --------- (2)
 * 
 * In the constructor: 
 *  A is this.relativeWidth
 *  B is this.relativeHeight
 *  a is this.numHorizontalTangents
 *  b is this.numVerticalTangents
 *  ? is this.rotationAngle
 *  t is this.parameter
 */
class Lissajous
{
    constructor(data)
    {      
        /* The ratio this.relativeWidth/this.relativeHeight determines the relative width-to-height ratio of the curve.  
         * For example, a ratio of 2/1 produces a figure that is twice as wide as it is high.*/
        this.relativeWidth  = data.relativeWidth;//relative width of the curve to the height; 
        this.relativeHeight = data.relativeHeight;//relative height of the curve to the width;
        
        /*Visually, the ratio this.numHorizontalTangents/this.numVerticalTangents determines the number of "lobes" of the figure. 
         *For example, a ratio of 3/1 or 1/3 produces a figure with three major lobes.*/ 
        this.numHorizontalTangents = data.numXTan;//number of horizontal tangents(lobes) to the curve 
        this.numVerticalTangents = data.numYTan;//number of vertical tangents(lobes) to the curve
        
        this.deltaAngle = 0.5; //adjusts the rotation angle
        /*this.rotationAngle is the phase shift for the lissajous curve. 
         *It determines the apparent "rotation" angle of the figure, viewed as if it were actually a three-dimensional curve.*/ 
        this.rotationAngle = -Math.PI + this.deltaAngle;//phase shift
        
        this.parameter  = 0;//the parameter, (t) in the parametric equation
        
        this.xCoord = data.xCoord;//set x coordinate of the center of the curve     
        this.yCoord = data.yCoord;//set y coordinate of the center of the curve 
         
        this.states = ['rotate','undraw','draw'];//animation states 
        this.currentState = 0;//start from first state, which is 'rotate'  
        
        /*Controls the drawing and undrawing of the curve. 
         *A step from this.maxStepValue to this.minStepValue draws the curve. 
         *A step from this.minStepValue to this.maxStepValue  undraws the curve*/
        this.maxStepValue = 629;//700; 
        this.minStepValue = 1; 
        this.stepSize = 1; 
        this.step = this.maxStepValue;   
        
        //controls the up and down bopping of the curve
        this.maxDyValue = 50; 
        this.minDyValue = -50; 
        this.dy = 1; //makes the curve go up when increasing, makes the curve go down when decreasing
        this.toggleDy = true;//if true, curve goes up. If false, curve goes down 
         
        this.color  =  data.color;//stroke color 
        
        this.fillStyle = this.getRandomColor(0.3);//fill color 
    } 
    getColor() 
    {    
        return this.color; 
    }
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    }  
    moveToNextState()//Transition to the next state
    {
        let maxState    = this.states.length-1; 
        this.currentState++;//move to the next state
        if(this.currentState > maxState)//if next state is unavailable
        {
            this.currentState = 0;//revert to the first state
        } 
        this.setState(); 
    } 
    setState() 
    {
        let state = this.states[this.currentState]; //get the current state
        switch(state)
        {
            case 'draw'://settings to commence the drawing of the curve
                this.step = this.minStepValue; 
                this.rotationAngle = -Math.PI + this.deltaAngle;  
                break; 
            case 'undraw'://settings to commence the undrawing of the curve
                this.step = this.maxStepValue; 
                this.rotationAngle = -Math.PI + this.deltaAngle;  
                break; 
            case 'rotate'://settings to commence the rotation of the curve
                this.step = this.maxStepValue; 
                this.rotationAngle = -Math.PI + this.deltaAngle;  
                break; 
        }
    }
    //draws the start and end tips of the pencil
    drawPencilTip(ctx,point)
    {     
        let radius      = 2; 
        let color = 'black'; 
        let colors  = [`rgba(0,0,0,1)`,`rgba(0,0,0,0.5)`,`rgba(0,0,0,0.2)`];//black color 
        if(point.pos === 'start') 
        {
            colors = [`rgba(255,0,0,1)`,`rgba(255,0,0,0.5)`,`rgba(255,0,0,0.2)`]; //red colors 
        }
        else if (point.pos === 'end') 
        {
            colors = [`rgba(0,128,0,1)`,`rgba(0,128,0,0.5)`,`rgba(0,128,0,0.2)`];//green colors 
        } 
        else if (point.pos === 'continue') 
        {
            colors = [`rgba(255,106,0,1)`,`rgba(255,106,0,0.5)`,`rgba(255,106,0,0.2)`];//yellow colors 
        } 
        for(let i = 0; i < 3; i++)
        { 
            switch(i)//create three circles with same center
            {
                case 0:   
                    color = colors[0]; 
                    break; 
                case 1: 
                    radius*=  2;//bigger circle 
                    color = colors[1];               
                    break; 
                case 2: 
                    radius*= 5;//biggest circle 
                    color = colors[2];  
                    break; 
            }
            //draw the tip
            ctx.beginPath(); 
            ctx.arc(point.x,point.y,radius,0,2*Math.PI);
            ctx.fillStyle = color; 
            ctx.fill(); 
            ctx.strokeStyle = color;
            ctx.stroke();
            radius = 2; 
        } 
    }
    //bops the curve up and down
    bopCurve() 
    {
         
        if(this.toggleDy)//if curve is going up
        {    
            this.dy++;//move the curve up
        }
        else //if curve is goind down
        {
            this.dy--;//move the curve down 
        }
        if(this.dy > this.maxDyValue || this.dy < this.minDyValue)
        {
            this.toggleDy = !this.toggleDy;
        }  
    }
    //animates the drawing,undrawing and rotation of the curve
    draw(ctx)
    { 
        let pencilTip = []; 
        ctx.beginPath(); 
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = this.getColor(); 
        for(let i = 0; i < this.step;i++) 
        { 
            this.parameter+=0.01;   
            //Apply Lissajous Parametric Equations
            /*this.xCoord is added to the first equation.
             *this.yCoord is added to the second equation. 
             *This is so the curve is centered at (this.xCoord,this.yCoord) position on the canvas.*/
            let x = (this.relativeWidth  * Math.sin(this.numHorizontalTangents*this.parameter + this.rotationAngle))+this.xCoord;//first equation  
            let y = (this.relativeHeight * Math.sin(this.numVerticalTangents*this.parameter))+this.yCoord;//second equation  
            ctx.lineTo(x, y+this.dy);
             
            if(i === this.step -1)//get green circle
            {
                pencilTip.push({x:x,y:y+this.dy,pos:'end'});//store the coordinates at last iteration
            }
            if(i===0)//get red cirle
            {
                pencilTip.push({x:x,y:y+this.dy,pos:'start'});//store the coordinates at first iteration
            }
            if (
                    i === Math.floor(2*this.step/3) || //get orange circle farthest from green circle
                    i === Math.floor(4*this.step/5) || //get orange circle second farthest from green circle 
                    i === Math.floor(7*this.step/8) || //get orange circle second closest to green circle
                    i === Math.floor(19*this.step/20)  //get orange circle closest to green circle
                )
            {
                pencilTip.push({x:x,y:y+this.dy,pos:'continue'});//store the coordinates at other iterations
            }    
        }    
        ctx.stroke(); 
        ctx.fillStyle = this.fillStyle; 
        ctx.fill();  
        ctx.closePath(); 
        for(let k = 0;k < pencilTip.length;k++)//draw the circles
        {
            this.drawPencilTip(ctx,pencilTip[k]);
        }  
        this.parameter = 0;//reset parameter
        this.bopCurve();//bop the curve up or down 
        let state = this.states[this.currentState]; 
        switch(state)
        {
            case 'draw'://if curve is being drawn
                this.step+= this.stepSize; //keep drawing 
                if(this.step>this.maxStepValue)//if drawing is completed
                {
                    this.moveToNextState();
                }   
                break; 
            case 'undraw'://if curve is being undrawn
                this.step-=this.stepSize; //keep undrawing 
                if(this.step < this.minStepValue)//if undrawing is completed
                {
                    this.moveToNextState();
                }   
                break; 
            case 'rotate'://if curve is being rotated
                this.rotationAngle += 0.01;//increase rotation angle
                if(this.rotationAngle > Math.PI + this.deltaAngle)//if rotation is complete
                {
                    this.moveToNextState();//move to next state 
                }    
                break; 
        }  
    }
    update(deltaTime,xCoord,yCoord)
    {    
        //update center coordinates
        this.xCoord = xCoord; 
        this.yCoord = yCoord;  
        
        //give user some stats
        let angleInfo = document.getElementById('angle');
        let xTanInfo = document.getElementById('numXTan');
        let yTanInfo = document.getElementById('numYTan');
        let rotationInfo; 
        if(this.rotationAngle.toFixed(4) >= 0)
        {
            rotationInfo = `${this.rotationAngle.toFixed(4)}0`;
        }
        else 
        {
            rotationInfo = `${this.rotationAngle.toFixed(4)}`;
        }  
        angleInfo.innerHTML = `${rotationInfo}`; 
        xTanInfo.innerHTML  = `${this.numHorizontalTangents}`;
        yTanInfo.innerHTML  = `${this.numVerticalTangents}`;
    }     
    //randomly select a color, whiles choosing the opacity
    getRandomColor(opacity)
    {
        let colors = [
            `rgba(255,0,0,      ${opacity})`,//red
            `rgba(255,242,0,   ${opacity})`,//yellow, 
            `rgba(0,0,255,      ${opacity})`,//blue
            `rgba(255,255,0,    ${opacity})`,//yellow
            `rgba(0,255,255,    ${opacity})`,//cyan
            `rgba(255,0,255,    ${opacity})`,//magenta/fuchsia
            `rgba(192,192,192,  ${opacity})`,//silver
            `rgba(128,128,128,  ${opacity})`,//gray 
            `rgba(128,0,0,      ${opacity})`,//maroon
            `rgba(128,128,0,    ${opacity})`,//olive
            `rgba(0,128,0,      ${opacity})`,//green
            `rgba(128,0,128,    ${opacity})`,//purple 
            `rgba(0,128,128,    ${opacity})`,//teal
            `rgba(0,0,128,      ${opacity})`,//navy 
            `rgba(0, 255, 0,    ${opacity})`,//green
            `rgba(77, 0, 255,   ${opacity})`,//blue
            `rgba(255, 0, 140,  ${opacity})`,//purple
            `rgba(0, 0, 0,      ${opacity})`,//black
            `rgba(0,255,0,      ${opacity})`//lime
        ];
        return colors[parseInt(this.getRandomNumber(0, colors.length))];
    } 
     
    resize(xCoord,yCoord)
    {     
        this.xCoord = xCoord; 
        this.yCoord = yCoord;    
    } 
}