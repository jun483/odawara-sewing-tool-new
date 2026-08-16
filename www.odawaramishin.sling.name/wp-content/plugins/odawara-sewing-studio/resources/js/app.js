document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // XSS対策関数
  // ==========================
  function escapeHTML(str) {
    if (str === null || str === undefined) {
      return "";
    }
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================
  // DOM要素取得
  // ==========================
  const project = document.getElementById("oss-project");
  const button = document.getElementById("oss-calc");
  const result = document.getElementById("oss-result");
  const loading = document.getElementById("oss-loading");
  const error = document.getElementById("oss-error");
  const guide = document.getElementById("oss-size-guide");
  const gussetArea = document.getElementById("oss-gusset-area");

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
    apron: "おすすめ：70 × 80cm",
    child_apron: "おすすめ：60 × 70cm",
    bandana: "おすすめ：55 × 55cm",
  };

  // ==========================
  // サイズガイド更新
  // ==========================
  function updateGuide() {
    if (guide && project) {
      guide.textContent = sizeGuide[project.value] ?? "";
    }

    if (gussetArea && project) {
      if (project.value === "lunch_bag" || project.value === "cup_bag") {
        gussetArea.style.display = "block";
      } else {
        gussetArea.style.display = "none";
      }
    }
  }

  if (project) {
    updateGuide();
    project.addEventListener("change", updateGuide);
  }

  // ==========================
  // 計算ボタンイベント
  // ==========================
  if (button) {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      calculate();
    });
  }

  // ==========================
  // AJAX計算処理
  // ==========================
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
      .then((response) => response.json())
      .then((data) => {
        if (loading) loading.style.display = "none";

        if (!data.success) {
          if (error) {
            error.style.display = "block";
            error.innerHTML = escapeHTML(
              data.message ?? "計算に失敗しました。",
            );
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
          error.innerHTML = "通信エラーが発生しました。";
        }
      });
  }

  // ==========================
  // 計算結果表示処理
  // ==========================
  function showResult(data) {
    const dateText = new Date().toLocaleString("ja-JP");

    let html = `
      <div class="oss-result-card">
        <h2>${escapeHTML(data.title)}</h2>
        <p class="oss-date">計算日時：${escapeHTML(dateText)}</p>
        <img
          src="/wp-content/uploads/odawara-logo.png"
          class="oss-logo"
          alt="小田原ミシン"
        >
        <table class="oss-table">
          <tbody>
            <tr>
              <th>必要な表地</th>
              <td>${escapeHTML(data.fabric ?? 0)} m</td>
            </tr>
            <tr>
              <th>おすすめ購入量（表地）</th>
              <td>${escapeHTML(data.purchase_fabric ?? data.fabric ?? 0)} m</td>
            </tr>
            <tr>
              <th>必要な裏地</th>
              <td>${escapeHTML(data.lining ?? 0)} m</td>
            </tr>
            <tr>
              <th>おすすめ購入量（裏地）</th>
              <td>${escapeHTML(data.purchase_lining ?? data.lining ?? 0)} m</td>
            </tr>
            <tr>
              <th>生地種類</th>
              <td>${escapeHTML(data.fabric_type ?? "")}</td>
            </tr>
            <tr>
              <th>生地幅</th>
              <td>${escapeHTML(data.fabric_width ?? 0)} cm</td>
            </tr>
            <tr>
              <th>裁断サイズ</th>
              <td>${escapeHTML(data.cut_width ?? 0)} × ${escapeHTML(data.cut_height ?? 0)} cm</td>
            </tr>`;

    if (Number(data.handle) > 0) {
      html += `
            <tr>
              <th>持ち手</th>
              <td>${escapeHTML(data.handle)} cm</td>
            </tr>`;
    }

    if (Number(data.cord) > 0) {
      html += `
            <tr>
              <th>ひも</th>
              <td>${escapeHTML(data.cord)} cm</td>
            </tr>`;
    }

    if (Number(data.d_ring) > 0) {
      html += `
            <tr>
              <th>Dカン</th>
              <td>${escapeHTML(data.d_ring)} 個</td>
            </tr>`;
    }

    if (Number(data.interfacing) > 0) {
      html += `
            <tr>
              <th>接着芯</th>
              <td>${escapeHTML(data.interfacing)} ㎡</td>
            </tr>`;
    }

    html += `
          </tbody>
        </table>
      </div>`;

    // 材料カード
    if (data.materials && typeof data.materials === "object") {
      html += `
        <div class="oss-material-card">
          <h3>🛒 必要な材料を購入</h3>
          <p class="oss-material-description">必要な材料を確認して購入できます。</p>`;

      Object.values(data.materials).forEach((material) => {
        if (!material) return;
        const quantity = Number(material.quantity ?? 0);
        if (quantity <= 0) return;

        const name = escapeHTML(material.name ?? "材料");
        const unit = escapeHTML(material.unit ?? "");
        const url = material.url ?? "#";

        html += `
          <div class="oss-material-item">
            <div class="oss-material-info">
              <strong>${name}</strong>
              <span>必要量：${escapeHTML(quantity)} ${unit}</span>
            </div>
            <a href="${escapeHTML(url)}" class="oss-buy-button" target="_blank" rel="noopener noreferrer">購入する</a>
          </div>`;
      });

      html += `</div>`;
    }

    // --------------------------------------------------
    // ミシン販売・ご相談誘導カード
    // --------------------------------------------------
    html += `
      <div class="oss-promo-card">
        <div class="oss-promo-header">
          <h3>🧵 この作品、もっとキレイにスムーズに縫ってみませんか？</h3>
        </div>
        <div class="oss-promo-body">
          <p class="oss-promo-text">
            「厚地や重なり部分がうまく縫えるか不安…」「今のミシンだと糸が絡まる…」とお悩みの方は、ぜひ計算した生地を持って<b>小田原ミシン</b>へお越しください！
          </p>
          <ul class="oss-promo-list">
            <li>✨ <b>店頭で試し縫い体験：</b>ご持参いただいた生地で最新ミシンの縫い心地をお試しいただけます。</li>
            <li>🔧 <b>ミシンの無料状態チェック：</b>お持ちのミシンの調子やお手入れ方法もプロがアドバイス！</li>
            <li>🎁 <b>購入者限定特典：</b>当店でミシンをご購入された方には「作品完成までのマンツーマンレッスン（1回）」をプレゼント！</li>
          </ul>
          <div class="oss-promo-action">
            <a href="https://page.line.me/719ecuil?oat_content=url&openQrModal=true" target="_blank" rel="noopener" class="oss-promo-btn">
              📍 店舗での試し縫い・ミシンご相談予約はこちら
            </a>
          </div>
        </div>
      </div>

      <!-- 印刷・PDF用の特典チケット（店舗持参用） -->
      <div class="oss-coupon-box">
        <div class="oss-coupon-badge">小田原ミシン 店舗限定特典</div>
        <div class="oss-coupon-title">🎁 ミシンご成約 特典チケット</div>
        <p class="oss-coupon-desc">このシートを店頭にお持ちいただきミシンをご成約された方に、<b>「作品完成サポートレッスン（1回無料）」</b>をプレゼントいたします。</p>
      </div>
    `;

    // 操作ボタン類
    html += `
      <div class="oss-actions">
        <button type="button" class="oss-button" id="oss-save">⭐ この計算を保存</button>
        <button type="button" class="oss-button" id="oss-print">🖨 印刷</button>
        <button type="button" class="oss-button" id="oss-pdf-btn">📄 PDF保存</button>
      </div>`;

    if (result) {
      result.innerHTML = html;
    }

    // ボタンイベント付与（バブリング防止を追加）
    const saveButton = document.getElementById("oss-save");
    if (saveButton) {
      saveButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        saveBookmark(data, dateText);
      });
    }

    const printButton = document.getElementById("oss-print");
    if (printButton) {
      printButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.print();
      });
    }
    // --------------------------------------------------
    // LINE予約ボタンのクリックイベント遮断（PDF化の誤発火防止）
    // --------------------------------------------------
    const promoBtn = document.querySelector(".oss-promo-btn");
    if (promoBtn) {
      promoBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // 親要素へのイベント伝播をストップ
      });
    }

    // PDF保存ボタンのイベント設定
    const pdfButton = document.getElementById("oss-pdf-btn");
    if (pdfButton) {
      pdfButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof html2pdf === "undefined") {
          alert("PDF作成機能の準備ができていません。");
          return;
        }

        // PDF化の対象は外枠の <div id="oss-pdf"> を指定
        const pdfArea = document.getElementById("oss-pdf");
        if (!pdfArea) {
          alert("PDF対象が見つかりません。");
          return;
        }

        const filename = (data.title || "生地用尺計算結果") + ".pdf";

        html2pdf()
          .set({
            margin: 10,
            filename: filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(pdfArea)
          .save();
      });
    }

    // --------------------------------------------------
    // 裁断図エリアの非表示解除と描画
    // --------------------------------------------------
    const layoutContainer = document.getElementById("oss-layout");
    if (layoutContainer) {
      layoutContainer.style.display = "block";
    }

    if (
      window.OSSLayoutRenderer &&
      typeof window.OSSLayoutRenderer.draw === "function"
    ) {
      try {
        window.OSSLayoutRenderer.draw(data);
      } catch (e) {
        console.error("レイアウト描画エラー:", e);
      }
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

    if (saved.length > 20) {
      saved.length = 20;
    }

    localStorage.setItem("oss-saved", JSON.stringify(saved));
  }
});
