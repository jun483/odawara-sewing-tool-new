/**
 * JUKI Recommendation Config
 * File: resources/js/machines/juki.js
 */
(function () {
  "use strict";
  if (!window.OSSMachineRegistry) return;

  window.OSSMachineRegistry.register("juki", {
    enabled: false, // 取り扱い開始時に true に変更
    name: "JUKI",

    getDetails: function (projectKey, fabricName) {
      return {
        id: "juki",
        badge: "JUKI（職業用・直線特化モデル）",
        color: "#10b981",
        tagline: "圧倒的な貫通力と美しく力強い直線縫い",
        models: "JUKI TL-30 / SL-700EX",
        description:
          "厚手生地や革・帆布の重ね縫いも軽々こなす、プロ・ハイアマチュア向けモデルです。",
        needle: "工業用針 DB×1 #11〜#16",
        thread: "スパン糸 #60 / #30",
        presser: "標準押え / スムース押え",
        advice:
          "高速縫製が可能なため、角部やカーブ手前ではフットコントローラーを緩めて調整してください。",
      };
    },
  });
})();
