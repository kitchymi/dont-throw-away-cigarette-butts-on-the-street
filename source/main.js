function draw()
{
	window.addEventListener("onorientationchange", onOrientationChanged);

	initializeCanvas();
}

function initializeCanvas()
{
	var canvas = document.getElementById("canvas");

	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

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
	
	canvas.width = screenWidth
	canvas.height = screenHeight;
	
	if (canvas.getContext)
	{
		var ctx = canvas.getContext("2d");

		// ctx.fillStyle = "rgb(255, 255, 255)";
		// ctx.fillRect (0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "rgb(0, 200, 0, 0.5)";
		ctx.fillRect (10, 10, canvas.width - 20, canvas.height - 20);
		// ctx.fillRect (10, 10, 1900, 1060);

		ctx.fillStyle = "rgb(200, 0, 0, 0.5)";
		ctx.fillRect (10, 10, 50, 50);

		ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
		ctx.fillRect (30, 30, 50, 50);
	}
}

var count = 0;
function onOrientationChanged()
{
	count++;
	document.getElementById("show").innerText = "onOrientationChanged count: " + count;
	initializeCanvas();
}
