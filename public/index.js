const submitButton = document.querySelector('#submit-button');
const lastNameInput = document.querySelector('#last-name'); // #last-name の要素を取得
const firstNameInput = document.querySelector('#first-name'); // #first-name の要素を取得
const favoriteThingsInput = document.querySelector('#favorite-things'); // #favorite-things の要素を取得
const nicknameCountInput = document.querySelector('#nickname-count'); // #nickname-count の要素を取得
const textarea = document.querySelector('#additional-info'); // #additional-info の要素を取得
const checkboxes = document.querySelectorAll('input[name="nickname_type"]'); // ニックネームタイプのチェックボックス
const resultTextArea = document.querySelector('#result-text'); // 結果を表示するエリア

submitButton.addEventListener('click', () => {
  const selectedCheckboxes = Array.from(checkboxes)
                                   .filter(cb => cb.checked)
                                   .map(cb => cb.value);

  const formData = {
    lastName: lastNameInput ? lastNameInput.value : '',              // 姓
    firstName: firstNameInput ? firstNameInput.value : '',            // 名
    favoriteThings: favoriteThingsInput ? favoriteThingsInput.value : '',  // 好きなもの
    nicknameTypes: selectedCheckboxes,          // 選ばれたニックネームのタイプ
    isForeigner: document.querySelector('input[name="foreigner"]:checked') ? 
                 document.querySelector('input[name="foreigner"]:checked').value : 'No', // 外国人かどうか
    nicknameCount: nicknameCountInput ? nicknameCountInput.value : 1,    // ニックネームの数
    additionalInfo: textarea ? textarea.value : ''              // その他の情報
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
        resultTextArea.value = `結果:\n${data.result}`;
      });
    } else {
      console.error("APIリクエストが失敗しました。ステータス:", response.status);
    }
  }).catch((error) => {
    console.error("APIリクエスト中にエラーが発生しました:", error);
  });
});
