document.addEventListener("DOMContentLoaded", () => {
  const project = document.getElementById("oss-project");
  const button = document.getElementById("oss-calc");
  const result = document.getElementById("oss-result");
  const loading = document.getElementById("oss-loading");
  const error = document.getElementById("oss-error");
  const gussetArea = document.getElementById("oss-gusset-area");

  const guide = document.getElementById("oss-size-guide");

  const sizeGuide = {
    lesson_bag: "おすすめ：40 × 30cm",

    shoe_bag: "おすすめ：22 × 28cm",

    drawstring: "おすすめ：20 × 25cm",

    tote: "おすすめ：35 × 35cm",

    lunch_bag: "おすすめ：27 × 20 × 10cm",

    cup_bag: "おすすめ：18 × 20 × 8cm",

    knapsack: "おすすめ：35 × 40cm",
  };

  function updateGuide() {
    guide.textContent = sizeGuide[project.value];

    if (project.value === "lunch_bag" || project.value === "cup_bag") {
      gussetArea.style.display = "block";
    } else {
      gussetArea.style.display = "none";
    }
  }

  updateGuide();

  project.addEventListener("change", updateGuide);
  button.addEventListener("click", () => {
    loading.style.display = "block";
    result.innerHTML = "";
    error.style.display = "none";
    error.innerHTML = "";

    const formData = new FormData();

    formData.append("action", "oss_calculate");
    formData.append("nonce", oss.nonce);

    formData.append("type", project.value);
    formData.append("width", document.getElementById("oss-width").value);
    formData.append("height", document.getElementById("oss-height").value);
    formData.append("gusset", document.getElementById("oss-gusset").value);
    formData.append("quantity", document.getElementById("oss-qty").value);
    formData.append(
      "fabric_width",
      document.getElementById("oss-fabric-width").value,
    );

    fetch(oss.ajaxUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((text) => {
        console.log(text);

        const data = JSON.parse(text);

        loading.style.display = "none";

        if (!data.success) {
          error.style.display = "block";
          error.innerHTML = data.message;

          return;
        }

        showResult(data);
      })
      .catch((err) => {
        console.error(err);

        loading.style.display = "none";

        error.style.display = "block";
        error.innerHTML = "通信エラーが発生しました。";
      });
  });
  function showResult(data) {
    let html = `
            <div class="oss-result-card">

                <h2>${data.title}</h2>

                <table class="oss-table">

                    <tr>
                        <th>必要な表地</th>
                        <td>${data.fabric} m</td>
                    </tr>

                    <tr>
                        <th>必要な裏地</th>
                        <td>${data.lining} m</td>
                    </tr>

                    <tr>
                        <th>生地幅</th>
                        <td>${data.fabric_width} cm</td>
                    </tr>

                    <tr>
                        <th>裁断サイズ</th>
                        <td>${data.cut_width} × ${data.cut_height} cm</td>
                    </tr>
        `;

    if (data.handle && Number(data.handle) > 0) {
      html += `
                <tr>
                    <th>持ち手</th>
                    <td>${data.handle} cm</td>
                </tr>
            `;
    }

    if (data.cord && Number(data.cord) > 0) {
      html += `
                <tr>
                    <th>ひも</th>
                    <td>${data.cord} cm</td>
                </tr>
            `;
    }
    if (data.d_ring && Number(data.d_ring) > 0) {
      html += `
                <tr>
                    <th>Dカン</th>
                    <td>${data.d_ring} 個</td>
                </tr>
            `;
    }

    if (data.interfacing && Number(data.interfacing) > 0) {
      html += `
                <tr>
                    <th>接着芯</th>
                    <td>${data.interfacing} ㎡</td>
                </tr>
            `;
    }

    html += `
                </table>

            </div>
        `;

    result.innerHTML = html;

    if (window.OSSLayoutRenderer) {
      window.OSSLayoutRenderer.draw(data);
    }
  }
});
