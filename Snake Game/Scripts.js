function Snake(){
	this.x = 5 * scale;
	this.y = 5 * scale;
	this.xSpeed = scale;
	this.ySpeed = 0;
	this.color = "#333";
	this.leadingColor = "#000"
	ctx.fillStyle = this.color;
	this.blockHistoryY = [this.y];
	this.blockHistoryX = [this.x];
	this.total = 1;
	this.no180 = ""; //Used to prevent going backwards/ doing 180s
	this.update = function(){
		//debug();
		ctx.clearRect(this.blockHistoryX[0],this.blockHistoryY[0],scale,scale)
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		ctx.fillStyle = this.leadingColor;
		ctx.fillRect(this.x,this.y,scale,scale)
		this.eatsFood();
		this.isDead();
		ctx.clearRect(this.blockHistoryX[0],this.blockHistoryY[0],scale,scale);
		for(var i = 1; i <= this.total-1; i++){ //Take in/ Throw out blocks
			this.blockHistoryX[i-1] = this.blockHistoryX[i];
			this.blockHistoryY[i-1] = this.blockHistoryY[i];
        }
		this.blockHistoryX[this.total-1] = this.x;
		this.blockHistoryY[this.total-1] = this.y;
		this.nearColor();
		for(var i = 1; i <= this.total; i++){ //Fill in all the blocks
			ctx.fillRect(this.blockHistoryX[i],this.blockHistoryY[i],scale,scale);
        }
		//console.log("X: "+this.blockHistoryX+" Y: "+this.blockHistoryY+" Total: "+this.total);
    }
	this.eatsFood = function(){

		if(this.x == f.x && this.y == f.y){
			f.newLocation()
			ctx.fillStyle = f.color;
			ctx.fillRect(f.x,f.y,scale,scale);
			this.total+=4;
			this.blockHistoryX[this.total] = this.x;
			this.blockHistoryY[this.total] = this.y;
			//console.log(this.total+" New location: "+f.x+" "+f.y);
        }
    }
    this.isDead = function(){
      if(this.total > 1){
        for(var i = 0; i <= this.total-1; i++){
          if(this.x === this.blockHistoryX[i] && this.y === this.blockHistoryY[i]){
            clearInterval(gameInterval);
            alert("Game over!");
          }
        }
      }
    }
		this.nearColor = function(){
			xComp = Math.abs(s.x - f.x);
			if(xComp > xComp % 255){
				xComp = xComp - parseInt(xComp % 255);
				/*	Using this to prevent quick color changes
						i.e. xComp = 254 --> xComp = 255 --> xComp = 0 */
			}
			yComp = Math.abs(s.y - f.y);
			if(yComp > yComp % 255){
				yComp = yComp - parseInt(yComp % 255);
			}
			this.color = "rgb("+ this.total % 255 + "," + Math.abs(yComp - 255) + "," + Math.abs(xComp - 255) + ")";
			ctx.fillStyle = this.color;
		}
} //End of Snake Constructor

function Food(){
	this.x = Math.floor(Math.random() * parseInt(canvas.width-scale)/scale) * scale
	this.y = Math.floor(Math.random() * parseInt(canvas.height-scale)/scale) * scale;
	this.color = "#e04040";
	this.newLocation = function(){
		this.x = Math.floor(Math.random() * canvas.width/scale) * scale;
		this.y = Math.floor(Math.random() * canvas.height/scale) * scale;
    }
}

document.body.addEventListener("keydown",function(e){
	if(e.key == "ArrowUp" && s.no180 !== "Vertical" && isPlaying){
		s.xSpeed = 0;
		s.ySpeed = -1 * scale;
		s.no180 = "Vertical";
	}
	else if(e.key == "ArrowDown" && s.no180 !== "Vertical" && isPlaying){
		s.xSpeed = 0;
		s.ySpeed = 1 * scale;
		s.no180 = "Vertical";
	}
	else if(e.key == "ArrowLeft" && s.no180 !== "Horizontal" && isPlaying){
		s.xSpeed = -1 * scale;
		s.ySpeed = 0;
		s.no180 = "Horizontal";
	}
	else if(e.key == "ArrowRight" && s.no180 !== "Horizontal" && isPlaying){
		s.xSpeed = 1 * scale;
		s.ySpeed = 0;
		s.no180 = "Horizontal";
	}
	else if(e.code == "Space"){
		togglePlay();
	}
})

function togglePlay(){
	switch(isPlaying){
		case true: //Is the game playing right now? Then stop.
			clearInterval(gameInterval);
			document.getElementById('play').innerText = "Resume (Space)";
			isPlaying = false;
			break;
		case false: //Has the game stopped playing? Then start.
			gameInterval = setInterval(function(){s.update()},100);
			document.getElementById("play").innerText = "Pause (Space)";
			isPlaying = true;
			break;
	}
}
/*
if(xComp > 255){
	xComp = xComp - parseInt(xComp % 255);
		Using this to prevent quick color changes
			i.e. xComp = 254 --> xComp = 255 --> xComp = 0
}
*/
function debug(){
	var p = document.getElementById("debug");
	//if(xComp < 255 && yComp < 255){
		var str = s.x + " - " + f.x + " = " + Math.abs(s.x - f.x) + " " + xComp
	 	+ "\n" + s.y + " - " + f.y + " = " + Math.abs(s.y - f.y) + " " + yComp;
	//}
	/*
	if(xComp > 255 || yComp > 255){
		var str = s.x + " - " + f.x + " = " + Math.abs(s.x - f.x) + " " + xComp
	 	+ "\n" + s.y + " - " + f.y + " = " + yComp;
	}*/
	p.innerText = str;
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var s,f,gameInterval,isPlaying,xComp,yComp;
var scale = 20;
isPlaying = true;
s = new Snake();
f = new Food();
ctx.fillStyle = s.color;
ctx.fillRect(s.x,s.y,scale,scale);
ctx.fillStyle = f.color;
ctx.fillRect(f.x,f.y,scale,scale);
gameInterval = setInterval(function(){s.update()},100);
