window.OSSLayoutRenderer = {
  draw(data) {
    const wrap = document.getElementById("oss-layout");
    const canvas = document.getElementById("oss-layout-canvas");

    if (!wrap || !canvas) {
      return;
    }

    wrap.style.display = "block";

    const ctx = canvas.getContext("2d");

    //------------------------------------
    // 初期化
    //------------------------------------

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const margin = 40;

    //------------------------------------
    // 縮尺
    //------------------------------------

    const usableWidth = canvas.width - margin * 2;

    const scale = usableWidth / data.fabric_width;

    const fabricWidth = data.fabric_width * scale;

    //------------------------------------
    // 生地
    //------------------------------------

    const fabricHeight = Math.max(
      250,
      (data.layout_length || data.cut_height) * scale,
    );

    ctx.fillStyle = "#fafafa";

    ctx.fillRect(margin, margin, fabricWidth, fabricHeight);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;

    ctx.strokeRect(margin, margin, fabricWidth, fabricHeight);

    //------------------------------------
    // タイトル
    //------------------------------------

    ctx.fillStyle = "#222";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";

    ctx.fillText(`生地幅 ${data.fabric_width}cm`, margin, 28);

    //------------------------------------
    // パーツ
    //------------------------------------

    const partW = data.cut_width * scale;
    const partH = data.cut_height * scale;

    const cols = data.columns || 1;
    const rows = data.rows || 1;

    let count = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (count >= data.quantity) {
          break;
        }

        const x = margin + c * partW;

        const y = margin + r * partH;

        //--------------------------------

        ctx.fillStyle = "#dbeafe";

        ctx.fillRect(x, y, partW, partH);

        ctx.strokeStyle = "#2563eb";

        ctx.strokeRect(x, y, partW, partH);

        //--------------------------------

        ctx.fillStyle = "#111";

        ctx.font = "bold 13px sans-serif";

        ctx.textAlign = "center";

        ctx.fillText("本体", x + partW / 2, y + 20);

        ctx.font = "11px sans-serif";

        ctx.fillText(
          `${data.cut_width} × ${data.cut_height}`,
          x + partW / 2,
          y + 38,
        );

        //--------------------------------
        // 横寸法
        //--------------------------------

        ctx.beginPath();

        ctx.moveTo(x, y - 12);

        ctx.lineTo(x + partW, y - 12);

        ctx.strokeStyle = "#666";

        ctx.stroke();

        ctx.fillStyle = "#333";

        ctx.fillText(data.cut_width + "cm", x + partW / 2, y - 18);

        //--------------------------------
        // 縦寸法
        //--------------------------------

        ctx.save();

        ctx.translate(x - 18, y + partH / 2);

        ctx.rotate(-Math.PI / 2);

        ctx.textAlign = "center";

        ctx.fillText(data.cut_height + "cm", 0, 0);

        ctx.restore();

        count++;
      }
    }

    //------------------------------------
    // 用尺
    //------------------------------------

    ctx.textAlign = "left";

    ctx.font = "bold 16px sans-serif";

    ctx.fillStyle = "#111";

    ctx.fillText(
      `必要生地：約 ${data.fabric}m`,
      margin,
      margin + fabricHeight + 35,
    );
  },
};
