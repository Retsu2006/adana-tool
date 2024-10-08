import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

const kvStore = await Deno.openKv(); 

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === "POST" && pathname === "/api/like") {
    try {
      const data = await request.json();
      const like_number = data.id;
      const key = ["likes", like_number];  // キーを配列形式で定義

      // いいねをKVストアに保存
      const existingLikes = (await kvStore.get(key))?.value || 0;
      const newLikes = existingLikes + 1;
      await kvStore.set(key, newLikes);

      return new Response(JSON.stringify({ likes: newLikes }), { status: 200 });
    } catch (error) {
      return new Response("Error", { status: 500 });
    }
  }

  if (request.method === "GET" && pathname === "/api/like-count") {
    const id = url.searchParams.get('id');
    const key = ["likes", id];  // キーを配列形式で定義
    const likeCount = (await kvStore.get(key))?.value || 0;
    return new Response(JSON.stringify({ likes: likeCount }), { status: 200 });
  }
  
  if (request.method === "POST" && pathname === "/api/hello") {
    try {
      const data = await request.json();
      console.log("受信したデータ:", data);

      const nicknameCount = Math.min(data.nicknameCount, 10);

      const nicknames = new Set();
      const usedSurnames = new Set();

      while (nicknames.size < nicknameCount) {
        const nickname = generateNickname(data, usedSurnames);
        if (nickname) {
          nicknames.add(nickname);
        }
      }

      return new Response(JSON.stringify({
        result: Array.from(nicknames).join('\n')
      }), { status: 200 });
    } catch (error) {
      console.error("データの処理中にエラーが発生しました:", error);
      return new Response("データの処理中にエラーが発生しました", { status: 500 });
    }
  }

  return serveDir(request, {
    fsRoot: "./public/",
    urlRoot: "",
    enableCors: true,
  });
});

function generateNickname(data, usedSurnames) {
  const { lastName, firstName, nicknameTypes, customModifier, isForeigner } = data;

  // 修飾語のカテゴリーごとのリストを定義
  const modifiers = {
    かわいい: [
        "ふわふわ", "ちびこ", "にこにこ", "まるまる", "ぽんぽん", "キラキラ", "ぴょんぴょん", "もこもこ", "ぽよぽよ", "ふにゃふにゃ", 
        "かわい子", "もちもち", "ころころ", "にゃんにゃん", "ちゅんちゅん", "ぽかぽか", "ふかふか", "しゅわしゅわ", "にょろにょろ", "ぷりぷり",
        "にょきにょき", "くるくる", "ぽてぽて", "ぷにぷに", "ふわふわ", "もふもふ", "ぴかぴか", "にゃん", "わん", "たまご", 
        "ふりふり", "みるみる", "ちょこちょこ", "ころん", "ぽよん", "ひよこ", "たわし", "ぽっぽ", "くろくろ", "しろしろ",
        "うさうさ", "にくきゅう", "ふーふー", "ちょん", "ぴょこん", "おむすび", "にぎにぎ", "こぶこぶ", "ぺこぺこ", "ぴかぴか"
    ],
    かっこいい: [
        "クール", "カッコイイ", "シャープ", "シャット", "スマート", "タフ", "スリッシュ", "ワイルド", "イメージ", "シック", 
        "ストロング", "パワフル", "ブレイブ", "グレート", "ダンディ", "フェニックス", "サイレント", "ミステリアス", "ギャング", "メタル",
        "レイザー", "ヴァルキリー", "ドラゴン", "ハンター", "ウルフ", "サムライ", "シャドウ", "ナイト", "エース", "ブレード", 
        "ターボ", "エクスプレス", "ジャガー", "スティール", "イーグル", "ストライカー", "スペクトル", "シークレット", "カリスマ", "フューリー",
        "マグナム", "ファントム", "ディーゼル", "グリフィン", "ストーム", "ガーディアン", "バイパー", "インパクト", "カタナ", "シルバー"
    ],
    怖い: [
        "ダーク", "シャドウ", "鬼のよう", "デビル", "どくろ", "殺し屋", "おっかない", "幽霊", "地獄", "影", 
        "ゴースト", "ナイトメア", "バンシー", "ゾンビ", "ヴァンパイア", "クルエル", "スケルトン", "デス", "デモン", "グール",
        "ハーピー", "ファントム", "グリム", "ミスト", "スラッシャー", "スカル", "サクリファイス", "ワーウルフ", "クリープ", "メイヘム",
        "ネクロマンサー", "アポカリプス", "ドレッド", "ミュート", "エクリプス", "レイブン", "シャドーランナー", "スペクター", "カース", "ブラックホール",
        "ダークソウル", "フレイヤ", "リーパー", "ディストーション", "ブッチャー", "サイレントヒル", "モンスター", "ワーデン", "フロストバイト", "ノーザン"
    ],
    面白い: [
        "笑い袋", "ゲラゲラ", "コメディ", "ピエロ", "ボケボケ", "コーモラス", "いたずら", "ニコニコ", "トリックスタ", "クスクス", 
        "パロディ", "ギャグ", "オチャメ", "ユーモア", "バカ", "おふざけ", "マヌケ", "ミラクル", "モンキー", "ハチャメチャ",
        "ドタバタ", "バカバカ", "ムチャクチャ", "ガハハ", "ピエロ", "ボケナス", "パピプペポ", "ノホホン", "ヘラヘラ", "ドリフター",
        "カリカリ", "メチャクチャ", "ウキャキャ", "テケテケ", "サバサバ", "ウケケ", "バタバタ", "イヒヒ", "チャラチャラ", "オイオイ",
        "ホホホ", "クスクス", "ウホウホ", "プププ", "パカパカ", "ドジッ子", "フニャフニャ", "ズッコケ", "ドッカン", "カラカラ"
    ],
    明るい: [
        "サンシャイン", "スイール", "ピカピカ", "光のよう", "ハッピー", "かわいい", "ぴかぴか", "ホット", "びかびか", "ジャンプ", 
        "スパーク", "ブライト", "シャイニー", "グリッター", "ゴールデン", "クリスタル", "エンジェル", "フレッシュ", "エナジー", "グロウ",
        "レイ", "ライト", "シャイン", "フラッシュ", "スカイ", "ミラージュ", "エレクトリック", "ソーラー", "オーロラ", "ビーム",
        "ブリリアント", "スター", "シルバー", "コメット", "ブリッジ", "ルミナス", "ホープ", "ドリーム", "ブロッサム", "スパークル",
        "クレスト", "ブルーム", "ウィング", "フュージョン", "スプラッシュ", "ライトニング", "セラフィム", "フロスティ", "グロー", "ダイヤモンド"
    ],
    うるさい: [
        "ガンガン", "バリバリ", "ドンドン", "ビリビリ", "わいわい", "わめき声", "ぴかぴか", "ガヤガヤ", "ブンブン", "ギャーギャー", 
        "ドカドカ", "ズンチャカ", "ドシンドシン", "バタバタ", "ピーピー", "ガチャガチャ", "ガタンガタン", "ドーン", "ガシャーン", "ゴロゴロ",
        "カンカン", "チャカチャカ", "ピンポン", "ヒューヒュー", "バンバン", "タタタ", "ピンピン", "ドンドン", "バリバリ", "ブンブン",
        "ガタガタ", "バリバリ", "ブーブー", "チャチャ", "ピーポー", "ワンワン", "ビービー", "ギュイーン", "ドッカン", "ゴツゴツ",
        "キュルキュル", "ガシャガシャ", "ピーピー", "パキパキ", "ワチャワチャ", "ズンズン", "ガンガン", "ガラガラ", "ドシン", "キーン"
    ]
  };

  // ランダムに選ばれる日本の苗字リスト
  const japaneseSurnames = [
    "佐藤", "鈴木", "高橋", "田中", "渡辺", "山本", "中村", "小林", "加藤", "吉田",
    "山田", "佐々木", "山口", "松本", "井上", "木村", "林", "斉藤", "清水", "山崎",
    "森", "池田", "橋本", "阿部", "石川", "森田", "藤田", "上田", "原田", "武田",
    "川口", "小川", "吉川", "松井", "中川", "岡本", "伊藤", "長谷川", "安藤", "藤原",
    "中島", "川村", "大野", "石田", "古川", "土屋", "岡田", "坂本", "酒井", "桜井",
    "千葉", "久保", "渡部", "大島", "大西", "杉本", "新井", "菅原", "西村", "内田",
    "小野", "宮崎", "野口", "武藤", "野村", "石井", "工藤", "岩田", "丸山", "福田",
    "田村", "堀内", "辻", "片山", "三浦", "小山", "前田", "成田", "片桐", "中西",
    "内山", "島田", "尾崎", "星野", "平田", "福井", "稲垣", "栗原", "榎本", "武井",
    "篠原", "小池", "塩谷", "黒田", "相沢", "村田", "本田", "秋山", "菊地", "市川"
  ];

  let nickname;

  if (isForeigner === "Yes") {
    let modifiedLastName;
    do {
      modifiedLastName = japaneseSurnames[Math.floor(Math.random() * japaneseSurnames.length)];
    } while (usedSurnames.has(modifiedLastName));
    usedSurnames.add(modifiedLastName);
    nickname = modifiedLastName + firstName;
    return nickname;
  }

  let options = [];
  if (customModifier) {
    options.push(customModifier);
  } else {
    const selectedType = nicknameTypes[Math.floor(Math.random() * nicknameTypes.length)];
    options = modifiers[selectedType] || [];
  }

  const selectedModifier = options[Math.floor(Math.random() * options.length)];

  const pattern = Math.floor(Math.random() * 4);

  switch (pattern) {
    case 0:
      nickname = selectedModifier + lastName;
      break;
    case 1:
      nickname = selectedModifier + firstName;
      break;
    case 2:
      nickname = lastName + selectedModifier;
      break;
    case 3:
      nickname = firstName + selectedModifier;
      break;
  }

  return nickname;
}