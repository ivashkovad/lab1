const M_INTERVAL = 7000; // Твоя константа m

const quizData = new Map([
  [1, { q: "Что означает HTML?", a: "HyperText Markup Language", options: ["HyperText Markup Language", "High Tech Modern Language", "Hyperlink Text Mode", "Home Tool Markup"], img: "https://cdn-icons-png.flaticon.com/512/732/732212.png" }],
  [2, { q: "Какой тег используется для подключения JS?", a: "script", options: ["js", "scripting", "script", "javascript"], img: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png" }],
  [3, { q: "Что такое Closure (замыкание)?", a: "Функция + окружение", options: ["Просто функция", "Функция + окружение", "Метод массива", "Цикл"], img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH0FwG8VEU4Kp9MDQW4QArTewgJ0bs5LM7Yw&s" }],
  [4, { q: "Свойство CSS для смены цвета текста?", a: "color", options: ["text-style", "font-color", "color", "paint"], img: "https://cdn-icons-png.flaticon.com/512/732/732190.png" }],
  [5, { q: "Какой символ используется для ID в CSS?", a: "#", options: [".", "#", "&", "@"], img: "https://cdn-icons-png.flaticon.com/512/919/919826.png" }],
  [6, { q: "Как объявить константу в ES6?", a: "const", options: ["constant", "var", "let", "const"], img: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" }],
  [7, { q: "Что делает метод Array.map()?", a: "Создает новый массив", options: ["Удаляет элемент", "Создает новый массив", "Сортирует", "Ничего"], img: "https://i.ytimg.com/vi/rRgD1yVwIvE/maxresdefault.jpg" }],
  [8, { q: "Для чего нужен Docker?", a: "Контейнеризация", options: ["Стилизация", "Контейнеризация", "Базы данных", "Написание текста"], img: "https://cdn-icons-png.flaticon.com/512/919/919853.png" }],
  [9, { q: "Какая библиотека использует JSX?", a: "React", options: ["Vue", "Angular", "jQuery", "React"], img: "https://cdn-icons-png.flaticon.com/512/1126/1126012.png" }],
  [10, { q: "Что такое 'NaN'?", a: "Not a Number", options: ["New and Next", "Not a Number", "Null and None", "Name"], img: "https://dandkim.com/static/8da4668def0c4ccef925da76031f29b1/4b190/confused3.jpg" }]
]);

let currentIdx = 1;
let score = 0;
let timeN = 10;
let timerId = null;
let isAnswering = false;
const wrongAnswers = new Set(); // Коллекция Set для ошибок

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const progress = document.getElementById('progress');

document.getElementById('start-btn').onclick = () => {
  timeN = parseInt(document.getElementById('time-input').value) || 10;
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  showQuestion();
};

function showQuestion() {
  if (currentIdx > quizData.size) return showResults();

  isAnswering = false;
  const data = quizData.get(currentIdx);

  document.getElementById('question-number').innerText = `Вопрос ${currentIdx}/${quizData.size}`;
  document.getElementById('q-text').innerText = data.q;
  document.getElementById('q-image').src = data.img;

  const container = document.getElementById('options-container');
  container.innerHTML = '';
  document.getElementById('feedback').innerText = '';

  data.options.forEach(opt => {
    const label = document.createElement('label');
    label.className = 'option-item';
    label.innerHTML = `<input type="radio" name="answer" value="${opt}"> ${opt}`;
    label.onclick = () => {
      if (!isAnswering) checkAnswer(opt);
    };
    container.appendChild(label);
  });

  startTimer();
}

function startTimer() {
  let timeLeft = timeN;
  clearInterval(timerId);

  const updateUI = () => {
    document.getElementById('timer-text').innerText = timeLeft;
    progress.style.width = (timeLeft / timeN * 100) + '%';
  };

  updateUI();
  timerId = setInterval(() => {
    timeLeft--;
    updateUI();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      if (!isAnswering) checkAnswer(null);
    }
  }, 1000);
}

function checkAnswer(selected) {
  if (isAnswering) return;
  isAnswering = true;

  clearInterval(timerId);

  const data = quizData.get(currentIdx);
  const feedback = document.getElementById('feedback');

  const inputs = document.querySelectorAll('input[name="answer"]');
  inputs.forEach(input => input.disabled = true);

  if (selected === data.a) {
    feedback.innerText = "Верно!";
    feedback.style.color = "#4caf50";
    score++;
  } else {
    feedback.innerText = selected === null ? `Время вышло! Правильно: ${data.a}` : `Ошибка! Правильно: ${data.a}`;
    feedback.style.color = "#f44336";
    wrongAnswers.add(currentIdx);
  }

  setTimeout(() => {
    currentIdx++;
    showQuestion();
  }, 1500);
}

function showResults() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const statText = document.getElementById('stat-text');
  const moodImg = document.getElementById('result-mood-img');

  statText.innerText = `Ваш счет: ${score} из ${quizData.size}`;


  if (score <= 3) {

    moodImg.src = "https://memchik.ru/images/templates/plachet_ot_radosti.jpg";
  } else if (score <= 6) {

    moodImg.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfuT7IEBcx7YULaNK2Lekb44MAGwFbkNEEaw&s";
  } else {

    moodImg.src = "https://images.meme-arsenal.com/92ef712a5676879c33188a582635547f.jpg";
  }

  if (wrongAnswers.size > 0) {
    const btn = document.getElementById('review-btn');
    btn.classList.remove('hidden');
    btn.onclick = reviewMistakes;
  }
}

function reviewMistakes() {

  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  const wrongIdxs = Array.from(wrongAnswers);
  let i = 0;

  document.getElementById('timer-text').innerText = "Просмотр ошибок";
  progress.style.width = "100%";
  progress.style.background = "#ff9800";

  const displayError = (index) => {
    const qId = wrongIdxs[index];
    const data = quizData.get(qId);

    document.getElementById('question-number').innerText = `Ошибка ${index + 1}/${wrongIdxs.length}`;
    document.getElementById('q-text').innerText = data.q;
    document.getElementById('q-image').src = data.img;
    document.getElementById('options-container').innerHTML = `<div class="option-item" style="border: 2px solid #4caf50">Правильный ответ: <b>${data.a}</b></div>`;
    document.getElementById('feedback').innerText = "";
  };


  displayError(i);
  i++;


  const intervalM = setInterval(() => {
    if (i >= wrongIdxs.length) {
      clearInterval(intervalM);
      setTimeout(() => {
        alert("Просмотр ошибок завершен");
        location.reload();
      }, 500);
      return;
    }

    displayError(i);
    i++;
  }, M_INTERVAL);
}