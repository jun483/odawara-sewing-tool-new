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

  /* =========================================================
   * 1. ミシンレジストリ
   * ========================================================= */

  window.OSSMachineRegistry = window.OSSMachineRegistry || {
    machines: {},

    register: function (id, config) {
      if (!id || !config) {
        return;
      }

      this.machines[id] = config;

      console.log("[OSS] machine registered:", id);
    },

    getRecommendations: function (projectKey, fabricName) {
      const results = [];

      const machines = this.machines || {};

      Object.keys(machines).forEach(function (id) {
        const machine = machines[id];

        if (!machine) {
          return;
        }

        /*
         * enabled が false の場合だけ除外
         *
         * 以前のコードでは
         * enabled === true
         * でないと全部除外されていました。
         *
         * 今回は未指定なら有効として扱います。
         */
        if (machine.enabled === false) {
          return;
        }

        if (typeof machine.getDetails !== "function") {
          return;
        }

        try {
          const result = machine.getDetails(projectKey || "", fabricName || "");

          if (result) {
            results.push(result);
          }
        } catch (e) {
          console.error("[OSS] machine recommendation error:", id, e);
        }
      });

      return results;
    },
  };

  /* =========================================================
   * 2. ジャノメ
   * ========================================================= */

  if (!window.OSSMachineRegistry.machines.janome) {
    window.OSSMachineRegistry.register("janome", {
      enabled: true,

      name: "ジャノメ",

      getDetails: function (projectKey, fabricName) {
        projectKey = projectKey || "";
        fabricName = fabricName || "";

        const heavyProjects = ["lesson_bag", "shoe_bag", "tote", "knapsack"];

        const isHeavy =
          heavyProjects.includes(projectKey) ||
          fabricName.includes("canvas") ||
          fabricName.includes("帆布") ||
          fabricName.includes("quilting") ||
          fabricName.includes("キルト") ||
          fabricName.includes("厚地");

        const isThin =
          fabricName.includes("thin") ||
          fabricName.includes("lawn") ||
          fabricName.includes("薄地") ||
          fabricName.includes("ローン");

        /* 厚地 */

        if (isHeavy) {
          return {
            id: "janome",

            badge: "ジャノメ（厚物・強力パワー）",

            color: "#2563eb",

            models: "NP860 / MP470M",

            description:
              "アクリルテープの重ね縫いや厚手生地も、力強い布送りでスムーズに縫えます。",

            needle: "HA×1 #14（厚地用）",

            thread: "シャッペスパン #60 または #30",

            presser: "基本押え（段差固定ボタン使用）",

            advice:
              "重なり部分は針を#14にし、手回しでゆっくり進めるとキレイに仕上がります。",
          };
        }

        /* 薄地 */

        if (isThin) {
          return {
            id: "janome",

            badge: "ジャノメ（薄地・パッカリング防止）",

            color: "#2563eb",

            models: "NP860 / MP470M",

            description:
              "ローンや薄地でも縫い縮みを抑えてキレイな縫い目に仕上げます。",

            needle: "HA×1 #9（薄地用）",

            thread: "シャッペスパン #90",

            presser: "基本押え / 直線専用押え",

            advice: "縫い始めに薄紙を一緒に挟むと巻き込みを防げます。",
          };
        }

        /* 標準 */

        return {
          id: "janome",

          badge: "ジャノメ（標準・万能）",

          color: "#2563eb",

          models: "NP860 / MP470M",

          description:
            "入園入学グッズから小物づくりまで幅広く対応する使いやすいミシンです。",

          needle: "HA×1 #11（普通地用）",

          thread: "シャッペスパン #60",

          presser: "基本押え（A押え）",

          advice:
            "布端はジグザグ縫いや裁ち目かがりで処理するとキレイに仕上がります。",
        };
      },
    });
  }

  /* =========================================================
   * 3. ベビーロック
   * ========================================================= */

  if (!window.OSSMachineRegistry.machines.babylock) {
    window.OSSMachineRegistry.register("babylock", {
      enabled: true,

      name: "ベビーロック",

      getDetails: function (projectKey, fabricName) {
        fabricName = fabricName || "";

        const isKnit =
          fabricName.includes("knit") ||
          fabricName.includes("ニット") ||
          fabricName.includes("スウェット");

        return {
          id: "babylock",

          badge: "ベビーロック（端処理・ロックミシン）",

          color: "#d97706",

          models: "糸取物語 / 衣縫人シリーズ",

          description: isKnit
            ? "ニット生地の縫い合わせと端処理を同時に行え、既製品のような仕上がりを目指せます。"
            : "生地の端を切りながらキレイにかがり縫い。完成度を高めたい作品におすすめです。",

          needle: isKnit ? "HA×1ST #11〜#14" : "HA×1SP #11",

          thread: isKnit ? "バルキー糸 / レジロン糸" : "ロックミシン用糸 #90",

          presser: "標準ロック押え",

          advice: isKnit
            ? "ニット生地はロックミシンで端処理と縫い合わせを同時に行えます。"
            : "ほつれやすい生地や作品の完成度を上げたい場合におすすめです。",
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
