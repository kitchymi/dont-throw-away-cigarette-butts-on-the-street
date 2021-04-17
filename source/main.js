/**************************************************************************/
/*                            engine core part                            */
/**************************************************************************/

/* this is test data */

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

function releaseInputPointer()
{
	inputPointerPast = false;
	inputPointer = false;

	inputPointerDown = false;
	inputPointerUp = false;
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
var cigaImage;

/* assets - sounds */
var bgm;
var levelSound;
var stageSound;

/* state variables */
var state = 0;
var score = 0;

/* input control variables */
var inputArrowKey = false, isInputArrowKeyLeft = false, isSpaceKey = false;

/* cat object variables */
var catSizeX = 288, catSizeY = 211.2;
var catOriginalPositionX = 48, catOriginalPositionY = 480;
var catPositionX = catOriginalPositionX, catPositionY = catOriginalPositionY;
var catPositionXLimit = 1920;

/* cigarette object variables */
var cigaSizeX = 120, cigaSizeY = 48;
var ciga0OriginalPositionX = 480, ciga1OriginalPositionX = 960, ciga2OriginalPositionX = 1440;
var ciga0OriginalPositionY = 480, ciga1OriginalPositionY = 800, ciga2OriginalPositionY = 160;
var ciga0PositionX, ciga1PositionX, ciga2PositionX;
var ciga0PositionY, ciga1PositionY, ciga2PositionY;
var cigaSpeed = 3;

function setup()
{
	/* load assets */
	backgroundImage = loadImage("resources/images/city.jpg");
	titleCatImage = loadImage("resources/images/titlecat.jpg");
	playCatImage = loadImage("resources/images/catcat.jpg");
	cigaImage = loadImage("resources/images/cigarett.jpg");

	bgm = loadSound("resources/sounds/bgm.mp3");
	bgm.loop = true;
	levelSound = loadSound("resources/sounds/cateffect09.wav");
	stageSound = loadSound("resources/sounds/cateffect03.wav");

	loadFont("CuteFont");

	/* listeners */
	setKeydownEventListener(function(keyCode)
	{
		switch (keyCode)
		{
			case 32: /* space key */
				isSpaceKey = true;
				break;

			case 37: /* left arrow key */
				inputArrowKey = true;
				isInputArrowKeyLeft = true;
				break;

			case 39: /* right arrow key */
				inputArrowKey = true;
				isInputArrowKeyLeft = false;
				break;

			case 65: /* A key */
				inputArrowKey = true;
				isInputArrowKeyLeft = true;
				break;

			case 68: /* D key */
				inputArrowKey = true;
				isInputArrowKeyLeft = false;
				break;
		}
	});
	setKeyupEventListener(function(keyCode)
	{
		switch (keyCode)
		{
			case 37: /* left arrow key */
				inputArrowKey = false;
				break;

			case 39: /* right arrow key */
				inputArrowKey = false;
				break;

			case 65: /* A key */
				inputArrowKey = false;
				break;

			case 68: /* D key */
				inputArrowKey = false;
				break;
		}
	});
}

function draw()
{
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

			if (inputPointerUp || isSpaceKey)
			{
				releaseInputPointer();
				initializeCat();
				initializeCigarette();
				bgm.play();
				state = 1;
			}
			break;

		case 1:
			/* game algorithm */
			if (inputPointer || inputArrowKey)
			{
				if (inputPointerX < 640 || isInputArrowKeyLeft)
				{
					catPositionX -= 30;
					if (catPositionX < 0)
						catPositionX = 0;
				}
				else if (inputPointerX > 1280 || !isInputArrowKeyLeft)
				{
					catPositionX += 30;
					if (catPositionX > catPositionXLimit)
					{
						releaseInputPointer();
						inputArrowKey = false;

						initializeCat();
						cigaSpeed += 2;
						score += 20;
						levelSound.play();

						if (score >= 100)
						{
							stageSound.play();
							state = 3;
							break;
						}
					}
				}
			}

			ciga0PositionY = getCigarettePosition(ciga0PositionY, cigaSpeed);
			ciga1PositionY = getCigarettePosition(ciga1PositionY, cigaSpeed);
			ciga2PositionY = getCigarettePosition(ciga2PositionY, cigaSpeed);

			if (checkCollision())
			{
				releaseInputPointer();
				state = 2;
			}

			/* rendering */
			canvasContext.drawImage(backgroundImage, 0, 0, 1920, 960);

			canvasContext.font = "96px CuteFont";
			canvasContext.textAlign = "left"
			canvasContext.textBaseline = "bottom";
			canvasContext.fillStyle = "rgb(0, 0, 0)";
			canvasContext.strokeStyle = "white";
			canvasContext.lineWidth = 2;
			canvasContext.strokeText("화살표키로 움직이세요", 55, 188);
			canvasContext.fillText("화살표키로 움직이세요", 55, 188);

			canvasContext.font = "144px CuteFont";
			canvasContext.fillStyle = "rgb(255, 0, 0)";
			canvasContext.strokeText("현재 점수 " + score, 48, 151);
			canvasContext.fillText("현재 점수 " + score, 48, 151);
			canvasContext.strokeText("목표 점수 100", 1440, 151);
			canvasContext.fillText("목표 점수 100", 1440, 151);

			canvasContext.drawImage(playCatImage, catPositionX, catPositionY, catSizeX, catSizeY);

			canvasContext.drawImage(cigaImage, ciga0PositionX, ciga0PositionY, cigaSizeX, cigaSizeY);
			canvasContext.drawImage(cigaImage, ciga1PositionX, ciga1PositionY, cigaSizeX, cigaSizeY);
			canvasContext.drawImage(cigaImage, ciga2PositionX, ciga2PositionY, cigaSizeX, cigaSizeY);
			break;

		case 2:
			canvasContext.fillStyle = "rgb(0, 0, 0)";
			canvasContext.fillRect(0, 0, 1920, 960);

			canvasContext.font = "96px CuteFont";
			canvasContext.textAlign = "center";
			canvasContext.textBaseline = "bottom";
			canvasContext.fillStyle = "rgb(255, 255, 255)";
			canvasContext.fillText("흡연자를 위해 재떨이를 비치합시다", 960, 620);
			canvasContext.fillText("고양이가 담배꽁초를 먹고 몸이 상합니다", 960, 716);

			canvasContext.font = "132px CuteFont";
			canvasContext.fillStyle = "rgb(255, 0, 0)";
			canvasContext.fillText("길거리에 담배꽁초를 버리지 말고 청소합시다", 960, 508);

			canvasContext.font = "103px CuteFont";
			canvasContext.textAlign = "right";
			canvasContext.fillStyle = "rgb(255, 255, 255)";
			canvasContext.fillText("다시 하려면 클릭!", 1896, 934);

			if (inputPointerUp || isSpaceKey)
			{
				releaseInputPointer();
				initializeCat();
				initializeCigarette();
				score = 0;
				state = 1;
			}
			break;

		case 3:
			canvasContext.drawImage(backgroundImage, 0, 0, 1920, 960);

			canvasContext.font = "192px CuteFont";
			canvasContext.textAlign = "center"
			canvasContext.textBaseline = "bottom";
			canvasContext.fillStyle = "rgb(0, 0, 255)";
			canvasContext.strokeStyle = "white";
			canvasContext.lineWidth = 2;
			canvasContext.strokeText("고양이를 도와줘서 고마워요!", 960, 761);
			canvasContext.fillText("고양이를 도와줘서 고마워요!", 960, 761);
			break;
	}

	isSpaceKey = false;
}

/* position, scale transform: (12 / 5) * value */
/* text's y position transform: (12 / 5) * position + (22 / 43) * font_size */

/* object control */
function initializeCat()
{
	catPositionX = catOriginalPositionX;
	catPositionY = catOriginalPositionY;
}

function initializeCigarette()
{
	ciga0PositionX = ciga0OriginalPositionX;
	ciga1PositionX = ciga1OriginalPositionX;
	ciga2PositionX = ciga2OriginalPositionX;
	ciga0PositionY = ciga0OriginalPositionY;
	ciga1PositionY = ciga1OriginalPositionY;
	ciga2PositionY = ciga2OriginalPositionY;
	cigaSpeed = 3;
}

function getCigarettePosition(position, speed)
{
	position += speed;
	if (position > 960)
		position = -cigaSizeY;

	return position;
}

function checkCollision()
{
	return checkCollisionPosition(catPositionX, catPositionY, ciga0PositionX, ciga0PositionY) ||
		checkCollisionPosition(catPositionX, catPositionY, ciga1PositionX, ciga1PositionY) ||
		checkCollisionPosition(catPositionX, catPositionY, ciga2PositionX, ciga2PositionY);
}

function checkCollisionPosition(catX, catY, cigaX, cigaY)
{
	var diffX = catX - cigaX;
	var diffY = catY - cigaY;

	return (diffX >= -catSizeX) &&
		(diffX <= cigaSizeX) &&
		(diffY >= -catSizeY) &&
		(diffY <= cigaSizeY);
}
