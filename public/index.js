const submitButton = document.querySelector('#submit-button');
const input = document.querySelectorAll('input');
const textarea = document.querySelector('textarea');
const checkboxes = document.querySelectorAll('input[name="nickname_type"]');
const resultTextArea = document.querySelector('#result-text'); // 結果を表示するエリア

submitButton.addEventListener('click', () => {
  const selectedCheckboxes = Array.from(checkboxes)
                                   .filter(cb => cb.checked)
                                   .map(cb => cb.value);

  const formData = {
    kanjiName: input[0].value,             
    hiraganaName: input[1].value,         
    favoriteThings: input[2].value,        
    nicknameTypes: selectedCheckboxes,     
    isForeigner: document.querySelector('input[name="foreigner"]:checked').value,
    nicknameCount: input[11].value,        
    additionalInfo: textarea.value         
  };

  console.log("送信するデータ:", formData);

  fetch("/api/hello", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((response) => {
    if (response.ok) {
      console.log("APIリクエストが成功しました。");
      response.json().then((data) => {
        console.log("サーバーからのレスポンス:", data.result);
        
        // 結果をtextareaに表示
        resultTextArea.value = `結果: 田中太郎`;
      });
    } else {
      console.error("APIリクエストが失敗しました。ステータス:", response.status);
    }
  }).catch((error) => {
    console.error("APIリクエスト中にエラーが発生しました:", error);
  });
});
