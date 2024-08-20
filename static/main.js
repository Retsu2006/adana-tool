const submitButton = document.querySelector('#submit-button');
const input = document.querySelectorAll('input');
const textarea = document.querySelector('textarea');
const checkboxes = document.querySelectorAll('input[name="nickname_type"]');

// チェックされたボックスの値を取得
submitButton.addEventListener('click', () => {
  const selectedCheckboxes = Array.from(checkboxes)
                                   .filter(cb => cb.checked) // チェックされているもののみフィルタリング
                                   .map(cb => cb.value);     // 値を取得

  const formData = {
    kanjiName: input[0].value,             // 名前（漢字）
    hiraganaName: input[1].value,          // 名前（ひらがな）
    favoriteThings: input[2].value,        // 好きなもの
    nicknameTypes: selectedCheckboxes,     // あだ名の代名詞（複数選択可）
    isForeigner: document.querySelector('input[name="foreigner"]:checked').value,  // 外国人ですか（Yes/No）
    nicknameCount: input[11].value,         // 作ってほしいあだ名の数（正しいインデックスを使用）
    additionalInfo: textarea.value         // 他に参考してほしい内容
  };

  console.log("送信するデータ:", formData);  // 送信前にデータをログに出力

  fetch("/api/hello", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then((response) => {
    if (response.ok) {
      console.log("APIリクエストが成功しました。");
      response.json().then((data) => {
        console.log("サーバーからのレスポンス:", data.result);
      });
    } else {
      console.error("APIリクエストが失敗しました。ステータス:", response.status);
    }
  }).catch((error) => {
    console.error("APIリクエスト中にエラーが発生しました:", error);
  });
});
