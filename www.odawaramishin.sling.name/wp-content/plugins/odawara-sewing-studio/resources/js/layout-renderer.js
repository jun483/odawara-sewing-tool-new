/**
 * Odawara Sewing Studio - Complete Layout & Recommendation Engine
 * File: resources/js/layout-renderer.js
 */

(function () {
  "use strict";

  // 1. 裁断レイアウト描画エンジン
  window.OSSLayoutRenderer = {
    draw: function (data) {
      const canvas = document.getElementById("oss-canvas");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      data = data || {};

      const layout = data.layout || {};
      const fabricWidth =
        Number(data.fabric_width || layout.fabric_width) || 110;

      let partsList = [];
      if (Array.isArray(data.parts) && data.parts.length > 0) {
        partsList = data.parts;
      } else {
        const isRotate = Boolean(data.rotate ?? layout.rotate);
        const rawCutW =
          Number(data.cut_width || layout.cut_width || data.cut_w) || 84;
        const rawCutH =
          Number(data.cut_height || layout.cut_height || data.cut_h) || 42;

        const cutWidth = isRotate ? rawCutH : rawCutW;
        const cutHeight = isRotate ? rawCutW : rawCutH;
        const cols = Number(data.columns || layout.columns) || 1;
        const rows = Number(data.rows || layout.rows) || 2;
        const pieces =
          Number(data.pieces || data.quantity || layout.pieces) || cols * rows;

        partsList.push({
          name: "本体",
          width: cutWidth,
          height: cutHeight,
          count: pieces,
          cols: cols,
          rows: rows,
          color: "#dbeafe",
          stroke: "#2563eb",
          textColor: "#1e3a8a",
        });
      }

      const margin = 40;
      const parentWidth = canvas.parentElement
        ? canvas.parentElement.clientWidth
        : 0;
      const containerWidth = parentWidth > 50 ? parentWidth - 20 : 600;
      const scale = (containerWidth - margin * 2) / fabricWidth;

      let currentX = 0;
      let currentY = 0;
      let rowMaxH = 0;
      const renderBoxes = [];

      partsList.forEach((part) => {
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
          if (pH > rowMaxH) rowMaxH = pH;
        }
      });

      const totalLength = Math.max(currentY + rowMaxH, 30);

      canvas.width = containerWidth;
      canvas.height = totalLength * scale + margin * 2 + 80;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fabricPixelW = fabricWidth * scale;
      const fabricPixelH = totalLength * scale;

      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.strokeRect(margin, margin, fabricPixelW, fabricPixelH);

      ctx.fillStyle = "#334155";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(
        "生地幅 " + fabricWidth + "cm",
        margin + fabricPixelW / 2,
        margin - 8,
      );

      renderBoxes.forEach((box) => {
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
            by + bh / 2 + 7,
          );
        }
      });

      ctx.fillStyle = "#334155";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      const startY = margin + fabricPixelH + 15;
      const lineHeight = 20;
      let currentLine = 0;

      const reqFabric = data.fabric || (totalLength / 100).toFixed(2);
      const recFabric =
        data.purchase_fabric || (Math.ceil(totalLength / 10) / 10).toFixed(1);

      ctx.fillText(
        "必要生地長 : " + reqFabric + "m",
        margin,
        startY + currentLine * lineHeight,
      );
      currentLine++;
      ctx.fillText(
        "おすすめ購入量 : " + recFabric + "m",
        margin,
        startY + currentLine * lineHeight,
      );
      currentLine++;
      ctx.fillText(
        "総裁断パーツ数 : " + renderBoxes.length + "点",
        margin,
        startY + currentLine * lineHeight,
      );
    },
  };

  // 2. 機器・道具推奨データジェネレータ（レジストリ優先＋ベビーロック対応）
  function getMachineRecommendations(projectVal, fabricVal) {
    // 優先度1: OSSMachineRegistry から動的取得
    if (
      window.OSSMachineRegistry &&
      typeof window.OSSMachineRegistry.getRecommendations === "function"
    ) {
      const regResults = window.OSSMachineRegistry.getRecommendations(
        projectVal,
        fabricVal,
      );
      if (Array.isArray(regResults) && regResults.length > 0) {
        return regResults;
      }
    }

    if (window.OSSMachineRegistry && window.OSSMachineRegistry.machines) {
      const activeList = [];
      const machines = window.OSSMachineRegistry.machines;
      for (const key in machines) {
        if (machines[key].enabled) {
          activeList.push(machines[key]);
        }
      }
      if (activeList.length > 0) return activeList;
    }

    // 優先度2: フォールバック（ジャノメ ＋ ベビーロック）
    const isQuilting =
      fabricVal &&
      (fabricVal.includes("quilting") || fabricVal.includes("キルト"));
    const isCanvas =
      fabricVal &&
      (fabricVal.includes("canvas") ||
        fabricVal.includes("denim") ||
        fabricVal.includes("帆布") ||
        fabricVal.includes("8号"));
    const isKnit =
      fabricVal &&
      (fabricVal.includes("knit") ||
        fabricVal.includes("ニット") ||
        fabricVal.includes("スウェット"));
    const isThin =
      fabricVal &&
      (fabricVal.includes("thin") ||
        fabricVal.includes("lawn") ||
        fabricVal.includes("薄地") ||
        fabricVal.includes("ローン"));
    const isHeavyProject = [
      "lesson_bag",
      "shoe_bag",
      "tote",
      "knapsack",
    ].includes(projectVal);

    const cards = [];

    // ① ジャノメ（主ミシン）
    if (isQuilting || isCanvas || isHeavyProject) {
      cards.push({
        id: "janome",
        badge: "ジャノメ（厚物・強力パワー）",
        color: "#2563eb",
        tagline: "厚手生地・テープ重ね縫い対応",
        models: "ジャノメ NP860 / MP470M",
        description:
          "アクリルテープの重ね縫いや厚手生地も、力強い布送りで針が止まらずスムーズに縫えます。",
        needle: "オルガン針 HA×1 #14（厚地用）",
        thread: "シャッペスパン #60 または #30",
        presser: "基本押え（段差固定ボタン利用）",
        advice:
          "テープ重なり部は針を#14に交換し、手回しで慎重に進めると失敗しません。",
      });
    } else if (isThin) {
      cards.push({
        id: "janome",
        badge: "ジャノメ（薄地・繊細縫い）",
        color: "#2563eb",
        tagline: "パッカリング（縫い縮み）防止",
        models: "ジャノメ NP860 / MP470M",
        description:
          "自動糸調子機能により、ローンや薄地でも縮まずキレイな縫い目になります。",
        needle: "オルガン針 HA×1 #9（薄地用）",
        thread: "シャッペスパン #90（薄地用）",
        presser: "基本押え / 直線専用押え",
        advice:
          "縫い始めの引き込み防止に薄紙を一緒に挟んで縫うとキレイに仕上がります。",
      });
    } else {
      cards.push({
        id: "janome",
        badge: "ジャノメ（標準・万能）",
        color: "#2563eb",
        tagline: "使いやすさと仕上がりの美しさを両立",
        models: "ジャノメ NP860 / MP470M",
        description:
          "自動糸調子・自動糸切り機能付き。入園入学グッズから小物づくりまで幅広く対応します。",
        needle: "オルガン針 HA×1 #11（普通地用）",
        thread: "シャッペスパン #60（普通地用）",
        presser: "基本押え（A押え）/ 裁ち目かがり押え",
        advice:
          "端処理はジグザグ縫いまたは裁ち目かがりを行い、糸くずが出ないよう整えましょう。",
      });
    }

    // ② ベビーロック（ロックミシン・端処理）
    cards.push({
      id: "babylock",
      badge: "ベビーロック（端処理・ロックミシン）",
      color: "#d97706",
      tagline: isKnit
        ? "ニット縫製・伸縮縫いの決定版"
        : "プロ級の美しい端処理・かがり縫い",
      models: "ベビーロック 糸取物語 / 桜井・衣縫人シリーズ",
      description: isKnit
        ? "エアスルー（自動エア糸通し）で準備も簡単。ニット生地の縫い合わせと端処理が同時に完成します。"
        : "生地の端を切りながらキレイにかがり縫い。既製品のような頑丈で美しい仕上がりになります。",
      needle: isKnit ? "ニット専用針 HA×1ST #11〜#14" : "オルガン針 HA×1SP #11",
      thread: isKnit ? "バルキー糸 / レジロン糸" : "ロックミシン用糸 #90",
      presser: "標準ロック押え",
      advice: isKnit
        ? "ニット生地はロックミシン1台で縫い合わせと端処理が同時に完了するため、作業効率が格段に向上します。"
        : "ほつれやすい生地や裁断面の美しさにこだわりたい場合は、ロックミシンでの端処理が最適です。",
    });

    return cards;
  }

  // 3. 案内カードの描画関数
  window.ossRenderMachineBox = function () {
    let container = document.getElementById("oss-machine-recommendation");
    const canvas = document.getElementById("oss-canvas");

    if (!container) {
      const targetArea =
        canvas?.parentElement ||
        document.querySelector(".entry-content") ||
        document.body;
      if (!targetArea) return;

      container = document.createElement("div");
      container.id = "oss-machine-recommendation";
      targetArea.appendChild(container);
    }

    const projectEl = document.getElementById("oss-project");
    const fabricEl =
      document.getElementById("oss-fabric") ||
      document.querySelector('select[name*="fabric"]') ||
      document.querySelector('input[name*="fabric"]');

    const projectVal = projectEl ? projectEl.value : "lesson_bag";
    const fabricVal = fabricEl ? fabricEl.value : "oxford";

    const recommendations = getMachineRecommendations(projectVal, fabricVal);

    container.style.display = "block";

    const cardsHtml = recommendations
      .map((item) => {
        const badgeBg =
          item.color ||
          (item.id === "babylock"
            ? "#d97706"
            : item.id === "juki"
              ? "#10b981"
              : "#2563eb");
        const badgeText = item.badge || item.name || "おすすめ機器";
        const tagline = item.tagline || item.title || "";
        const models = item.models || item.model || "";
        const description = item.description || "";

        return `
        <div style="background:#fff; border:1px solid #cbd5e1; border-left:5px solid ${badgeBg}; padding:16px; margin-bottom:14px; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <span style="background:${badgeBg}; color:#fff; font-size:11px; padding:3px 10px; border-radius:12px; font-weight:bold;">
              ${badgeText}
            </span>
            ${tagline ? `<strong style="color:#1e293b; font-size:14px;">${tagline}</strong>` : ""}
          </div>

          <div style="font-size:14px; color:#0f172a; margin-bottom:8px;">
            <strong>【推奨型番】</strong>：<span style="color:${badgeBg}; font-weight:bold;">${models}</span>
          </div>

          <p style="margin:0 0 10px 0; font-size:13px; color:#475569; line-height:1.5;">
            ${description}
          </p>

          ${
            item.needle || item.thread || item.presser
              ? `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:8px; background:#f8fafc; padding:10px; border-radius:4px; font-size:12px; color:#334155; margin-top:8px;">
              ${item.needle ? `<div>🪡 <strong>針：</strong>${item.needle}</div>` : ""}
              ${item.thread ? `<div>🧵 <strong>糸：</strong>${item.thread}</div>` : ""}
              ${item.presser ? `<div>🦶 <strong>押え：</strong>${item.presser}</div>` : ""}
            </div>
          `
              : ""
          }

          ${
            item.advice
              ? `
            <div style="margin-top:10px; background:#fef3c7; border:1px solid #fde68a; color:#92400e; padding:8px 10px; border-radius:4px; font-size:12px; line-height:1.4;">
              💡 <strong>アドバイス：</strong>${item.advice}
            </div>
          `
              : ""
          }
        </div>
      `;
      })
      .join("");

    container.innerHTML = `
      <div style="margin-top: 25px; padding: 20px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
        <h3 style="margin-top:0; color:#1e293b; font-size:16px; border-bottom:2px solid #2563eb; padding-bottom:8px; display:flex; align-items:center; gap:8px;">
          <span>🧵</span> 選択した作品・生地に最適なおすすめ縫製機器＆道具案内
        </h3>

        <div style="margin-top:14px;">
          ${cardsHtml}
        </div>

        <div style="margin-top:16px; text-align:center;">
          <a href="https://page.line.me/719ecuil" target="_blank" rel="noopener" style="display:inline-block; background:#059669; color:#fff; padding:11px 24px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:14px;">
            店内でのこの生地・作品の試しぬいができます【小田原ミシン店舗予約】
          </a>
        </div>
      </div>
    `;
  };

  // 4. イベント自動監視
  function setupEventListeners() {
    document.addEventListener("change", function (e) {
      if (
        e.target &&
        (e.target.tagName === "SELECT" || e.target.tagName === "INPUT")
      ) {
        window.ossRenderMachineBox();
      }
    });
  }

  // 初期起動
  function initOSSApp() {
    if (typeof window.OSSLayoutRenderer?.draw === "function") {
      window.OSSLayoutRenderer.draw();
    }
    window.ossRenderMachineBox();
    setupEventListeners();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOSSApp);
  } else {
    initOSSApp();
  }
})();
