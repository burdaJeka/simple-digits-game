'use strict';
import '../html/index.html';
import "@babel/polyfill";
import '../scss/main.scss';


const btnStart = document.querySelector('.btn-start');
const resultMsg = document.querySelector('#results');
const gameDeck = document.querySelector('.game__deck');
const wrapper = document.querySelector('.wrapper');
const btnReset = document.querySelector('.btn-deck');
const tableResult = document.querySelector('.table');
const startScreen = document.querySelector('.start');


let gameObject = {
    arrayCells: generateArray(),
    checkArray: [],
    isBuild: false,
    isWin: false,
    timer: 0,
};

let resultArr = [];

let resultObj = {
    time: 60,
    result: "",
};


btnStart.addEventListener('click', () => {
    if (!gameObject.isBuild) {
        startScreen.style = "display: none;";
        wrapper.style = "display: flex;";
        build();
    }
});

btnReset.addEventListener("click", () => {
    resultMsg.style = "visibility: hidden;";
    clearInterval(gameObject.timer);
    gameObject = {
        arrayCells: generateArray(),
        checkArray: [],
        isBuild: false,
        isWin: false,
        timer: 0,
    };
    resultObj = {
        time: 60,
        result: "",
        isBest: false,
    };
    document.querySelectorAll(".item").forEach((item) => {
        item.remove();
    });
    build();
    timeHandler();
});

function generateArray() {
    const MAX_VALUE = 25,
        MIN_VALUE = 1;
    let tempArray = [];
    for (let i = MIN_VALUE; i <= MAX_VALUE; i++) {
        tempArray.push(i);
    }
    return tempArray;
}

const shuffle = (arr) => {
    const MAX_COUNT = 25;
    const MIN_COUNT = 13;
    return arr.sort(() => Math.round(Math.random() * MAX_COUNT) - MIN_COUNT);
};

function build() {
    let shuffleArray = shuffle(gameObject.arrayCells);
    let item;
    let iterator = 1;
    for (let i = 0; i < 25; i++) {
        item = document.createElement('div');
        item.classList.add("item");
        item.dataset.num = shuffleArray.shift();
        item.innerText = item.dataset.num;
        item.style += generateStyle();
        gameDeck.appendChild(item);
    }
    gameObject.isBuild = true;
    document.querySelectorAll(".item").forEach((item) => {
        item.addEventListener("click", () => {
            if (gameObject.checkArray.length === 0 && item.dataset.num == iterator) {
                item.classList.add('green')
                gameObject.checkArray.push(item);
                iterator++;
            } else if (item.dataset.num == iterator) {
                iterator++;
                item.classList.add('green');
                gameObject.checkArray.push(item);
            } else {
                resultMsg.style = "visibility: visible;";
                resultMsg.innerHTML = "You Lose";
                item.classList.add('red');
                gameObject.isWin = false;
                stopGame();
            }
            if (gameObject.checkArray.length == 25) {
                resultMsg.style = "visibility: visible;";
                resultMsg.innerHTML = "You Win";
                item.classList.add('green');
                gameObject.isWin = true;
                stopGame();
            }
        })
    });
}

function generateStyle() {
    let fontWeight = randomFontWeight();
    let fontSize = randomFontSize();
    let color = randomColor();
    let style = `font-weight:${fontWeight}; font-size:${fontSize};color:${color};`;
    console.log(style);
    return style;
}

function randomFontWeight() {
    const MAX_COUNT = 10;
    const MIN_COUNT = 1;
    const WIDTH_COUNTER = 100;
    return Math.round(Math.random() * MAX_COUNT + MIN_COUNT) * WIDTH_COUNTER;
}

function randomColor() {
    const MAX_VALUE = 256;
    let rgb;
    let red = Math.floor(Math.random() * MAX_VALUE);
    let green = Math.floor(Math.random() * MAX_VALUE);
    let blue = Math.floor(Math.random() * MAX_VALUE);
    rgb = `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
    return rgb;
}

function randomFontSize() {
    const MAX_SIZE = 30;
    const MIN_SIZE = 14;
    return `${Math.round(Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE)}px`;
}

function timeHandler() {
    let time = 60;
    let timerDecrement = setInterval(() => {
        if (time == 0) {
            gameObject.isWin = false;
            document.querySelector('#time').innerHTML = 0;
            stopGame();
        } else {
            document.querySelector('#time').innerHTML = `${time--}`;
            resultObj.time = document.querySelector("#time").innerHTML;
        }
    }, 1000);
    gameObject.timer = timerDecrement;
}

function stopGame() {
    clearInterval(gameObject.timer);
    document.querySelectorAll(".item").forEach((item) => {
        item.classList.add("nonePointer");
    });
    switch (gameObject.isWin) {
        case true:
            resultMsg.innerHTML = "You Win";
            resultMsg.style = "visibility: visible;";
            tableResult.style.display = 'flex';
            console.log("GAME OVER!");
            break;
        case false:
            tableResult.style.display = 'flex';
            resultMsg.innerHTML = "You Lose";
            resultMsg.style = "visibility: visible;";
    }
    resultObj.result = resultMsg.innerHTML;
    generateResult();
}

timeHandler();

function generateResult() {
    resultArr.push(resultObj);
    let currentIndex = "index" + resultArr.length;
    let index = resultArr.length;
    const tr = document.createElement("tr");
    tr.classList.add(currentIndex); //elementComplete
    document.querySelector("table").appendChild(tr);
    const tdTime = document.createElement("td");
    const tdResult = document.createElement("td");
    tdTime.classList.add("time" + index);
    tdResult.classList.add("result" + index);
    let querySelector = `.${currentIndex}`;
    document.querySelector(querySelector).appendChild(tdTime);
    document.querySelector(querySelector).appendChild(tdResult);
    document.querySelector(".time" + index).innerHTML =
        resultArr[resultArr.length - 1].time;
    document.querySelector(".result" + index).innerHTML =
        resultArr[resultArr.length - 1].result;
    if (resultArr.length >= 5) {
        resultArr = [];
    }
}




