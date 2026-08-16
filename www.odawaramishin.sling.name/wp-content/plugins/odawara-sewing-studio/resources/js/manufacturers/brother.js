window.OSSMachineRegistry.register("brother", {
  enabled: false, // ★ true から false に変更
  name: "ブラザー",

  getRecommendation: function (projectKey, fabricName) {
    return {
      mfgName: "ブラザー",
      type: "多機能家庭用ミシン / 職業用ミシン",
      title: "【ブラザー】初心者から上級者まで扱いやすい操作性",
      model: "ソレイユ600 / ヌーベルシリーズ",
      description:
        "液晶画面でのガイド表示とスムーズな自動糸切り機能でストレスなく制作できます。",
    };
  },
});
