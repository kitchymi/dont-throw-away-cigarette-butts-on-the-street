/**************************************************************************/
/*                            engine core part                            */
/**************************************************************************/

/* canvas */
var canvas;
var canvasContext;
var windowScale;
var pastScreenWidth = -1;
var pastScreenHeight = -1;

/* input */
var inputPointerX = 0, inputPointerY = 0;
var inputPointer = false, inputPointerPast = false, inputPointerDown = false, inputPointerUp = false;
var keydownEventListener = null, keyupEventListener = null;

/* loading control */
var assetCount = 0;
var loadedCount = 0;

/* status */
var taskRunning = false;

function init()
{
	/* canvas */
	canvas = document.getElementById("canvas");
	canvasContext = canvas.getContext("2d");
	checkWindowSizeAndUpdateCanvas();

	canvasContext.font = "64px Arial";
	canvasContext.textBaseline = "top";
	canvasContext.fillStyle = "rgb(0, 0, 0)";
	canvasContext.fillText("Loading...", 0, 0);

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
	document.addEventListener("keydown", function(event)
	{
		if (keydownEventListener != null)
			keydownEventListener(event.keyCode);
	});
	document.addEventListener("keyup", function(event)
	{
		if (keyupEventListener != null)
			keyupEventListener(event.keyCode);
	});

	/* run application */
	setup();
	startTaskWhenAllAssetsLoaded();
}

function checkWindowSizeAndUpdateCanvas()
{
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	if (pastScreenWidth == screenWidth && pastScreenHeight == screenHeight)
		return;

	alert(screenWidth + ", " + screenHeight);

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

function startTaskWhenAllAssetsLoaded()
{
	if (taskRunning)
		return;

	if (loadedCount >= assetCount)
	{
		taskRunning = true;
		setInterval(update, 20);
	}
}

function update()
{
	/* canvas control */
	checkWindowSizeAndUpdateCanvas();
	canvasContext.fillStyle = "rgb(0, 0, 0)";
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	/* input control */
	if (!inputPointerPast && inputPointer)
		inputPointerDown = true;
	else
		inputPointerDown = false;
	if (inputPointerPast && !inputPointer)
		inputPointerUp = true;
	else
		inputPointerUp = false;
	inputPointerPast = inputPointer;

	/* draw */
	draw();
}

/**************************************************************************/
/*                            engine API part                             */
/**************************************************************************/

function loadImage(path)
{
	assetCount++;

	var image = new Image();
	image.addEventListener('load', function()
	{
		loadedCount++;
		startTaskWhenAllAssetsLoaded();
	}, false);
	image.src = path;

	return image;
}

function loadSound(path)
{
	var sound = new Audio(path);
	sound.load();

	return sound;
}

function loadFont(name)
{
	assetCount++;

	document.fonts.load('1rem "' + name + '"').then(function()
	{
		loadedCount++;
		startTaskWhenAllAssetsLoaded();
	});
}

function setKeydownEventListener(listener)
{
	keydownEventListener = listener;
}

function setKeyupEventListener(listener)
{
	keyupEventListener = listener;
}

/**************************************************************************/
/*                            application part                            */
/**************************************************************************/

/* assets - images */
var backgroundImage;
var titleCatImage;
var playCatImage;

/* assets - sounds */
var bgm;

/* state variables */
var state = 0;
var score = 0;

/* object variables */
var catSizeX = 288, catSizeY = 211.2;
var catPositionX = 48, catPositionY = 480;
var catPositionXLimit = 1920;

function setup()
{
	/* load assets */
	backgroundImage = loadImage("resources/images/city.jpg");
	titleCatImage = loadImage("resources/images/titlecat.jpg");
	playCatImage = loadImage("resources/images/catcat.jpg");

	bgm = loadSound("resources/sounds/bgm.mp3");
	bgm.loop = true;

	loadFont("CuteFont");

	/* listeners */
	setKeydownEventListener(function(keyCode)
	{

	});
	setKeyupEventListener(function(keyCode)
	{

	});
}

function draw()
{
	processUserInputPointer();

	switch(state)
	{
		case 0:
			canvasContext.drawImage(backgroundImage, 0, 0, 1920, 960);

			canvasContext.font = "240px CuteFont";
			canvasContext.textAlign = "center"
			canvasContext.textBaseline = "bottom";
			canvasContext.fillStyle = "rgb(0, 0, 255)";
			canvasContext.fillText("시작하려면 터치 !", 960, 795);

			canvasContext.font = "103px CuteFont";
			canvasContext.textAlign = "left"
			canvasContext.fillStyle = "rgb(0, 0, 0)";
			canvasContext.strokeStyle = "white";
			canvasContext.lineWidth = 2;
			canvasContext.strokeText("담배꽁초를 피해 오른쪽 벽으로 가세요", 24, 118);
			canvasContext.fillText("담배꽁초를 피해 오른쪽 벽으로 가세요", 24, 118);

			canvasContext.textAlign = "right"
			canvasContext.strokeText("font - 어비똘영", 1896, 850);
			canvasContext.fillText("font - 어비똘영", 1896, 850);
			canvasContext.strokeText("bgm - 추르처럽 추르처럽", 1896, 946);
			canvasContext.fillText("bgm - 추르처럽 추르처럽", 1896, 946);

			canvasContext.drawImage(titleCatImage, 48, 480, catSizeX, catSizeY);

			if (inputPointerUp)
			{
				releaseUserInputPointer();
				bgm.play();
				state = 1;
			}
			break;

		case 1:
			if (getUserInputPointer())
			{
				if (inputPointerX < 640)
				{
					catPositionX -= 30;
					if (catPositionX < 0)
						catPositionX = 0;
				}
				else if (inputPointerX > 1280)
				{
					catPositionX += 30;
					if (catPositionX > catPositionXLimit)
						catPositionX = catPositionXLimit;
				}
			}

			canvasContext.drawImage(backgroundImage, 0, 0, 1920, 960);

			canvasContext.font = "96px CuteFont";
			canvasContext.textAlign = "left"
			canvasContext.textBaseline = "bottom";
			canvasContext.fillStyle = "rgb(0, 0, 0)";
			canvasContext.strokeStyle = "white";
			canvasContext.lineWidth = 2;
			canvasContext.strokeText("화살표키로 움직이세요", 55, 188);
			canvasContext.fillText("화살표키로 움직이세요", 55, 188);

			canvasContext.font = "bold 144px CuteFont";
			canvasContext.fillStyle = "rgb(255, 0, 0)";
			canvasContext.strokeText("현재 점수 " + score, 48, 151);
			canvasContext.fillText("현재 점수 " + score, 48, 151);
			canvasContext.strokeText("목표 점수 100", 1440, 151);
			canvasContext.fillText("목표 점수 100", 1440, 151);

			canvasContext.drawImage(playCatImage, catPositionX, catPositionY, catSizeX, catSizeY);
			break;
	}
}

/* position, scale transform: (12 / 5) * value */
/* text's y position transform: (12 / 5) * position + (22 / 43) * font_size */

/* user input processing */
var userInputPointer = false;
function processUserInputPointer()
{
	if (inputPointerDown)
		userInputPointer = true;
	else if (inputPointerUp)
		userInputPointer = false;
}

function getUserInputPointer()
{
	return userInputPointer;
}

function releaseUserInputPointer()
{
	userInputPointer = false;
}
