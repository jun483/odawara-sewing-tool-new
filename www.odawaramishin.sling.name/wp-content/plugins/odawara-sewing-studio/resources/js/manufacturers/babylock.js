window.OSSMachineRegistry.register("babylock", {
  name: "ベビーロック",
  enabled: true, // 契約中

  getRecommendation: function (projectKey, fabricName) {
    // ほつれ止めが必要な作品全般にロックミシンを提案
    return {
      mfgName: "ベビーロック",
      type: "2本針4本糸 ロックミシン",
      title: "【ベビーロック】プロ並みの耐久性と美しい端処理",
      model: "糸取物語 / 浪人シリーズ",
      description:
        "空気圧で一瞬で糸が通る自動エア糸通し搭載。洗ってもほつれない頑丈な縫い目を実現します。",
    };
  },
});
