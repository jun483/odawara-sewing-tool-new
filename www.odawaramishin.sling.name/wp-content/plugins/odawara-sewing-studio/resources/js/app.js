document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // XSS対策
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
    // 要素取得
    // ==========================

    const project = document.getElementById("oss-project");
    const button = document.getElementById("oss-calc");

    const result = document.getElementById("oss-result");
    const loading = document.getElementById("oss-loading");
    const error = document.getElementById("oss-error");

    const guide = document.getElementById("oss-size-guide");
    const gussetArea = document.getElementById("oss-gusset-area");

    // ==========================
    // サイズガイド
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

        bandana: "おすすめ：55 × 55cm"

        apron: "おすすめ：70 × 80cm",

        child_apron: "おすすめ：60 × 70cm",

        bandana: "おすすめ：55 × 55cm",

    };

    // ==========================
    // サイズガイド更新
    // ==========================

    function updateGuide() {

        if (guide && project) {

            guide.textContent =
                sizeGuide[project.value] ?? "";

        }

        if (gussetArea && project) {

            if (
                project.value === "lunch_bag" ||
                project.value === "cup_bag"
            ) {

                gussetArea.style.display = "block";

            } else {

                gussetArea.style.display = "none";

            }

        }

    }

    if (project) {

        updateGuide();

        project.addEventListener(
            "change",
            updateGuide
        );

    }

    // ==========================
    // 計算ボタン
    // ==========================

    if (button) {

        button.addEventListener(
            "click",
            calculate
        );

    }

    // ==========================
    // AJAX計算
    // ==========================

    function calculate() {

        loading.style.display = "block";

        result.innerHTML = "";

        error.style.display = "none";

        error.innerHTML = "";

        const formData = new FormData();

        formData.append(
            "action",
            "oss_calculate"
        );

        formData.append(
            "nonce",
            oss.nonce
        );

        formData.append(
            "type",
            project.value
        );

        formData.append(
            "width",
            document.getElementById("oss-width").value
        );

        formData.append(
            "height",
            document.getElementById("oss-height").value
        );

        formData.append(
            "gusset",
            document.getElementById("oss-gusset").value
        );

        formData.append(
            "quantity",
            document.getElementById("oss-qty").value
        );

        formData.append(
            "fabric_width",
            document.getElementById("oss-fabric-width").value
        );

        formData.append(
            "fabric_type",
            document.getElementById("oss-fabric-type").value
        );

        fetch(
            oss.ajaxUrl,
            {
                method: "POST",
                body: formData
            }
        )

        .then(response => response.json())

        .then(data => {

            loading.style.display = "none";

            if (!data.success) {

                error.style.display = "block";

                error.innerHTML =
                    data.message ??
                    "計算に失敗しました。";

                return;

            }

            showResult(data);

        })

        .catch(err => {

            console.error(err);

            loading.style.display = "none";

            error.style.display = "block";

            error.innerHTML =
                "通信エラーが発生しました。";

        });

    }

    // ==========================
    // showResult(data)
    // Part2で続きます
    // ==========================
    function showResult(data) {

    const dateText = new Date().toLocaleString("ja-JP");

    let html = `

    <div class="oss-result-card">

        <h2>${escapeHTML(data.title)}</h2>

        <p class="oss-date">
            計算日時：${escapeHTML(dateText)}
        </p>

        <table class="oss-table">

            <tr>
                <th>必要な表地</th>
                <td>${escapeHTML(data.fabric)} m</td>
            </tr>

            <tr>
                <th>おすすめ購入量（表地）</th>
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
                <td>
                    ${escapeHTML(data.cut_width)}
                    ×
                    ${escapeHTML(data.cut_height)}
                    cm
                </td>
            </tr>
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
        </table>
    </div>
    `;