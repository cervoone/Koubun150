// ==========================================================
// 構文データ
// ここに150個ぶんの構文を登録します（今はサンプルで12個だけ入っています）
//
// 書き方：
//   { no: 番号, ja: "日本語", en: "英語" }
//
// no   … 構文の通し番号（1〜150）
// ja   … 日本語訳・説明
// en   … 対応する英文（構文を使った例文）
//
// ★ 増やし方
// 1行コピーして、no / ja / en を書き換えるだけでOKです。
// Excelなどで一覧を作ってある場合は、Claudeに
// 「このExcelの内容をこの形式のJSに変換して」と頼むと
// 一気に変換してもらえます。
// ==========================================================

const QUIZ_DATA = [
  { no: 1,  ja: "〜するとすぐに…した",                 en: "As soon as I got home, it started to rain." },
  { no: 2,  ja: "〜するのは…ということだ（強調構文）",   en: "It was Tom that broke the window." },
  { no: 3,  ja: "〜しさえすれば…",                       en: "As long as you try your best, that's all that matters." },
  { no: 4,  ja: "まるで〜であるかのように",              en: "She talks as if she knew everything." },
  { no: 5,  ja: "〜する一方で…",                         en: "While some students like math, others prefer art." },
  { no: 6,  ja: "〜であればあるほど…",                   en: "The more you practice, the better you get." },
  { no: 7,  ja: "〜しない限り…",                         en: "You won't pass unless you study harder." },
  { no: 8,  ja: "〜するやいなや…",                       en: "No sooner had he arrived than the meeting began." },
  { no: 9,  ja: "〜にもかかわらず…",                     en: "Despite the heavy rain, they continued the game." },
  { no: 10, ja: "〜するために（目的）",                  en: "She got up early so that she could catch the first train." },
  { no: 11, ja: "〜であるはずがない",                    en: "That can't be true." },
  { no: 12, ja: "〜したに違いない",                      en: "He must have forgotten his promise." },
];
