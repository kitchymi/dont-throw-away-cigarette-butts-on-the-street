function draw()
{
	document.addEventListener("fullscreenchange", onFullscreen);
	document.addEventListener("webkitfullscreenchange", onFullscreen);
	document.addEventListener("mozfullscreenchange", onFullscreen);
	document.addEventListener("MSFullscreenChange", onFullscreen);

	document.getElementById("btnHello").onclick = function()
	{
		document.getElementById("show").innerText = "안녕하신가";
		screen.orientation.lock("landscape-primary");
		var elem = document.getElementById("canvas");
		requestFullScreen(elem);
	}
}

function requestFullScreen(element)
{
	// Supports most browsers and their versions.
	var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

	if (requestMethod)
	{ // Native full screen.
		requestMethod.call(element);
	}
	else if (typeof window.ActiveXObject !== "undefined")
	{ // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null)
		{
			wscript.SendKeys("{F11}");
		}
	}
}

function onFullscreen()
{
	var canvas = document.getElementById("canvas");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	if (canvas.getContext)
	{
		var ctx = canvas.getContext("2d");

		ctx.fillStyle = "rgb(0, 200, 0, 0.5)";
		ctx.fillRect (10, 10, window.innerWidth - 20, window.innerHeight - 20);

		ctx.fillStyle = "rgb(200, 0, 0, 0.5)";
		ctx.fillRect (10, 10, 50, 50);

		ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
		ctx.fillRect (30, 30, 50, 50);
	}
}
