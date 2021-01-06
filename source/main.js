function draw()
{
	screen.orientation.lock("landscape-primary");

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
