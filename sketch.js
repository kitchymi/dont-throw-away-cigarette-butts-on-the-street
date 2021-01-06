let x = 20, y = 200, d = 50, v = 1, t = 0;
let cx = 200, cy = 400;
let cat; let cig; let bg; let titcat; let fish;
let state = 0; let bgm; let catsnd1; let catsnd2;
let myFont;

function preload()
{
	bg = loadImage('resources/images/city.jpg'); 
	titcat = loadImage('resources/images/titlecat.jpg');
	cat = loadImage('resources/images/catcat.jpg');
	cig = loadImage('resources/images/cigarett.jpg');
	
	myFont = loadFont('resources/fonts/cute.ttf');
	
	soundFormats('mp3', 'wav');
	bgm = loadSound('resources/sounds/bgm.mp3',onSoundLoaded);
	catsnd1 = loadSound('resources/sounds/cateffect03.wav');
	catsnd2 = loadSound('resources/sounds/cateffect09.wav');
}

function setup()
{
	createCanvas(800, 400);  
}

function onSoundLoaded()
{
	bgm.play();
	bgm.setLoop(true);
}

function draw()
{
	if (state == 0)
	{
		background(bg); noStroke();
		textFont(myFont);
		textSize(100); fill('blue');
		textAlign(CENTER);
		text('시작하려면 터치 !', 400, 310);
		
		fill('black'); noStroke();
		textSize(43); textAlign(LEFT);
		stroke('white');
		text('담배꽁초를 피해 오른쪽 벽으로 가세요', 10, 40)  
		textAlign(RIGHT); 
		text('font - 어비똘영', 790, 345)  
		text('bgm - 추르처럽 추르처럽', 790, 385)   
		image(titcat,x,y);
		 
		if (mouseIsPressed)
		{
			state = 1 ;
		}
	}
	else if (state == 1)
	{
		background(bg);
		textSize(40); fill('black');
		textAlign(LEFT);
		textFont(myFont);
		text('화살표키로 움직이세요', 23, 70);
		 
		textSize(60);fill('red'); textStyle('bold');
		text('현재 점수 ' + t*20 , 20, 50);
		text('목표 점수 100', 600, 50);
		
		if (keyIsDown(LEFT_ARROW)) {if(x>=0){ x -= 10;}}
		else if (keyIsDown(RIGHT_ARROW)) {x += 10;}
		else if (keyIsDown(UP_ARROW)) {if(y>=0){y -= 10;}}
		else if (keyIsDown(DOWN_ARROW)) {if(y<=300){y += 10;}}
			
		image(cat, x, y);

		if (x>=width)
		{
			x = 20;
			t = t + 1 ;
			if(v>=0){ v = v + 0.5;}
			else {v = v - 0.5;}
		
			if(t == 5) state = 3;
			 
			catsnd2.play();
		}

		image(cig, cx, cy);
		image(cig, cx+200, 400-cy);
		image(cig, cx+400, cy);  

		cy = cy + v;
		
		if ((cy > height) || (cy < 0)) 
		{
			v = v*-1;
		}
		 
		if(checkCollision(x, y, cx, cy) ||
			 checkCollision(x, y, cx+200, 400-cy) ||
			 checkCollision(x, y, cx+400, cy))
		{
			state = 2;
		}
	}
	else if (state == 2)
	{
		background(0);
		textFont(myFont);
		fill('white'); noStroke();
		textSize(40); textAlign(CENTER);
		text('흡연자를 위해 재떨이를 비치합시다', 400,250);
		text('고양이가 담배꽁초를 먹고 몸이 상합니다',400,290);
			
		fill('red');
		textSize(55);
		textStyle('bold'); textAlign(CENTER);
		text('길거리에 담배꽁초를 버리지 말고 청소합시다',400,200);
							
		textAlign(RIGHT);  textSize(43); fill('white');
		text('다시 하려면 클릭!', 790, 380)   
 
		if (mouseIsPressed)
		{
			state = 1; x = 20; y =200; t = 0; v =1;
		}
	}
	else if (state == 3)
	{
		background(bg);
		textFont(myFont); textStyle('bold');
		fill('green'); stroke('white');
		textAlign(CENTER); textSize(80);
		text('고양이를 도와줘서 고마워요!', 400,300);
		catsnd1.play(); state = 4;
	}
}

function checkCollision(x1, y1, x2, y2)
{
	return ((x1 - x2) >= -120) &&
				 ((x1 - x2) <=  50)  &&
				 ((y1 - y2) >= -88)  &&
				 ((y1 - y2) <=  20)
}
