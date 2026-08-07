document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // ユーティリティ (XSS対策)
  // ==========================
  function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================
  // 要素取得
  // ==========================
  const project = document.getElementById("oss-project");
  const button = document.getElementById("oss-calc");
  const result = document.getElementById("oss-result");
  const loading = document.getElementById("oss-loading");
  const error = document.getElementById("oss-error");
  const gussetArea = document.getElementById("oss-gusset-area");
  const guide = document.getElementById("oss-size-guide");

  // ==========================
  // サイズガイド定義
  // ==========================
  const sizeGuide = {
    lesson_bag: "おすすめ：40 × 30cm",
    shoe_bag: "おすすめ：22 × 28cm",
    drawstring: "おすすめ：20 × 25cm",
    tote: "おすすめ：35 × 35cm",
    lunch_bag: "おすすめ：27 × 20 × 10cm",
    cup_bag: "おすすめ：18 × 20 × 8cm",
    knapsack: "おすすめ：35 × 40cm",
  };

  // ==========================
  // ガイド更新
  // ==========================
  function updateGuide() {
    if (!project || !guide) return;
    guide.textContent = sizeGuide[project.value] ?? "";

    if (gussetArea) {
      gussetArea.style.display =
        project.value === "lunch_bag" || project.value === "cup_bag"
          ? "block"
          : "none";
    }
  }

  if (project) {
    updateGuide();
    project.addEventListener("change", updateGuide);
  }

  // ==========================
  // 計算処理
  // ==========================
  if (button) {
    button.addEventListener("click", calculate);
  }

  function calculate() {
    if (loading) loading.style.display = "block";
    if (result) result.innerHTML = "";
    if (error) {
      error.style.display = "none";
      error.innerHTML = "";
    }

    const formData = new FormData();
    formData.append("action", "oss_calculate");
    formData.append("nonce", typeof oss !== "undefined" ? oss.nonce : "");
    formData.append("type", project ? project.value : "");
    formData.append("width", document.getElementById("oss-width")?.value || "");
    formData.append(
      "height",
      document.getElementById("oss-height")?.value || "",
    );
    formData.append(
      "gusset",
      document.getElementById("oss-gusset")?.value || "",
    );
    formData.append(
      "quantity",
      document.getElementById("oss-qty")?.value || "",
    );
    formData.append(
      "fabric_width",
      document.getElementById("oss-fabric-width")?.value || "",
    );
    formData.append(
      "fabric_type",
      document.getElementById("oss-fabric-type")?.value || "",
    );

    const ajaxUrl = typeof oss !== "undefined" ? oss.ajaxUrl : "";
    if (!ajaxUrl) {
      if (loading) loading.style.display = "none";
      if (error) {
        error.style.display = "block";
        error.textContent = "設定エラー：通信先URLが見つかりません。";
      }
      return;
    }

    fetch(ajaxUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("ネットワークエラーが発生しました。");
        return response.json();
      })
      .then((data) => {
        if (loading) loading.style.display = "none";

        if (!data.success) {
          if (error) {
            error.style.display = "block";
            error.textContent = data.message || "計算処理に失敗しました。";
          }
          return;
        }

        showResult(data);
      })
      .catch((err) => {
        console.error(err);
        if (loading) loading.style.display = "none";
        if (error) {
          error.style.display = "block";
          error.textContent = "通信エラーが発生しました。";
        }
      });
  }

  // ==========================
  // 計算結果表示
  // ==========================
  function showResult(data) {
    const dateText = new Date().toLocaleString("ja-JP");

    let html = `
      <div class="oss-result-card">
        <h2>${escapeHTML(data.title)}</h2>
        <p class="oss-date">計算日時：${escapeHTML(dateText)}</p>
        <table class="oss-table">
          <tr>
            <th>必要な表地</th>
            <td>${escapeHTML(data.fabric)} m</td>
          </tr>
          <tr>
            <th>おすすめ購入量</th>
            <td>${escapeHTML(data.purchase_fabric ?? data.fabric)} m</td>
          </tr>
          <tr>
            <th>必要な裏地</th>
            <td>${escapeHTML(data.lining)} m</td>
          </tr>
          <tr>
            <th>おすすめ購入量（裏地）</th>
            <td>${escapeHTML(data.purchase_lining ?? data.lining)} m</td>
          </tr>
          <tr>
            <th>生地幅</th>
            <td>${escapeHTML(data.fabric_width)} cm</td>
          </tr>
          <tr>
            <th>裁断サイズ</th>
            <td>${escapeHTML(data.cut_width)} × ${escapeHTML(data.cut_height)} cm</td>
          </tr>`;

    if (data.handle && Number(data.handle) > 0) {
      html += `
        <tr>
          <th>持ち手</th>
          <td>${escapeHTML(data.handle)} cm</td>
        </tr>`;
    }

    if (data.cord && Number(data.cord) > 0) {
      html += `
        <tr>
          <th>ひも</th>
          <td>${escapeHTML(data.cord)} cm</td>
        </tr>`;
    }

    if (data.d_ring && Number(data.d_ring) > 0) {
      html += `
        <tr>
          <th>Dカン</th>
          <td>${escapeHTML(data.d_ring)} 個</td>
        </tr>`;
    }

    if (data.interfacing && Number(data.interfacing) > 0) {
      html += `
        <tr>
          <th>接着芯</th>
          <td>${escapeHTML(data.interfacing)} ㎡</td>
        </tr>`;
    }

    html += `
        </table>
      </div>`;

    //==============================
    // 材料購入一覧
    //==============================

    if (data.materials) {
      html += `
    <div class="oss-material-card">

        <h3>🛒 必要な材料を購入</h3>
    `;

      Object.values(data.materials).forEach((material) => {
        if (Number(material.quantity) <= 0) {
          return;
        }

        html += `

        <div class="oss-material-item">

            <div>

                <strong>${material.name}</strong><br>

                必要量：
                ${material.quantity}${material.unit}

            </div>

            <a
                href="${material.url}"
                class="oss-buy-button"
                target="_blank"
            >
                購入する
            </a>

        </div>

        `;
      });

      html += `
    </div>
    `;
    }

    html += `
      <div class="oss-actions">
        <button class="oss-button" id="oss-save">
          ⭐ この計算を保存
        </button>
      </div>
      <div class="oss-print">
        <button class="oss-button" onclick="window.print()">
          🖨 印刷
        </button>

        <button class="oss-button" id="oss-pdf">
          📄 PDF保存
        </button>
      </div>`;

    result.innerHTML = html;
    const pdfButton = document.getElementById("oss-pdf");

    if (pdfButton) {
      pdfButton.addEventListener("click", () => {
        // html2pdf が定義されているか判定
        if (typeof html2pdf === "undefined") {
          alert(
            "PDF作成機能の準備ができていません。ライブラリの読み込みを確認してください。",
          );
          return;
        }

        const element = document.querySelector(".oss-result-card");

        html2pdf()
          .set({
            margin: 10,
            filename: `${data.title}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(element)
          .save();
      });
    }

    // イベントバインド
    document.getElementById("oss-save")?.addEventListener("click", () => {
      saveBookmark(data, dateText);
    });

    // 裁断図描画
    if (window.OSSLayoutRenderer) {
      window.OSSLayoutRenderer.draw(data);
    }

    // 履歴保存（自動）
    saveToHistory(data, dateText);
  }

  // ==========================
  // ローカルストレージ操作
  // ==========================
  function saveToHistory(data, dateText) {
    const history = JSON.parse(localStorage.getItem("oss-history") || "[]");
    history.unshift({
      date: dateText,
      title: data.title,
      fabric: data.fabric,
      lining: data.lining,
      width: data.cut_width,
      height: data.cut_height,
    });

    if (history.length > 20) {
      history.length = 20;
    }

    localStorage.setItem("oss-history", JSON.stringify(history));
  }

  function saveBookmark(data, dateText) {
    const saved = JSON.parse(localStorage.getItem("oss-saved") || "[]");
    saved.unshift({
      date: dateText,
      title: data.title,
      fabric: data.fabric,
      lining: data.lining,
      width: data.cut_width,
      height: data.cut_height,
    });

    localStorage.setItem("oss-saved", JSON.stringify(saved));
    alert("計算結果をお気に入りに保存しました。");
  }
});
