/**
 * Janome Recommendation Config
 * File: resources/js/machines/janome.js
 */
(function () {
  "use strict";
  window.OSSMachineRegistry = window.OSSMachineRegistry || {
    machines: {},
    register: function (id, c) {
      this.machines[id] = c;
    },
  };

  window.OSSMachineRegistry.register("janome", {
    enabled: false,
    name: "ジャノメ",

    getDetails: function (projectKey, fabricName) {
      const isHeavy = ["lesson_bag", "shoe_bag", "tote", "knapsack"].includes(
        projectKey,
      );
      const isQuilting =
        fabricName &&
        (fabricName.includes("quilting") || fabricName.includes("キルト"));
      const isCanvas =
        fabricName &&
        (fabricName.includes("canvas") || fabricName.includes("帆布"));

      if (isHeavy || isQuilting || isCanvas) {
        return {
          id: "janome",
          badge: "ジャノメ（厚物・強力パワー）",
          color: "#2563eb",
          tagline: "厚手生地・テープ重ね縫い対応",
          models: "ジャノメ NP860 / MP470M",
          description:
            "アクリルテープの重ね縫いや厚手生地も、力強い布送りで針が止まらずスムーズに縫えます。",
          needle: "オルガン針 HA×1 #14（厚地用）",
          thread: "シャッペスパン #60 または #30",
          presser: "基本押え（段差固定ボタン利用）",
          advice:
            "厚みのある重なり部分は針を#14にし、手回しで慎重に進めると綺麗に仕上がります。",
        };
      }

      return {
        id: "janome",
        badge: "ジャノメ（標準・万能）",
        color: "#2563eb",
        tagline: "使いやすさと仕上がりの美しさを両立",
        models: "ジャノメ NP860 / MP470M",
        description:
          "自動糸調子・自動糸切り機能付き。入園入学グッズから小物づくりまで幅広く対応します。",
        needle: "オルガン針 HA×1 #11（普通地用）",
        thread: "シャッペスパン #60（普通地用）",
        presser: "基本押え（A押え）/ 裁ち目かがり押え",
        advice:
          "布端はジグザグ縫いまたは裁ち目かがりで処理し、糸くずが出ないよう整えましょう。",
      };
    },
  });
})();
