// ============================================================
// 構文150 クイズ - アプリ本体
// ============================================================
const screenSettings = document.getElementById('screen-settings');
const screenQuiz = document.getElementById('screen-quiz');
const screenResult = document.getElementById('screen-result');

const numQuestionsInput = document.getElementById('num-questions');
const startNumberInput = document.getElementById('start-number');
const totalCountEl = document.getElementById('total-count');
const settingsError = document.getElementById('settings-error');
const btnStart = document.getElementById('btn-start');

const progressText = document.getElementById('progress-text');
const scoreText = document.getElementById('score-text');
const progressBar = document.getElementById('progress-bar');
const patternNoEl = document.getElementById('pattern-no');
const questionTextEl = document.getElementById('question-text');
const answerTextEl = document.getElementById('answer-text');
const btnReveal = document.getElementById('btn-reveal');
const judgeRow = document.getElementById('judge-row');
const btnCorrect = document.getElementById('btn-correct');
const btnWrong = document.getElementById('btn-wrong');
const btnQuit = document.getElementById('btn-quit');
const btnBackQuestion = document.getElementById('btn-back-question');
const btnBackAnswer = document.getElementById('btn-back-answer');
const explainWrap = document.getElementById('explain-wrap');
const btnExplainToggle = document.getElementById('btn-explain-toggle');
const explainBox = document.getElementById('explain-box');
const explainText = document.getElementById('explain-text');
const btnExplainClose = document.getElementById('btn-explain-close');
const resultCorrectEl = document.getElementById('result-correct');
const resultTotalEl = document.getElementById('result-total');
const resultPercentEl = document.getElementById('result-percent');
const reviewWrap = document.getElementById('review-wrap');
const reviewList = document.getElementById('review-list');
const btnRestart = document.getElementById('btn-restart');

let quizItems = [];   // 出題される構文の配列（{no, ja, en, dir}）
let currentIndex = 0;
let correctCount = 0;
let wrongItems = [];
let answerHistory = []; // ★追加：各問題の正誤を記録（「戻る」で取り消すために使う）

totalCountEl.textContent = QUIZ_DATA.length;
numQuestionsInput.max = QUIZ_DATA.length;

// ★ここから追加：前回使用時の設定を読み込む
const SETTINGS_KEY = 'koubun150-settings';
const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
if (savedSettings) {
  if (savedSettings.startNumber) startNumberInput.value = savedSettings.startNumber;
  if (savedSettings.numQuestions) numQuestionsInput.value = savedSettings.numQuestions;
}
// ★ここまで追加

function showScreen(el) {
  [screenSettings, screenQuiz, screenResult].forEach(s => s.classList.add('hidden'));
  el.classList.remove('hidden');
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

btnStart.addEventListener('click', () => {
  const startNumber = parseInt(startNumberInput.value, 10);
  const n = parseInt(numQuestionsInput.value, 10);
  const total = QUIZ_DATA.length;

  // 入力チェック
  if (!startNumber || startNumber < 1 || startNumber > total) {
    settingsError.textContent =
      `開始番号は 1〜${total} の範囲で入力してください。`;
    return;
  }

  if (!n || n < 1) {
    settingsError.textContent =
      '出題数は 1 以上で入力してください。';
    return;
  }

  const endNumber = startNumber + n - 1;

  if (endNumber > total) {
    settingsError.textContent =
      `No.${startNumber} から ${n} 個だと No.${endNumber} まで必要です。` +
      `No.${total} 以内になるようにしてください。`;
    return;
  }

  settingsError.textContent = '';

  // ★ここから追加：今回の設定を保存する
localStorage.setItem(SETTINGS_KEY, JSON.stringify({
  startNumber: startNumber,
  numQuestions: n
}));
// ★ここまで追加

  const direction =
    document.querySelector('input[name="direction"]:checked').value;

  const shuffleOn =
    document.getElementById('shuffle-order').checked;

  // 指定された範囲だけを取り出す
  let pool = QUIZ_DATA.slice(
    startNumber - 1,
    startNumber - 1 + n
  );

  // 「出題順をシャッフルする」がONなら、
  // 指定された範囲の中だけでシャッフルする
  if (shuffleOn) {
    pool = shuffle(pool);
  }

  quizItems = pool.map(item => {
    let dir = direction;

    if (direction === 'mix') {
      dir = Math.random() < 0.5 ? 'ja2en' : 'en2ja';
    }

    return { ...item, dir };
  });

  currentIndex = 0;
  correctCount = 0;
  wrongItems = [];
  answerHistory = [];

  showScreen(screenQuiz);
  renderQuestion();
});
    
function renderQuestion() {
  const item = quizItems[currentIndex];
  patternNoEl.textContent = item.no;
  progressText.textContent = `${currentIndex + 1} / ${quizItems.length}`;
  scoreText.textContent = `正解 ${correctCount}`;
  progressBar.style.width = `${(currentIndex / quizItems.length) * 100}%`;

  if (item.dir === 'ja2en') {
    questionTextEl.textContent = item.ja;
    answerTextEl.textContent = item.en;
  } else {
    questionTextEl.textContent = item.en;
    answerTextEl.textContent = item.ja;
  }

  answerTextEl.classList.add('hidden');
  judgeRow.classList.add('hidden');
  btnReveal.classList.remove('hidden');
  btnBackAnswer.classList.add('hidden');

  // ★追加：最初の問題では「戻る」ボタンを隠す
  if (currentIndex === 0) {
    btnBackQuestion.classList.add('hidden');
  } else {
    btnBackQuestion.classList.remove('hidden');
  }

  updateExplainAvailability();
}

// ★追加：英文が画面に表示されているときだけ「解説」ボタンを出す。
// 問題が切り替わるたびに解説ボックスは必ず閉じた状態に戻す。
function updateExplainAvailability() {
  const item = quizItems[currentIndex];
  const englishVisible =
    item.dir === 'en2ja' ||
    (item.dir === 'ja2en' && !answerTextEl.classList.contains('hidden'));

  if (englishVisible) {
    explainWrap.classList.remove('hidden');
    explainText.textContent = item.kaisetsu || '';
  } else {
    explainWrap.classList.add('hidden');
  }

  explainBox.classList.add('hidden');
  btnExplainToggle.classList.remove('hidden');
}

btnExplainToggle.addEventListener('click', () => {
  explainBox.classList.remove('hidden');
  btnExplainToggle.classList.add('hidden');
});

btnExplainClose.addEventListener('click', () => {
  explainBox.classList.add('hidden');
  btnExplainToggle.classList.remove('hidden');
});

btnReveal.addEventListener('click', () => {
  answerTextEl.classList.remove('hidden');
  judgeRow.classList.remove('hidden');
  btnReveal.classList.add('hidden');
  btnBackQuestion.classList.add('hidden');

  if (currentIndex > 0) {
    btnBackAnswer.classList.remove('hidden');
  }

  updateExplainAvailability();
});

function goNext(wasCorrect) {
  const item = quizItems[currentIndex];
  if (wasCorrect) {
    correctCount++;
  } else {
    wrongItems.push(item);
  }

  answerHistory.push(wasCorrect); // ★追加：正誤を記録

  currentIndex++;
  if (currentIndex < quizItems.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

btnCorrect.addEventListener('click', () => goNext(true));
btnWrong.addEventListener('click', () => goNext(false));

// ★ここから追加：一つ前の問題／解答に戻る
function goBack(revealAnswer) {
  if (currentIndex === 0) return; // 最初の問題より前には戻れない

  currentIndex--;

  // 一つ前の問題の正誤記録を取り消す（二重カウント防止）
  const lastWasCorrect = answerHistory.pop();
  if (lastWasCorrect === true) {
    correctCount--;
  } else if (lastWasCorrect === false) {
    wrongItems.pop();
  }

  renderQuestion();

  if (revealAnswer) {
    answerTextEl.classList.remove('hidden');
    judgeRow.classList.remove('hidden');
    btnReveal.classList.add('hidden');
    btnBackQuestion.classList.add('hidden');
    if (currentIndex > 0) {
      btnBackAnswer.classList.remove('hidden');
    }
    updateExplainAvailability();
  }
}

btnBackQuestion.addEventListener('click', () => goBack(false));
btnBackAnswer.addEventListener('click', () => goBack(true));
// ★ここまで追加

function finishQuiz() {
  progressBar.style.width = '100%';
  const total = quizItems.length;
  const percent = Math.round((correctCount / total) * 100);

  resultCorrectEl.textContent = correctCount;
  resultTotalEl.textContent = total;
  resultPercentEl.textContent = `正答率 ${percent}%`;

  if (wrongItems.length > 0) {
    reviewWrap.classList.remove('hidden');
    reviewList.innerHTML = '';
    wrongItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `No.${item.no}　${item.ja}　／　${item.en}`;
      reviewList.appendChild(li);
    });
  } else {
    reviewWrap.classList.add('hidden');
  }

  showScreen(screenResult);
}

btnRestart.addEventListener('click', () => {
  showScreen(screenSettings);
});

btnQuit.addEventListener('click', () => {
  showScreen(screenSettings);
  settingsError.textContent = '';
});

