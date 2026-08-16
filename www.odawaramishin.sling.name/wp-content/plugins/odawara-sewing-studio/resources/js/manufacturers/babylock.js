/**
 * Baby Lock Recommendation Config
 * File: resources/js/machines/babylock.js
 */
(function () {
  "use strict";
  if (!window.OSSMachineRegistry) return;

  window.OSSMachineRegistry.register("babylock", {
    enabled: true, // 有効化フラグ
    name: "ベビーロック",

    getDetails: function (projectKey, fabricName) {
      const isKnit =
        fabricName &&
        (fabricName.includes("knit") || fabricName.includes("ニット"));

      return {
        id: "babylock",
        badge: "ベビーロック（端処理・ロックミシン）",
        color: "#d97706",
        tagline: isKnit
          ? "ニット縫製・伸縮縫いの決定版"
          : "プロ級の美しい端処理・かがり縫い",
        models: "ベビーロック 糸取物語 / 衣縫人シリーズ",
        description: isKnit
          ? "エアスルー（自動エア糸通し）で準備も簡単。ニット生地の縫い合わせと端処理が同時に完成します。"
          : "生地の端を切りながらキレイにかがり縫い。既製品のような頑丈で美しい仕上がりになります。",
        needle: isKnit
          ? "ニット専用針 HA×1ST #11〜#14"
          : "オルガン針 HA×1SP #11",
        thread: isKnit ? "バルキー糸 / レジロン糸" : "ロックミシン用糸 #90",
        presser: "標準ロック押え",
        advice: isKnit
          ? "ニット生地はロックミシン1台で端処理と縫い合わせが同時に完了するため非常に効率的です。"
          : "ほつれやすい生地や作品の完成度を格段に上げたい場合に最適です。",
      };
    },
  });
})();
