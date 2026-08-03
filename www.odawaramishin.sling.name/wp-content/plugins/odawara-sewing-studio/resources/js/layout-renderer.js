window.OSSLayoutRenderer = {
  draw(data) {
    const wrap = document.getElementById("oss-layout");
    const canvas = document.getElementById("oss-layout-canvas");

    if (!wrap || !canvas) {
      return;
    }

    wrap.style.display = "block";

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;

    ctx.strokeRect(40, 40, 620, 340);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#333";

    ctx.fillText("生地幅 " + data.fabric_width + "cm", 45, 30);

    const cols = data.columns || 2;
    const rows = data.rows || 2;

    const partW = 120;
    const partH = 80;

    const startX = 60;
    const startY = 60;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = startX + (partW + 10) * x;
        const py = startY + (partH + 10) * y;

        ctx.fillStyle = "#cfe8ff";
        ctx.fillRect(px, py, partW, partH);

        ctx.strokeStyle = "#2b7cff";
        ctx.strokeRect(px, py, partW, partH);

        ctx.fillStyle = "#333";

        ctx.fillText(data.cut_width + "×" + data.cut_height, px + 15, py + 45);
      }
    }
  },
};
