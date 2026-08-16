window.OSSMachineRegistry = {
  manufacturers: {},

  // メーカーデータの登録
  register: function (id, data) {
    this.manufacturers[id] = data;
  },

  // 契約中（active）のメーカーの提案リストを取得
  getRecommendations: function (projectKey, fabricName) {
    let recommendations = [];

    Object.keys(this.manufacturers).forEach((id) => {
      const mfg = this.manufacturers[id];
      if (mfg.enabled && mfg.getRecommendation) {
        const rec = mfg.getRecommendation(projectKey, fabricName);
        if (rec) {
          recommendations.push(rec);
        }
      }
    });

    return recommendations;
  },
};
