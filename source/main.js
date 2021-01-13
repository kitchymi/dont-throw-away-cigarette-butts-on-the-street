var canvas;
var canvasContext;

function init()
{
	canvas = document.getElementById("canvas");
	canvasContext = canvas.getContext("2d");

	checkWindowSizeAndUpdateCanvas();
	setInterval(update, 20);
}

var x = 0;
function update()
{
	checkWindowSizeAndUpdateCanvas();

	canvasContext.fillStyle = "rgb(255, 255, 255)";
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	canvasContext.fillStyle = "rgba(200, 0, 0, 0.5)";
	canvasContext.fillRect(x, 10, 50, 50);
	x++;
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
	var baseRatio = 16 / 9;

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
}
