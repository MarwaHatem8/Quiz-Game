import dataEn from './qu-en.json' with { type: 'json' };
import dataAr from './qu-ar.json' with { type: 'json' };
let currentLang = 'en';
let data = [...dataEn]; 



let score = 0;
let count = 10;
let totalQuestions = data.length;
let dataCopy = [...data];
let startInterface = document.getElementById("start");
let startBtn = document.querySelector(".startGame");
let ques = document.getElementById("containerQuestion");
let end = document.getElementById("End");
let langBtn = document.getElementById("lang-btn");
let headerStart = document.querySelector(".headerStart");
let correctSound = new Audio('./sound/dragon-studio-correct-472358.mp3');
let wrongSound = new Audio('./sound/universfield-wrong-answer-126515.mp3');
let winsound = new Audio('./sound/freesound_community-tada-fanfare-a-6313.mp3');
let timeInterval;
console.log(data);
langBtn.addEventListener('click', () => {
    if (currentLang === 'en') {
        currentLang = 'ar';
        langBtn.textContent = 'En'; 
        document.body.classList.add('rtl'); 
        data = [...dataAr];
        headerStart.textContent = "لعبة الأسئلة";
        startBtn.textContent = "ابدأ اللعبة";
    } else {
        currentLang = 'en';
        langBtn.textContent = 'Ar'; 
        document.body.classList.remove('rtl'); 
        data = [...dataEn];
        headerStart.textContent = "Quiz Game"; 
        startBtn.textContent = "Start Game"; 
    }
    
    // إعادة ضبط اللعبة بناءً على اللغة الجديدة
    totalQuestions = data.length;
    dataCopy = [...data];
    score = 0;
});
startBtn.addEventListener('click', function startgame() {
    stopTimer();
    startInterface.style.display = 'none';
    nextQuestion();
});
function print(q) {


    let CurrentQNum = totalQuestions - dataCopy.length;
    let qText = currentLang === 'en' 
        ? `Question ${CurrentQNum} of ${totalQuestions} (remaining: ${dataCopy.length})` 
        : `السؤال ${CurrentQNum} من ${totalQuestions} (المتبقي: ${dataCopy.length})`;
    let scoreText = currentLang === 'en' ? `Score:` : `النتيجة:`;

    ques.innerHTML = `<div class="q">
    <div class="Qheader"> 
      <div class="resulte">
        ${qText}
     <div class="live-score">
                ${scoreText} <span>${score}</span>
            </div>
        </div>
      <div id="timer"></div>
      <img src="./image/f4a664cce5b07cba285e3de35b078141.png" class="img-style">
    </div>
    <div class="question-type">${q.type}</div>
    <div class="question_style">${q.question}</div>
    <div id="options-container"></div></div>
  `;
    let optionsContainer = document.getElementById("options-container");
    for (let op of q.options) {
        let btn = document.createElement("button");
        btn.className = "opt-btn";
        btn.textContent = op.text;
        btn.isCorrect = op.istrue;
        optionsContainer.appendChild(btn);
        btn.addEventListener("click", () => {
            stopTimer();
            checkAnswer(op.istrue, btn);

        });

    }
    StartTimer()
}function nextQuestion() {
    if (dataCopy.length > 0) {
        let randomIndex = Math.floor(Math.random() * dataCopy.length);
        let currentQuestion = dataCopy.splice(randomIndex, 1)[0];
        print(currentQuestion);
    } else {
        ques.style.display = "none";
        
        let endImage = score > (totalQuestions / 2)
            ? `<img src="./image/61074467a72012b87efa9fb6274df6f7.png" class="img-loss">`
            : `<img src="./image/df6d39a0955904b938f0d0625959d7b3.png" class="img-loss">`;
            
        // نصوص النهاية ديناميكية
        let gameOverText = currentLang === 'en' ? 'Game over 🎉!' : 'انتهت اللعبة 🎉!';
        let finalScoreText = currentLang === 'en' 
            ? `Your final score is: <strong>${score}</strong> from <strong>${totalQuestions}</strong>` 
            : `نتيجتك النهائية هي: <strong>${score}</strong> من <strong>${totalQuestions}</strong>`;
        let tryAgainText = currentLang === 'en' ? 'Try Again' : 'حاول مرة أخرى';

        end.innerHTML = `  <div class="end-msg">
        <h2> ${gameOverText} </h2>
        <p>${finalScoreText}</p>
        ${endImage}
        <button onclick="location.reload()">${tryAgainText}</button>
      </div>`;

        winsound.currentTime = 0;
        winsound.play();
    }
}
function checkAnswer(istrue, btn) {
    disable();
    if (istrue) {
        score++;
        btn.classList.add("correct-pulse");
        console.log(" صحيحة  +" + score);
        correctSound.currentTime = 0;
        correctSound.play();
    }
    else {
        console.log(" خاطئة");
        btn.classList.add("wrong-shake");
        wrongSound.currentTime = 0;
        wrongSound.play();
    }
    setTimeout(() => {
        nextQuestion();
    }, 1000);
}
function disable() {
    let allButtons = document.querySelectorAll(".opt-btn");
    for (let b of allButtons) {
        b.disabled = true;
        if (b.isCorrect === true) {
            b.classList.add("correct");
        }
    }
}

function StartTimer() {
    count = 10;
    let timerElement = document.getElementById("timer");
    timerElement.textContent = count;
    console.log(count)
    timeInterval = setInterval(() => {
        console.log(count)

        count--;
        if (count >= 0) {
            timerElement.textContent = count;
            if (count <= 3) {
                timerElement.classList.add("timer-danger");
            }
        }

        else {
            stopTimer();
            disable();
            wrongSound.currentTime = 0;
            wrongSound.play();
            setTimeout(() => {
                nextQuestion();
            }, 1000);
        }
    }, 1000)
}
function stopTimer() {
    clearInterval(timeInterval);
}

