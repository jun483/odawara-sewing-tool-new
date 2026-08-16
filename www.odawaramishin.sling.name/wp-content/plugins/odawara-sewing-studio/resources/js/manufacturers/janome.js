/**
 * Janome Machine Configuration
 * File: resources/js/manufacturers/janome.js
 */

(function () {
  "use strict";

  console.log("[OSS] janome.js loaded");

  // --------------------------------------------------
  // OSSMachineRegistry の安全な初期化
  // --------------------------------------------------

  window.OSSMachineRegistry = window.OSSMachineRegistry || {};

  window.OSSMachineRegistry.machines = window.OSSMachineRegistry.machines || {};

  // register が存在しない場合だけ作成
  if (typeof window.OSSMachineRegistry.register !== "function") {
    window.OSSMachineRegistry.register = function (id, config) {
      this.machines[id] = config;
    };
  }

  // getRecommendations が存在しない場合だけ作成
  if (typeof window.OSSMachineRegistry.getRecommendations !== "function") {
    window.OSSMachineRegistry.getRecommendations = function (
      projectKey,
      fabricName,
    ) {
      const results = [];

      for (const id in this.machines) {
        const machine = this.machines[id];

        if (!machine) {
          continue;
        }

        if (machine.enabled !== true) {
          continue;
        }

        if (typeof machine.getDetails !== "function") {
          continue;
        }

        try {
          const detail = machine.getDetails(projectKey, fabricName);

          if (detail) {
            results.push(detail);
          }
        } catch (error) {
          console.error("[OSS] Machine recommendation error:", id, error);
        }
      }

      return results;
    };
  }

  // --------------------------------------------------
  // ジャノメ登録
  // --------------------------------------------------

  window.OSSMachineRegistry.register("janome", {
    enabled: true,

    name: "ジャノメ",

    getDetails: function (projectKey, fabricName) {
      fabricName = fabricName || "";

      const heavyProjects = ["lesson_bag", "shoe_bag", "tote", "knapsack"];

      const isHeavy =
        heavyProjects.includes(projectKey) ||
        fabricName.includes("canvas") ||
        fabricName.includes("帆布") ||
        fabricName.includes("quilting") ||
        fabricName.includes("キルト") ||
        fabricName.includes("quilt");

      const isThin =
        fabricName.includes("thin") ||
        fabricName.includes("lawn") ||
        fabricName.includes("薄地") ||
        fabricName.includes("ローン");

      // ------------------------------------------------
      // 厚地
      // ------------------------------------------------

      if (isHeavy) {
        return {
          id: "janome",

          badge: "ジャノメ（厚物・強力パワー）",

          color: "#2563eb",

          models: "NP860 / MP470M",

          description:
            "アクリルテープの重ね縫いや厚手生地も、力強い布送りでスムーズに縫えます。",

          needle: "HA×1 #14（厚地用）",

          thread: "シャッペスパン #60 または #30",

          presser: "基本押え（段差固定ボタン使用）",

          advice:
            "重なり部分は針を#14にし、手回しでゆっくり進めるとキレイに仕上がります。",
        };
      }

      // ------------------------------------------------
      // 薄地
      // ------------------------------------------------

      if (isThin) {
        return {
          id: "janome",

          badge: "ジャノメ（薄地・パッカリング防止）",

          color: "#2563eb",

          models: "NP860 / MP470M",

          description:
            "ローンや薄地でも縫い縮みを抑え、キレイな縫い目に仕上げやすいモデルです。",

          needle: "HA×1 #9（薄地用）",

          thread: "シャッペスパン #90",

          presser: "基本押え / 直線専用押え",

          advice: "縫い始めに薄紙を一緒に挟むと巻き込みを防げます。",
        };
      }

      // ------------------------------------------------
      // 標準
      // ------------------------------------------------

      return {
        id: "janome",

        badge: "ジャノメ（標準・万能）",

        color: "#2563eb",

        models: "NP860 / MP470M",

        description:
          "自動糸調子付きで操作も簡単。入園入学グッズから小物づくりまで幅広く対応します。",

        needle: "HA×1 #11（普通地用）",

        thread: "シャッペスパン #60",

        presser: "基本押え（A押え）",

        advice: "布端はジグザグ縫いまたは裁ち目かがりで処理しましょう。",
      };
    },
  });

  console.log(
    "[OSS] Janome registered:",
    window.OSSMachineRegistry.machines.janome,
  );
})();
