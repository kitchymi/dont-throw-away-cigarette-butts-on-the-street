/* canvas */
var canvas;
var canvasContext;
var canvasScale;
var windowScale;

/* input */
var inputX = 0, inputY = 0;
var inputDown = false;

/* assets - images */
var backgroundImage;
var catImage;

/* assets - sounds */
var bgm;

function init()
{
	canvas = document.getElementById("canvas");
	canvasContext = canvas.getContext("2d");

	canvas.onmouseover = function()
	{
		inputDown = false;
	};
	canvas.onmouseout = function()
	{
		inputDown = false;
	};
	canvas.onmousedown = function()
	{    
		inputDown = true;
	};
	canvas.onmouseup = function()
	{
		inputDown = false;
	};
	canvas.onmousemove = function(event)
	{
		inputX = event.clientX * windowScale;
		inputY = event.clientY * windowScale;
	};

	backgroundImage = new Image();
	backgroundImage.src = "resources/images/city.jpg";
	catImage = new Image();
	catImage.src = "resources/images/catcat.jpg";

	bgm = new Audio("resources/sounds/bgm.mp3");
	bgm.loop = true;

	checkWindowSizeAndUpdateCanvas();
	setInterval(update, 20);
}

var x = 0;
var check = 0;
var catX = 0, catY = 0;
function update()
{
	checkWindowSizeAndUpdateCanvas();

	canvasContext.fillStyle = "rgb(255, 255, 255)";
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	drawImage(backgroundImage, 0, 0, 1920, 960);

	if (inputDown)
	{
		catX = inputX;
		catY = inputY;
	}
	drawImage(catImage, catX, catY, 120, 88);
}

var pastScreenWidth = -1;
var pastScreenHeight = -1;
function checkWindowSizeAndUpdateCanvas()
{
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	if (pastScreenWidth == screenWidth && pastScreenHeight == screenHeight)
		return;

	pastScreenWidth = screenWidth;
	pastScreenHeight = screenHeight;
	initializeCanvas(screenWidth, screenHeight);
}

function initializeCanvas(screenWidth, screenHeight)
{
	var aspectRatio = screenWidth / screenHeight;
	var baseRatio = 2;

	if (aspectRatio > baseRatio)
	{
		canvas.width = screenHeight * baseRatio;
		canvas.height = screenHeight;
	}
	else
	{
		canvas.width = screenWidth
		canvas.height = screenWidth / baseRatio;
	}

	canvasScale = canvas.width / 1920;
	windowScale = 1920 / canvas.width;
}

function drawImage(image, x, y, width, height)
{
	canvasContext.drawImage(image,
		    x * canvasScale,      y * canvasScale,
		width * canvasScale, height * canvasScale);
}
