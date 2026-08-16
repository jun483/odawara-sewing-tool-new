window.OSSMachineRegistry.register("janome", {
  name: "ジャノメ",
  enabled: true, // 契約中

  getRecommendation: function (projectKey, fabricName) {
    if (fabricName === "キルティング" || fabricName === "帆布") {
      return {
        mfgName: "ジャノメ",
        type: "高馬力家庭用ミシン",
        title: "【ジャノメ】厚地もブレずに美しく縫える安心性能",
        model: "Atelierシリーズ / EKS-3120",
        description:
          "貫通力が高く、重ね縫いでも糸調整が崩れにくいジャノメの本格モデルです。",
      };
    }
    return null;
  },
});
