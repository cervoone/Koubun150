# 構文150 クイズ

日本語⇔英語の構文（例文）を出題する、自己採点式のクイズアプリです。
サーバー不要の静的サイトなので、GitHub + Vercel で無料で公開できます。

## ファイル構成

```
kobun150-quiz/
├── index.html   … 画面のHTML（設定・出題・結果の3画面）
├── style.css    … デザイン
├── app.js       … 出題ロジック・採点ロジック
├── data.js      … 構文データ（ここを150個ぶん埋める）
└── README.md    … このファイル
```

## 1. 構文データを150個に増やす

`data.js` を開いて、サンプルの12行を参考に増やしてください。書き方はこの形です。

```js
{ no: 13, ja: "日本語訳", en: "対応する英文" },
```

- `no` … 通し番号（1〜150）
- `ja` … 日本語（意味・訳）
- `en` … その構文を使った英文

150行分をExcelなどでリスト化してある場合は、次にClaudeに相談するときに
「このExcelの中身をdata.js形式に変換して」と頼めば、一括で変換できます。

## 2. 手元で動作確認する（任意）

ブラウザで `index.html` を直接開くだけで動作します。
（`fetch` を使っていないので、二重クリックで開いてもOKです）

## 3. GitHubにリポジトリを作る

1. https://github.com にログイン → 右上の「+」→「New repository」
2. リポジトリ名を決める（例: `kobun150-quiz`）→ Public でも Private でもOK
3. 「Create repository」を押す（README等は追加しなくてOK）

パソコンから、このフォルダを push します（ターミナルで実行）:

```bash
cd kobun150-quiz
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/【あなたのユーザー名】/kobun150-quiz.git
git push -u origin main
```

※ Gitを使ったことがない場合は、GitHubのリポジトリ画面にある
「uploading an existing file」からドラッグ&ドロップでアップロードするだけでもOKです。

## 4. Vercelで公開する

1. https://vercel.com にアクセスし、GitHubアカウントでログイン
2. 「Add New...」→「Project」
3. 先ほどの `kobun150-quiz` リポジトリを選んで「Import」
4. 設定はそのままでOK（Framework Preset は "Other" のままでOK。ビルド不要な静的サイトです）
5. 「Deploy」をクリック

数十秒で `https://kobun150-quiz-〇〇.vercel.app` のようなURLが発行され、公開完了です。

## 5. 更新したいとき

`data.js` を編集して、GitHubに再度 push（またはWeb上で直接編集して commit）すれば、
Vercelが自動的に再ビルド・再デプロイしてくれます。

```bash
git add data.js
git commit -m "構文を追加"
git push
```

## アプリの機能

- 出題数を自由に設定（1〜登録数まで）
- 出題形式：日本語→英語 / 英語→日本語 / ランダム混合
- 出題順のシャッフルON/OFF
- 「こたえを見る」→ 自己採点方式（正解/不正解を自分でタップ）
- 終了後、正解数・正答率と、間違えた構文の復習リストを表示
