import { startConfetti } from "./animation.js"

const submitButton = document.querySelector('#submit-button');
const lastNameInput = document.querySelector('#last-name');
const firstNameInput = document.querySelector('#first-name');
const nicknameCountInput = document.querySelector('#nickname-count');
const resultTextArea = document.querySelector('#result-text');
const customModifierInput = document.querySelector('#custom-modifier');
const savedModifiersTextArea = document.querySelector('#saved-modifiers');
const checkboxes = document.querySelectorAll('input[name="nickname_type"]');
const bgm = document.getElementById('bgm');
const toggleButton = document.getElementById('toggle-bgm');
const volumeControl = document.getElementById('volume-control');
const themeSelect = document.getElementById('theme-select');
const likeButtons = document.querySelectorAll('.like-button');

document.addEventListener('DOMContentLoaded', () => {
  likeButtons.forEach(button => {
      const nicknameId = button.closest('.nickname-item').getAttribute('data-id');
      fetch(`/api/like-count?id=${nicknameId}`)
          .then(response => response.json())
          .then(data => {
              const likesDisplay = button.nextElementSibling;
              likesDisplay.textContent = `いいね: ${data.likes}`;
          });
  });
});

likeButtons.forEach(button => {
  button.addEventListener('click', () => {
      const nicknameId = button.closest('.nickname-item').getAttribute('data-id');
      fetch('/api/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: nicknameId }),
      })
      .then(response => response.json())
      .then(data => {
          const likesDisplay = button.nextElementSibling;
          likesDisplay.textContent = `いいね: ${data.likes}`;

          
          startConfetti();  
      });
  });
});


themeSelect.addEventListener('change', () => {
    const selectedTheme = themeSelect.value;

    // 古いテーマを削除
    document.body.className = '';
    document.getElementById('nickname-form-container').className = '';
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.className = '');

    // 新しいテーマを適用
    document.body.classList.add(selectedTheme);
    document.getElementById('nickname-form-container').classList.add(selectedTheme);
    buttons.forEach(button => button.classList.add(selectedTheme));
});

document.addEventListener('DOMContentLoaded', () => {
  const defaultTheme = 'light';
  document.body.classList.add(defaultTheme);
  document.getElementById('nickname-form-container').classList.add(defaultTheme);
  document.querySelectorAll('button').forEach(button => button.classList.add(defaultTheme));
});

// BGMのオン/オフを切り替える
toggleButton.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play();
        toggleButton.textContent = 'BGMオフ';
    } else {
        bgm.pause();
        toggleButton.textContent = 'BGMオン';
    }
});

// 音量を調整する
volumeControl.addEventListener('input', () => {
    bgm.volume = volumeControl.value;
});

let savedModifiers = [];

// ローカルストレージから保存された修飾語を読み込む
function loadSavedModifiers() {
  const saved = localStorage.getItem('customModifiers');
  if (saved) {
    savedModifiers = JSON.parse(saved);
    savedModifiersTextArea.value = savedModifiers.join(', ');
  }
}

const resetButton = document.querySelector('#reset-button');

// カスタム修飾語を初期化する処理
resetButton.addEventListener('click', () => {
  // ローカルストレージからカスタム修飾語を削除
  localStorage.removeItem('customModifiers');
  
  // 保存された修飾語の配列を空にする
  savedModifiers = [];
  
  // 画面の表示をクリアする
  savedModifiersTextArea.value = '';
  
  console.log("カスタム修飾語が初期化されました。");
});

// 保存された修飾語をローカルストレージに保存
function saveCustomModifier(modifier) {
  savedModifiers.push(modifier);
  localStorage.setItem('customModifiers', JSON.stringify(savedModifiers));
  savedModifiersTextArea.value = savedModifiers.join(', ');
}

submitButton.addEventListener('click', () => {
  const selectedCheckboxes = Array.from(checkboxes)
                                   .filter(cb => cb.checked)
                                   .map(cb => cb.value);

  const customModifier = customModifierInput.value.trim();
  if (customModifier) {
    saveCustomModifier(customModifier);
  }

  const formData = {
    lastName: lastNameInput.value || '',
    firstName: firstNameInput.value || '',
    nicknameTypes: selectedCheckboxes,
    customModifier: customModifier,  // カスタム修飾語を追加
    isForeigner: document.querySelector('input[name="foreigner"]:checked') ? 
                 document.querySelector('input[name="foreigner"]:checked').value : 'No',
    nicknameCount: nicknameCountInput.value || 1,
  };

  console.log("送信するデータ:", formData);

  fetch("/api/hello", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        resultTextArea.value = `結果:\n${data.result}`;
      });
    } else {
      console.error("APIリクエストが失敗しました。ステータス:", response.status);
    }
  }).catch((error) => {
    console.error("APIリクエスト中にエラーが発生しました:", error);
  });
});

loadSavedModifiers(); // ページ読み込み時に保存された修飾語を表示
