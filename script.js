const symbols = ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍"];
let cardsArray;
let firstCard, secondCard;
let lockBoard = true;
let moves = 0;
let matched = 0;
let timer = 0;
let interval;

const board = document.getElementById("board");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const winMessage = document.getElementById("winMessage");

function shuffle(array){
    return array.sort(()=>Math.random()-0.5);
}

function startTimer(){
    interval=setInterval(()=>{
        timer++;
        timeDisplay.textContent=timer;
    },500);
}

function createBoard(){
    board.innerHTML="";
    winMessage.style.display="none";

    cardsArray=shuffle([...symbols,...symbols]);

    cardsArray.forEach(symbol=>{
        const card=document.createElement("div");
        card.classList.add("card");

        card.innerHTML=`
        <div class="card-inner">
            <div class="card-front">?</div>
            <div class="card-back">${symbol}</div>
        </div>`;

        card.dataset.symbol=symbol;
        card.addEventListener("click",flipCard);
        board.appendChild(card);
    });

    previewCards();
}

function previewCards(){
    const allCards=document.querySelectorAll(".card");
    allCards.forEach(card=>card.classList.add("flipped"));

    setTimeout(()=>{
        allCards.forEach(card=>card.classList.remove("flipped"));
        lockBoard=false;
        startTimer();
    },400);
}

function flipCard(){
    if(lockBoard || this.classList.contains("flipped")) return;

    this.classList.add("flipped");

    if(!firstCard){
        firstCard=this;
        return;
    }

    secondCard=this;
    moves++;
    movesDisplay.textContent=moves;

    checkMatch();
}

function checkMatch(){
    if(firstCard.dataset.symbol===secondCard.dataset.symbol){
        matched++;

        if(matched===symbols.length){
            clearInterval(interval);
            showWin();
        }
        resetTurn();
    }else{
        lockBoard=true;
        setTimeout(()=>{
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        },450);
    }
}

function resetTurn(){
    [firstCard,secondCard]=[null,null];
    lockBoard=false;
}

function showWin(){
    winMessage.style.display="block";
    createConfetti();
}

function createConfetti(){
    for(let i=0;i<150;i++){
        const confetti=document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left=Math.random()*100+"vw";
        confetti.style.backgroundColor=
            `hsl(${Math.random()*360},100%,50%)`;
        confetti.style.animationDuration=
            2+Math.random()*3+"s";
        document.body.appendChild(confetti);

        setTimeout(()=>confetti.remove(),4000);
    }
}

function restartGame(){
    clearInterval(interval);
    moves=0;
    matched=0;
    timer=0;
    firstCard=null;
    secondCard=null;
    lockBoard=true;

    movesDisplay.textContent=0;
    timeDisplay.textContent=0;

    createBoard();
}

window.onload=()=>{
    createBoard();
};
