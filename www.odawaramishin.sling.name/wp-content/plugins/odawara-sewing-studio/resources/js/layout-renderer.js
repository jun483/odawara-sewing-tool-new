/**
 * Odawara Sewing Studio
 * Layout Renderer & Sewing Machine Recommendation Engine
 *
 * File:
 * resources/js/layout-renderer.js
 */

(function () {
  "use strict";

  console.log("[OSS] layout-renderer.js loaded");

  /*
   * ========================================
   * OSS Machine Registry
   * ========================================
   */

  window.OSSMachineRegistry = window.OSSMachineRegistry || {};

  window.OSSMachineRegistry.machines = window.OSSMachineRegistry.machines || {};

  /*
   * メーカー登録
   */
  window.OSSMachineRegistry.register =
    window.OSSMachineRegistry.register ||
    function (id, config) {
      if (!id || !config) {
        console.warn("[OSS] Invalid machine registration:", id);
        return;
      }

      this.machines[id] = config;

      console.log("[OSS] Machine registered:", id, config);
    };

  /*
   * おすすめミシン取得
   */
  window.OSSMachineRegistry.getRecommendations =
    window.OSSMachineRegistry.getRecommendations ||
    function (projectKey, fabricName) {
      const results = [];

      console.log("[OSS] getRecommendations:", projectKey, fabricName);

      for (const id in this.machines) {
        const machine = this.machines[id];

        if (!machine) {
          continue;
        }

        if (machine.enabled !== true) {
          console.log("[OSS] machine disabled:", id);
          continue;
        }

        if (typeof machine.getDetails !== "function") {
          console.warn("[OSS] getDetails missing:", id);
          continue;
        }

        try {
          const detail = machine.getDetails(projectKey, fabricName);

          if (detail) {
            results.push(detail);
          }
        } catch (error) {
          console.error("[OSS] Machine recommendation error:", id, error);
        }
      }

      console.log("[OSS] recommendations:", results);

      return results;
    };

  /*
   * デフォルト登録：ジャノメ
   *
   * janome.js が後から読み込まれた場合は
   * janome.js 側の設定に置き換えられる
   */
  if (!window.OSSMachineRegistry.machines.janome) {
    window.OSSMachineRegistry.register("janome", {
      enabled: true,

      name: "ジャノメ",

      getDetails: function (projectKey, fabricName) {
        fabricName = fabricName || "";

        return {
          id: "janome",
          badge: "ジャノメ（標準・万能）",
          color: "#2563eb",
          models: "NP860 / MP470M",
          description:
            "入園入学グッズから小物づくりまで幅広く対応できるおすすめミシンです。",
          needle: "HA×1 #11（普通地用）",
          thread: "シャッペスパン #60",
          presser: "基本押え（A押え）",
          advice:
            "布端はジグザグ縫いまたは裁ち目かがりで処理するときれいに仕上がります。",
        };
      },
    });
  }

  /*
   * デフォルト登録：ベビーロック
   */
  if (!window.OSSMachineRegistry.machines.babylock) {
    window.OSSMachineRegistry.register("babylock", {
      enabled: true,

      name: "ベビーロック",

      getDetails: function (projectKey, fabricName) {
        fabricName = fabricName || "";

        return {
          id: "babylock",
          badge: "ベビーロック（端処理）",
          color: "#d97706",
          models: "糸取物語 / 衣縫人シリーズ",
          description:
            "生地端をきれいに処理し、既製品のような仕上がりを目指せます。",
          needle: "HA×1SP #11",
          thread: "ロックミシン用糸 #90",
          presser: "標準ロック押え",
          advice: "ほつれやすい生地の端処理におすすめです。",
        };
      },
    });
  }

  /* =========================================================
   * 4. フォーム値取得
   * ========================================================= */

  function getValue(selectors, fallback) {
    for (let i = 0; i < selectors.length; i++) {
      try {
        const el = document.querySelector(selectors[i]);

        if (el && el.value !== undefined && el.value !== "") {
          return el.value;
        }
      } catch (e) {
        console.warn("[OSS] selector error:", selectors[i]);
      }
    }

    return fallback;
  }

  /* =========================================================
   * 5. おすすめミシン表示
   * ========================================================= */

  window.ossRenderMachineBox = function (resultData) {
    try {
      console.log("[OSS] rendering machine recommendation");

      let target = document.getElementById("oss-machine-recommendation");

      /* 表示場所が無ければ作成 */

      if (!target) {
        const canvas = document.getElementById("oss-canvas");

        const resultArea =
          document.querySelector(".oss-result") ||
          document.querySelector(".calculator-result") ||
          canvas?.parentElement ||
          document.querySelector("form") ||
          document.body;

        if (!resultArea) {
          return;
        }

        target = document.createElement("div");

        target.id = "oss-machine-recommendation";

        resultArea.appendChild(target);
      }

      /* -----------------------------------------
       * プロジェクト取得
       * ----------------------------------------- */

      let projectVal = "";

      if (resultData && resultData.type) {
        projectVal = resultData.type;
      } else {
        projectVal = getValue(
          [
            "#oss-project",
            'select[name="type"]',
            'select[name*="project"]',
            'select[id*="project"]',
          ],
          "lesson_bag",
        );
      }

      /* -----------------------------------------
       * 生地取得
       * ----------------------------------------- */

      let fabricVal = "";

      if (resultData && resultData.fabric_type) {
        fabricVal = String(resultData.fabric_type);
      } else {
        fabricVal = getValue(
          [
            "#oss-fabric",
            "#oss-fabric-type",
            'select[name="fabric_type"]',
            'select[name*="fabric"]',
            'input[name="fabric_type"]:checked',
          ],
          "oxford",
        );
      }

      console.log("[OSS] project:", projectVal);

      console.log("[OSS] fabric:", fabricVal);

      /* -----------------------------------------
       * 推奨ミシン取得
       * ----------------------------------------- */

      const list = window.OSSMachineRegistry.getRecommendations(
        projectVal,
        fabricVal,
      );

      console.log("[OSS] recommendations:", list);

      if (!Array.isArray(list) || list.length === 0) {
        target.style.display = "none";

        target.innerHTML = "";

        console.warn("[OSS] recommendation list is empty");

        return;
      }

      /* 表示 */

      target.style.display = "block";

      const cardsHtml = list
        .map(function (item) {
          return `

            <div
              style="
                background:#fff;
                border:1px solid #cbd5e1;
                border-left:5px solid ${item.color || "#2563eb"};
                padding:14px;
                margin-bottom:12px;
                border-radius:6px;
                box-shadow:0 1px 3px rgba(0,0,0,0.05);
              "
            >

              <div style="margin-bottom:6px;">

                <span
                  style="
                    background:${item.color || "#2563eb"};
                    color:#fff;
                    font-size:11px;
                    padding:3px 8px;
                    border-radius:10px;
                    font-weight:bold;
                  "
                >
                  ${item.badge || item.name || "おすすめミシン"}
                </span>

              </div>


              <div
                style="
                  font-size:13px;
                  color:#0f172a;
                  margin-bottom:6px;
                "
              >

                <strong>
                  【推奨型番】
                </strong>

                ：

                <span
                  style="
                    color:${item.color || "#2563eb"};
                    font-weight:bold;
                  "
                >
                  ${item.models || ""}
                </span>

              </div>


              <p
                style="
                  margin:0 0 8px 0;
                  font-size:12px;
                  color:#475569;
                  line-height:1.5;
                "
              >
                ${item.description || ""}
              </p>


              <div
                style="
                  background:#f1f5f9;
                  padding:8px;
                  border-radius:4px;
                  font-size:12px;
                  display:flex;
                  gap:12px;
                  flex-wrap:wrap;
                  color:#334155;
                "
              >

                ${
                  item.needle
                    ? `<span>🪡 <strong>針：</strong>${item.needle}</span>`
                    : ""
                }

                ${
                  item.thread
                    ? `<span>🧵 <strong>糸：</strong>${item.thread}</span>`
                    : ""
                }

                ${
                  item.presser
                    ? `<span>🦶 <strong>押え：</strong>${item.presser}</span>`
                    : ""
                }

              </div>


              ${
                item.advice
                  ? `
                    <div
                      style="
                        margin-top:6px;
                        font-size:11px;
                        color:#92400e;
                        background:#fef3c7;
                        padding:6px;
                        border-radius:4px;
                      "
                    >
                      💡
                      <strong>アドバイス：</strong>
                      ${item.advice}
                    </div>
                  `
                  : ""
              }

            </div>

          `;
        })
        .join("");

      target.innerHTML = `

        <div
          style="
            margin-top:25px;
            padding:20px;
            background:#f8fafc;
            border:1px solid #cbd5e1;
            border-radius:8px;
            box-shadow:0 2px 4px rgba(0,0,0,0.04);
          "
        >

          <h3
            style="
              margin-top:0;
              color:#1e293b;
              font-size:16px;
              border-bottom:2px solid #2563eb;
              padding-bottom:8px;
            "
          >
            🧵
            選択した作品・生地に最適な
            おすすめ縫製機器＆道具
          </h3>


          <div style="margin-top:12px;">
            ${cardsHtml}
          </div>


          <div
            style="
              text-align:center;
              margin-top:12px;
            "
          >

            <a
              href="https://page.line.me/719ecuil"
              target="_blank"
              rel="noopener"
              style="
                display:inline-block;
                background:#059669;
                color:#fff;
                padding:10px 20px;
                border-radius:6px;
                text-decoration:none;
                font-weight:bold;
                font-size:13px;
              "
            >
              店内で試しぬいできます
              【小田原ミシン店舗予約】
            </a>

          </div>

        </div>

      `;
    } catch (e) {
      console.error("[OSS] ossRenderMachineBox Error:", e);
    }
  };

  /* =========================================================
   * 6. Canvasレイアウト
   * ========================================================= */

  window.OSSLayoutRenderer = {
    draw: function (data) {
      const canvas = document.getElementById("oss-canvas");

      if (!canvas) {
        return;
      }

      try {
        const ctx = canvas.getContext("2d");

        data = data || {};

        const layout = data.layout || {};

        const fabricWidth =
          Number(data.fabric_width || layout.fabric_width) || 110;

        const rawCutW =
          Number(data.cut_width || layout.cut_width || data.cut_w) || 30;

        const rawCutH =
          Number(data.cut_height || layout.cut_height || data.cut_h) || 30;

        const margin = 40;

        const parentWidth = canvas.parentElement
          ? canvas.parentElement.clientWidth
          : 600;

        const containerWidth = Math.max(parentWidth - 20, 300);

        const scale = (containerWidth - margin * 2) / fabricWidth;

        /* -----------------------------------------
         * パーツ一覧
         * ----------------------------------------- */

        let parts = [];

        if (Array.isArray(data.parts) && data.parts.length) {
          parts = data.parts;
        } else {
          const pieces = Number(data.pieces || data.quantity) || 1;

          parts.push({
            name: "本体パーツ",

            width: rawCutW,

            height: rawCutH,

            count: pieces,

            color: "#dbeafe",

            stroke: "#2563eb",

            textColor: "#1e3a8a",
          });
        }

        /* -----------------------------------------
         * 配置
         * ----------------------------------------- */

        let currentX = 0;
        let currentY = 0;
        let rowMaxH = 0;

        const renderBoxes = [];

        parts.forEach(function (part) {
          const pW = Number(part.width) || 10;

          const pH = Number(part.height) || 10;

          const count = Number(part.count) || 1;

          for (let i = 0; i < count; i++) {
            if (currentX + pW > fabricWidth && currentX > 0) {
              currentX = 0;

              currentY += rowMaxH;

              rowMaxH = 0;
            }

            renderBoxes.push({
              x: currentX,

              y: currentY,

              w: pW,

              h: pH,

              label: (part.name || "パーツ") + (count > 1 ? " " + (i + 1) : ""),

              color: part.color || "#dbeafe",

              stroke: part.stroke || "#2563eb",

              textColor: part.textColor || "#1e3a8a",
            });

            currentX += pW;

            if (pH > rowMaxH) {
              rowMaxH = pH;
            }
          }
        });

        const totalLength = Math.max(currentY + rowMaxH, 30);

        /* Canvasサイズ */

        canvas.width = containerWidth;

        canvas.height = totalLength * scale + margin * 2 + 100;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* -----------------------------------------
         * 生地
         * ----------------------------------------- */

        const fabricPixelW = fabricWidth * scale;

        const fabricPixelH = totalLength * scale;

        ctx.strokeStyle = "#94a3b8";

        ctx.lineWidth = 1;

        ctx.strokeRect(margin, margin, fabricPixelW, fabricPixelH);

        /* 生地幅 */

        ctx.fillStyle = "#334155";

        ctx.font = "bold 13px sans-serif";

        ctx.textAlign = "center";

        ctx.textBaseline = "bottom";

        ctx.fillText(
          "生地幅 " + fabricWidth + "cm",

          margin + fabricPixelW / 2,

          margin - 8,
        );

        /* -----------------------------------------
         * パーツ
         * ----------------------------------------- */

        renderBoxes.forEach(function (box) {
          const bx = margin + box.x * scale;

          const by = margin + box.y * scale;

          const bw = box.w * scale;

          const bh = box.h * scale;

          ctx.fillStyle = box.color;

          ctx.fillRect(bx, by, bw, bh);

          ctx.strokeStyle = box.stroke;

          ctx.lineWidth = 1.5;

          ctx.strokeRect(bx, by, bw, bh);

          if (bw > 25 && bh > 20) {
            ctx.fillStyle = box.textColor;

            ctx.textAlign = "center";

            ctx.textBaseline = "middle";

            ctx.font = "bold 12px sans-serif";

            ctx.fillText(box.label, bx + bw / 2, by + bh / 2 - 7);

            ctx.font = "10px sans-serif";

            ctx.fillText(
              box.w + " × " + box.h + "cm",

              bx + bw / 2,

              by + bh / 2 + 8,
            );
          }
        });

        /* -----------------------------------------
         * 下部情報
         * ----------------------------------------- */

        ctx.fillStyle = "#334155";

        ctx.font = "12px sans-serif";

        ctx.textAlign = "left";

        ctx.textBaseline = "top";

        const startY = margin + fabricPixelH + 15;

        const lineHeight = 20;

        let line = 0;

        if (data.fabric) {
          ctx.fillText(
            "必要生地長：" + data.fabric + "m",

            margin,
            startY + line * lineHeight,
          );

          line++;
        }

        if (data.purchase_fabric) {
          ctx.fillText(
            "おすすめ購入量：" + data.purchase_fabric + "m",

            margin,
            startY + line * lineHeight,
          );

          line++;
        }

        ctx.fillText(
          "総裁断パーツ数：" + renderBoxes.length + "点",

          margin,
          startY + line * lineHeight,
        );
      } catch (e) {
        console.error("[OSS] OSSLayoutRenderer Error:", e);
      }
    },
  };

  /* =========================================================
   * 7. 初期化
   * ========================================================= */

  function init() {
    console.log("[OSS] initializer started");

    /*
     * 初期Canvas
     */

    window.OSSLayoutRenderer.draw();

    /*
     * 初期おすすめミシン
     */

    window.ossRenderMachineBox();

    /*
     * フォーム変更
     */

    document.addEventListener("change", function (event) {
      const target = event.target;

      if (
        target &&
        (target.id === "oss-project" ||
          target.id === "oss-fabric" ||
          target.name === "fabric_type")
      ) {
        setTimeout(function () {
          window.ossRenderMachineBox();
        }, 100);
      }
    });

    /*
     * input変更
     */

    document.addEventListener("input", function () {
      clearTimeout(window.ossRecommendationTimer);

      window.ossRecommendationTimer = setTimeout(function () {
        window.ossRenderMachineBox();
      }, 150);
    });

    /*
     * Ajax等で結果が後から追加された場合
     */

    if (window.MutationObserver) {
      const observer = new MutationObserver(function () {
        const result = document.querySelector(
          "#oss-result, .oss-result, .calculator-result",
        );

        if (result) {
          clearTimeout(window.ossMutationTimer);

          window.ossMutationTimer = setTimeout(function () {
            window.ossRenderMachineBox();
          }, 100);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    /*
     * 計算後イベントにも対応
     */

    document.addEventListener("oss:calculated", function (event) {
      const data = event.detail || {};

      console.log("[OSS] calculation event:", data);

      window.OSSLayoutRenderer.draw(data);

      window.ossRenderMachineBox(data);
    });

    /*
     * windowイベント
     */

    window.addEventListener("ossCalculationComplete", function (event) {
      const data = event.detail || {};

      window.OSSLayoutRenderer.draw(data);

      window.ossRenderMachineBox(data);
    });
  }

  /* =========================================================
   * 8. DOM Ready
   * ========================================================= */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
