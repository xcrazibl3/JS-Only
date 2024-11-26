var level=0;
var start = 0;
var gamePattern=[];
var colors=["green","yellow","red","blue"];
var randcolor;
var getId;
var playerChoice=[];
var clickCounter=0;


$(document).on("keypress", function(){
  if(start==0){
    newColor();
  }
  start=1;
});



$(".btn").on("click", function(){
  getId=this.id;
  playerChoice.push(getId);
  pressed(getId);
  sound(getId);
  // nov red V
  if(playerChoice[clickCounter]!=gamePattern[clickCounter]){
    sound("wrong");
    restart();
  }

  clickCounter++;
  if (clickCounter==level){
    if(check(gamePattern,playerChoice)){
      playerChoice=[];
      clickCounter=0;
      newColor();
    }
    else {
      sound("wrong");
      restart();
    }
  }
});



function newColor(){
  level++;
  $("h1").html("Level "+ level);
  selectRandColor(gamePattern);
  flash(gamePattern[gamePattern.length-1]);
  sound(gamePattern[gamePattern.length-1]);
}

function check(gameArray,playerArray){
  if(playerArray.length!==gameArray.length)
    return false;
  for(var i=0;i<gameArray.length;i++){
    if(gameArray[i]!=playerArray[i])
      return false;
  }
  return true;
}

function restart(){
  $("body").css("background-color","red");
  $("h1").html("WRONG ANSWER!");
  setTimeout(function(){
    level=0;
    start=0;
    clickCounter=0;
    gamePattern=[];
    playerChoice=[];
    $("body").css("background-color","#011F3F");
    $("h1").html("Press A Key to Start");
  },1000);
}

function pressed(id){
  $("#" + id).addClass("pressed");
  setTimeout(function(){
    $("#" + id).removeClass("pressed");
  },150);
}

function selectRandColor(array){
  randcolor=colors[Math.floor(Math.random()*3)];
  array.push(randcolor);
}

function flash(id){
  $("#" + id).delay(350).fadeOut(200).fadeIn(200);
}

function sound(id){
  var sound = new Audio("sounds/" + id + ".mp3");
  sound.play();
}
