
let currentLevel = 1;
let score = 0;
let streak = 0;
let round = 1;
let timer;
let questionsByLevel = {};
let currentAnswer = "";
const levelPerRound = 10;

function loadQuestions(data) {
  questionsByLevel = {};
  data.forEach(q => {
    if (!questionsByLevel[q.level]) questionsByLevel[q.level] = [];
    questionsByLevel[q.level].push(q);
  });
  nextQuestion();
}

function nextQuestion() {
  const adjustedLevel = currentLevel + (round - 1) * levelPerRound;
  const levelQuestions = questionsByLevel[adjustedLevel];

  if (!levelQuestions || levelQuestions.length === 0) {
    alert("Không còn câu hỏi ở cấp độ này. Trò chơi kết thúc.");
    return;
  }

  const qIndex = Math.floor(Math.random() * levelQuestions.length);
  const question = levelQuestions[qIndex];
  currentAnswer = question.correct;
  const shuffledOptions = shuffle([...question.options]);

  document.getElementById("question").innerText = `[Cấp độ ${adjustedLevel}] ${question.question}`;
  document.getElementById("answers").innerHTML = shuffledOptions.map(opt =>
    `<button onclick="checkAnswer('${opt}')">${opt}</button>`
  ).join('');
  document.getElementById("result").innerText = "";
  document.getElementById("score").innerText = `Điểm: ${score} | Cấp độ: ${adjustedLevel}`;

  startTimer(15);
}

function checkAnswer(selected) {
  clearInterval(timer);
  if (selected === currentAnswer) {
    score++;
    streak++;
    document.getElementById("result").innerText = "✅ Chính xác!";
    if (streak >= 3) {
      currentLevel++;
      streak = 0;
      if (currentLevel > levelPerRound) {
        currentLevel = 1;
        round++;
        alert(`🎉 Bạn đã lên vòng ${round}!`);
      }
    }
  } else {
    streak = 0;
    document.getElementById("result").innerText = `❌ Sai! Đáp án đúng là: ${currentAnswer}`;
  }
  const adjustedLevel = currentLevel + (round - 1) * levelPerRound;
  document.getElementById("score").innerText = `Điểm: ${score} | Cấp độ: ${adjustedLevel}`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTimer(seconds) {
  let time = seconds;
  document.getElementById("result").innerText = `⏳ Thời gian còn lại: ${time}s`;
  timer = setInterval(() => {
    time--;
    if (time <= 0) {
      clearInterval(timer);
      document.getElementById("result").innerText = `⏰ Hết giờ! Đáp án đúng là: ${currentAnswer}`;
      streak = 0;
    } else {
      document.getElementById("result").innerText = `⏳ Thời gian còn lại: ${time}s`;
    }
  }, 1000);
}

fetch("data/questions_level_1.json")
  .then(res => res.json())
  .then(data => loadQuestions(data));
