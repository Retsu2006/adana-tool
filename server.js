import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

Deno.serve(async (request) => {
  const pathname = new URL(request.url).pathname;
  console.log(`パス: ${pathname}`);

  if (request.method === "POST" && pathname === "/api/hello") {
    try {
      const data = await request.json();
      console.log("受信したデータ:", data);

      // 生成するニックネームの数を最大5個に制限
      const nicknameCount = Math.min(data.nicknameCount, 10);

      // 指定された数のニックネームを生成
      const nicknames = [];
      for (let i = 0; i < nicknameCount; i++) {
        nicknames.push(generateNickname(data));
      }

      // 処理後のレスポンスを返す
      return new Response(JSON.stringify({
          result: nicknames.join('\n')  // 改行で区切ってニックネームをまとめる
      }));
    } catch (error) {
      console.error("データの処理中にエラーが発生しました:", error);
      return new Response("データの処理中にエラーが発生しました", { status: 500 });
    }
  }

  // 静的ファイルを提供する
  return serveDir(request, {
    fsRoot: "./public/",
    urlRoot: "",
    enableCors: true,
  });
});

function generateNickname(data) {
  const { lastName, firstName, nicknameTypes, isForeigner } = data;

  // 修飾語のカテゴリーごとのリストを定義
  const modifiers = {
    かわいい: ["ふわふわ", "ちびこ", "にこにこ", "まるまる", "ぽんぽん", "キラキラ", "ぴょんぴょん", "もこもこ", "ぽよぽよ", "ふにゃふにゃ"],
    かっこいい: ["クール", "カッコイイ", "シャープ", "シャット", "スマート", "タフ", "スリッシュ", "ワイルド", "イメージ", "シック"],
    怖い: ["ダーク", "シャドウ", "鬼のよう", "デビル", "どくろ", "殺し屋", "おっかない", "幽霊", "地獄", "影"],
    面白い: ["笑い袋", "ゲラゲラ", "コメディ", "ピエロ", "ボケボケ", "コーモラス", "いたずら", "ニコニコ", "トリックスタ", "クスクス"],
    明るい: ["サンシャイン", "スイール", "ピカピカ", "光のよう", "ハッピー", "かわいい", "ぴかぴか", "ホット", "びかびか", "ジャンプ"],
    うるさい: ["ガンガン", "バリバリ", "ドンドン", "ビリビリ", "わいわい", "わめき声", "ぴかぴか", "ガヤガヤ", "ブンブン", "ギャーギャー"]
  };

  // 選択されたカテゴリーからランダムで1つの修飾語を選択
  const selectedType = nicknameTypes[Math.floor(Math.random() * nicknameTypes.length)];
  const options = modifiers[selectedType];
  const selectedModifier = options[Math.floor(Math.random() * options.length)];

  // 修飾語の配置パターンをランダムに選択
  let nickname;
  const pattern = Math.floor(Math.random() * 4);

  switch (pattern) {
    case 0:
      nickname = selectedModifier + lastName; // 修飾語 + 姓
      break;
    case 1:
      nickname = selectedModifier + firstName; // 修飾語 + 名
      break;
    case 2:
      nickname = lastName + selectedModifier; // 姓 + 修飾語
      break;
    case 3:
      nickname = firstName + selectedModifier; // 名 + 修飾語
      break;
  }

  // 外国人オプションの処理
  if (isForeigner === "Yes") {
    nickname += "外国人";
  }

  return nickname;
}
