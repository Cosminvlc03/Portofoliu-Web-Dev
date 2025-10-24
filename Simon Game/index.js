var buttonColours =["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;

function nextSequence(){
    userClickedPattern = [];
    $("h1").text("Level " + level);
    level++;
    var rand = Math.floor(Math.random() * buttonColours.length) ;
    var randomChosenColour = buttonColours[rand];
    gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
}

$(".btn").click(function(){
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length-1);
});

function playSound(name){
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play()
}

function animatePress(currentColour){
    $("#" + currentColour).addClass("pressed");
    setTimeout(function(){$("#" + currentColour).removeClass("pressed")},100);
}

function checkAnswer(currentLevel){
    if (gamePattern[currentLevel] == userClickedPattern[currentLevel]){
        if(userClickedPattern.length == gamePattern.length){
            setTimeout(function(){nextSequence()},1000);
            
        }
    }
    else{
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){$("body").removeClass("game-over")}, 200);
        $("h1").text("Game over! Press any key to restart!");
        startOver();
    }
}

function startOver(){
    level = 0;
    gamePattern = [];
    started = false;
}

$(document).on("keydown",function(){
    if(!started){
        nextSequence();
    }
    started = true;
    checkAnswer(level);
});

