/* canvas */
var canvas;
var canvasContext;
var windowScale;

/* input */
var inputPointerX = 0, inputPointerY = 0;
var inputPointer = false, inputPointerPast = false, inputPointerDown = false;

function init()
{
	/* canvas */
	canvas = document.getElementById("canvas");
	canvasContext = canvas.getContext("2d");
	checkWindowSizeAndUpdateCanvas();

	/* input */
	canvas.onmouseover = function()
	{
		inputPointer = false;
	};
	canvas.onmouseout = function()
	{
		inputPointer = false;
	};
	canvas.onmousedown = function()
	{    
		inputPointer = true;
	};
	canvas.onmouseup = function()
	{
		inputPointer = false;
	};
	canvas.onmousemove = function(event)
	{
		inputPointerX = event.clientX * windowScale;
		inputPointerY = event.clientY * windowScale;
	};
	canvas.addEventListener("touchstart", function(event)
		{
			inputPointer = true;

			var touches = event.changedTouches;
			inputPointerX = touches[0].clientX * windowScale;
			inputPointerY = touches[0].clientY * windowScale;
		}, false);
	canvas.addEventListener("touchmove", function(event)
		{
			var touches = event.changedTouches;
			inputPointerX = touches[0].clientX * windowScale;
			inputPointerY = touches[0].clientY * windowScale;
		}, false);
	canvas.addEventListener("touchend", function(event)
		{
			inputPointer = false;
		}, false);
	canvas.addEventListener("touchcancel", function(event)
		{
			inputPointer = false;
		}, false);

	/* run application */
	setup();
	setInterval(update, 20);
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

	var canvasScale = canvas.width / 1920;
	canvasContext.scale(canvasScale, canvasScale);

	windowScale = 1920 / canvas.width;
}

function update()
{
	/* canvas control */
	checkWindowSizeAndUpdateCanvas();
	canvasContext.fillStyle = "rgb(255, 255, 255)";
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	/* input control */
	if (!inputPointerPast && inputPointer)
		inputPointerDown = true;
	else
		inputPointerDown = false;
	inputPointerPast = inputPointer;

	/* draw */
	draw();
}

/**************************************************************************/
/*                            application part                            */
/**************************************************************************/

/* assets - images */
var backgroundImage;
var catImage;

/* assets - sounds */
var bgm;

function setup()
{
	/* load assets */
	backgroundImage = new Image();
	backgroundImage.src = "resources/images/city.jpg";
	catImage = new Image();
	catImage.src = "resources/images/catcat.jpg";

	bgm = new Audio("resources/sounds/bgm.mp3");
	bgm.loop = true;
}

/* variables */
var x = 0;
var check = 0;
var catX = 0, catY = 0;
var isBGM = false;

function draw()
{
	canvasContext.drawImage(backgroundImage, 0, 0, 1920, 960);

	if (inputPointerDown)
	{
		catX = inputPointerX;
		catY = inputPointerY;

		if (!isBGM)
		{
			isBGM = true;
			bgm.play();
		}
	}
	canvasContext.drawImage(catImage, catX, catY, 120, 88);

	canvasContext.font = "200px CuteFont";
	canvasContext.fillStyle = "rgba(255, 0, 255, 1)";
	canvasContext.fillText("시작", 960, 480);
}
