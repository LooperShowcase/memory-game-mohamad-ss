const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secoundCard;
let lockBoard = false;
let score = 0;

document.getElementById("score").textContent = score;

fetch("./data/cards.json").then((res) =>res.json() )
.then((data) => {
    console.log(cards);
    
    cards = [...data, ...data];
    shuffleCards()
    generateCards();
    console.log(cards);
});

function shuffleCards()  {
    let currentIndex = cards.length;
    let randomIndex;
    let tempValue;
    while(currentIndex !== 0 ){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        tempValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = tempValue;
    }
}

function generateCards(){
    for (let card of cards){
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML=`
        <div class="front">
        <img class="front-image" src=${card.image}>
        </div>
        <div class="back"></div>
       `;
        cardElement.addEventListener("click",flipCard);
        cardElement.addEventListener("touch",flipCard);
        cardsContainer.appendChild(cardElement);
    }
}
function flipCard() {
    if(lockBoard) return;
    if(this === firstCard)  return;

    this.classList.add("flipped");

    if(!firstCard){
        firstCard=this;
        return;
    }
    secoundCard = this;

    lockBoard=true;

    checkForMatch();
     
}

function checkForMatch(){
    let isMatch = firstCard.dataset.name === secoundCard.dataset.name;
    if(isMatch) 
    disableCards();
    else
    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener ("click",flipCard);
    secoundCard.removeEventListener ("click",flipCard);
   firstCard.removeEventListener ("touch",flipCard);
    secoundCard.removeEventListener ("touch",flipCard);

    score++;
    if(score === 9)
        startConfetti();
    
document.getElementById("score").textContent = score;
    unlockBoard();

}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secoundCard.classList.remove("flipped");
        unlockBoard();
    }, 1000);
}

function unlockBoard() {
    firstCard = null;
    secoundCard = null;
    lockBoard = false;
}

function restart() {
    cardsContainer.innerHTML = "";
    generateCards();
    shuffleCards();
    score = 0;
    document.getElementById("score").textContent = score;
    unlockBoard();
}