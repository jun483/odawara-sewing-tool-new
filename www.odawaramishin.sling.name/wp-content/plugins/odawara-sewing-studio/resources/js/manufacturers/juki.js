window.OSSMachineRegistry.register("juki", {
  enabled: false, // ★ true から false に変更（契約完了時に true へ戻します）
  name: "JUKI",

  getRecommendation: function (projectKey, fabricName) {
    if (
      projectKey === "lesson_bag" ||
      projectKey === "tote" ||
      fabricName === "帆布" ||
      fabricName === "デニム"
    ) {
      return {
        mfgName: "JUKI",
        type: "職業用ミシン",
        title: "【JUKI】圧倒的な馬力と美しい直線縫い",
        model: "TL-30 / HY-SPEC",
        description:
          "工業用ミシンの技術を継承したパワフルな貫通力。段差のある持ち手縫いも失速しません。",
      };
    }
    return null;
  },
});
