var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;
const img1 = ".img1";
const img2 = ".img2";

player1 = setName(1);
player2 = setName(2);

setDice(randomNumber1,img1);
setDice(randomNumber2,img2);
checkWinner(randomNumber1,randomNumber2);

$(document).on("keydown",function(){
    var randomNumber1 = Math.floor(Math.random() * 6) + 1;
    var randomNumber2 = Math.floor(Math.random() * 6) + 1;
    setDice(randomNumber1,img1);
    setDice(randomNumber2,img2);
    checkWinner(randomNumber1,randomNumber2);
});

function checkWinner(randomNumber1, randomNumber2){
    if (randomNumber1 > randomNumber2 ){
        document.querySelector("h1").innerHTML=player1 + " Won!";
    }
    else if (randomNumber2 > randomNumber1){
        document.querySelector("h1").innerHTML=player2 + " Won!";
    }
    else{
        document.querySelector("h1").innerHTML="It's a tie!";
    }
}

function setDice(rand, img){
    if(rand === 1){
        document.querySelector(img).setAttribute("src","./images/dice1.png");
    }
    if(rand === 2){
        document.querySelector(img).setAttribute("src","./images/dice2.png");
    }
    if(rand === 3){
        document.querySelector(img).setAttribute("src","./images/dice3.png");
    }
    if(rand === 4){
        document.querySelector(img).setAttribute("src","./images/dice4.png");
    }
    if(rand === 5){
        document.querySelector(img).setAttribute("src","./images/dice5.png");
    }
    if(rand === 6){
        document.querySelector(img).setAttribute("src","./images/dice6.png");
    }
}

function setName(sequence){
    var name = prompt("Enter player " + sequence + "'s name");
    $(".player" + sequence).text(name);
    return name;
}

