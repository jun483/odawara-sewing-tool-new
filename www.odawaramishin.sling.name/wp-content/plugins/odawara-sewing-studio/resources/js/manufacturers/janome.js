/**
 * Janome Machine Configuration
 * File: resources/js/janome.js
 */
(function () {
  "use strict";

  // レジストリが存在しない場合は初期化
  window.OSSMachineRegistry = window.OSSMachineRegistry || { machines: {} };
  window.OSSMachineRegistry.machines = window.OSSMachineRegistry.machines || {};

  // ジャノメの登録（無効化する場合は enabled: false）
  window.OSSMachineRegistry.machines.janome = {
    enabled: false, // 表示したい場合は true
    name: "ジャノメ",
    getDetails: function (projectKey, fabricName) {
      fabricName = fabricName || "";
      return {
        id: "janome",
        badge: "ジャノメ（標準モデル）",
        color: "#2563eb",
        models: "NP860 / MP470M",
        description: "自動糸調子付きで操作も簡単です。",
        needle: "HA×1 #11",
        thread: "シャッペスパン #60",
        presser: "基本押え",
        advice: "標準的な布地に適しています。",
      };
    },
  };
})();
