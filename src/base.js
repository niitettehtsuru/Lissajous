'use strict'; 
/* Creates, updates and draws lissajous curves.
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      23rd April, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/Lissajous 
 * @license:   GNU General Public License v3.0
 */
class Base
{
    constructor(screenWidth,screenHeight)
    {     
        this.screenWidth    = screenWidth; 
        this.screenHeight   = screenHeight;  
        //set coordinates at the center of the screen 
        this.xCoord         = this.screenWidth/2;//set initial x coordinate      
        this.yCoord         = this.screenHeight/2;//set initial y coordinate 
        this.lobeRatios     = 
        [
            {a:1,b:2},{a:1,b:3},{a:1,b:4},{a:1,b:5},{a:2,b:1},{a:2,b:3},{a:2,b:5},{a:2,b:7}, 
            {a:3,b:1},{a:3,b:2},{a:3,b:4},{a:3,b:5},
            {a:4,b:1},{a:4,b:3},{a:4,b:5},   
            {a:5,b:1},{a:5,b:2},{a:5,b:3},{a:5,b:4},{a:5,b:6},{a:5,b:7},{a:5,b:8}, 
            {a:6,b:5},{a:6,b:7},{a:6,b:11},
            {a:7,b:3},{a:7,b:4},{a:7,b:5},{a:7,b:6},{a:7,b:8},{a:7,b:9},{a:7,b:10},{a:7,b:11} 
        ];
        this.lissajousCurves= this.createLissajousCurves(); 
        document.addEventListener('click',(event)=>//when user clicks on the canvas
        {    
            this.lissajousCurves= this.createLissajousCurves(); //spawn new curves
        });
    } 
    createLissajousCurves()
    {
        let lissajousCurves = [];  
        let lobeRatio = this.getRandomLobeRatio(); 
        let numOfNestedCurves = 2;/*draw 2 curves with same lobe ratio*/
        for(let j=0;j < numOfNestedCurves; j++)
        { 
            let relativeWidth  = 100,//relative width of the curve to the height; 
                relativeHeight = 100,//relative height of the curve to the width; 
                numHorizontalTangents = lobeRatio.a,//number of horizontal tangents(lobes) to the curve 
                numVerticalTangents = lobeRatio.b;//number of vertical tangents(lobes) to the curve 
            let data = 
            {   //nest second curve 30 pixels within the first curve
                relativeWidth: relativeWidth - (j*30),
                relativeHeight:relativeHeight - (j*30), 
                numXTan:numHorizontalTangents,
                numYTan:numVerticalTangents,
                rotationAngle: -Math.PI, 
                xCoord: this.xCoord,
                yCoord: this.yCoord, 
                color: 'black' //stroke color 
            }; 
            lissajousCurves.push(new Lissajous(data)); 
        }  
        return lissajousCurves; 
    } 
    getRandomLobeRatio()
    {
        let index = Math.floor(this.getRandomNumber(0, this.lobeRatios.length));
        return this.lobeRatios[index];   
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
    
    /**
    * Let curves respond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    */
    resize(screenHeight,screenWidth)
    {   
        if(this.screenHeight !== screenHeight || this.screenWidth !== screenWidth)//if the screen size has changed
        {    
            let dy              = screenHeight/this.screenHeight;//percentage change in browser window height 
            let dx              = screenWidth/this.screenWidth;//percentage change in browser window width  
            this.screenHeight   = screenHeight;  
            this.screenWidth    = screenWidth; 
            this.xCoord *= dx; 
            this.yCoord *= dy; 
            //resize curves
            let xCoord = this.xCoord; 
            let yCoord = this.yCoord;
            this.lissajousCurves.forEach(function(curve)
            {
                curve.resize(xCoord,yCoord); 
            });  
        } 
    }   
    draw(ctx)
    {      
        this.lissajousCurves.forEach(function(curve)
        {
            curve.draw(ctx); 
        });  
    }      
    update(deltaTime)
    {      
        let xCoord = this.xCoord;
        let yCoord = this.yCoord; 
        this.lissajousCurves.forEach(function(curve)
        {
            curve.update(deltaTime,xCoord,yCoord); 
        });
    }       
}