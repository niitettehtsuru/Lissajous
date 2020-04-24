'use strict'; 
/* Sets everything up
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      23rd April, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/Lissajous 
 * @license:   GNU General Public License v3.0
 */  
function getBrowserWindowSize() 
{
    let win = window,
    doc     = document,
    offset  = 20,//
    docElem = doc.documentElement,
    body    = doc.getElementsByTagName('body')[0],
    browserWindowWidth  = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight; 
    return {x:browserWindowWidth-offset,y:browserWindowHeight-offset}; 
} 
function onWindowResize()//called every time the window gets resized. 
{  
    windowSize     = getBrowserWindowSize();
    c.width        = windowSize.x; 
    c.height       = windowSize.y; 
    SCREEN_WIDTH   = windowSize.x;
    SCREEN_HEIGHT  = windowSize.y;  
}
function updateCanvas()
{
    ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);    
    ctx.fillStyle   = 'white';  
    ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
}
//create article element
let article =    document.createElement("article"); 
article.id  =    "info";
article.innerHTML = 
`   <header>    
        <h2><pre>Rotation Angle(Radians): <span id='angle'   style='color:red'></span></pre> </h2> 
        <h2><pre>Horizontal Lobes       : <span id='numXTan' style='color:blue'></span></pre> </h2> 
        <h2><pre>Vertical Lobes         : <span id='numYTan' style='color:green'></span></pre></h2>  
        <hr> 
        <h2>Click page to generate random curve </h2> 
    </header>  
    <a href='https://github.com/niitettehtsuru/Lissajous'>Github</a> 
 `;
document.body.appendChild(article);//add article element to the body 
let browserWindowSize   = getBrowserWindowSize(),
c   = document.getElementById("lissajousCanvas"),
ctx = c.getContext("2d"); 
//set size of canvas
c.width          = browserWindowSize.x; 
c.height         = browserWindowSize.y; 
let SCREEN_WIDTH = browserWindowSize.x,
    SCREEN_HEIGHT= browserWindowSize.y,   
    base      = new Base(SCREEN_WIDTH,SCREEN_HEIGHT),  
    lastTime     = 100,  
    windowSize;   
window.addEventListener('resize',onWindowResize);  
function doAnimationLoop(timestamp)
{           
    updateCanvas();
    base.resize(SCREEN_HEIGHT,SCREEN_WIDTH);//let curves respond to window resizing  
    let deltaTime  = timestamp - lastTime; 
        lastTime   = timestamp;
    base.update(deltaTime);   
    base.draw(ctx);  
    requestAnimationFrame(doAnimationLoop); 
} 
requestAnimationFrame(doAnimationLoop); 

 
 