<?php
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="oss-container">

    <div class="oss-card">

        <h2 class="oss-title">
            🧵 小田原ミシン 生地計算ツール
        </h2>

        <p class="oss-description">
            作りたい作品を選択してサイズを入力してください。
            必要な表地・裏地・副資材を自動計算します。
        </p>

        <div class="oss-field">

            <label for="oss-project">
                作品
            </label>

            <select id="oss-project">

                <option value="lesson_bag">
                    レッスンバッグ
                </option>

                <option value="shoe_bag">
                    シューズバッグ
                </option>

                <option value="drawstring">
                    巾着袋
                </option>

                <option value="tote">
                    トートバッグ
                </option>

                <option value="lunch_bag">
                    お弁当袋
                </option>

                <option value="cup_bag">
                    コップ袋
                </option>

                <option value="knapsack">
                    ナップサック
                </option>

            </select>

        </div>

        <div class="oss-guide">

            <strong>おすすめサイズ</strong>

            <div id="oss-size-guide">
                40 × 30cm
            </div>

        </div>

        <div class="oss-field">

            <label for="oss-width">
                完成幅(cm)
            </label>

            <input
                type="number"
                id="oss-width"
                value="40"
                min="1"
                step="0.5"
            >

        </div>

        <div class="oss-field">

            <label for="oss-height">
                完成高さ(cm)
            </label>

            <input
                type="number"
                id="oss-height"
                value="30"
                min="1"
                step="0.5"
            >

        </div>

        <div
            class="oss-field"
            id="oss-gusset-area"
            style="display:none;"
        >

            <label for="oss-gusset">
                マチ(cm)
            </label>

            <input
                type="number"
                id="oss-gusset"
                value="10"
                min="0"
                step="0.5"
            >

        </div>

        <div class="oss-field">

            <label for="oss-qty">
                数量
            </label>

            <input
                type="number"
                id="oss-qty"
                value="1"
                min="1"
            >

        </div>

        <div class="oss-field">

            <label for="oss-fabric-width">
                生地幅
            </label>

            <select id="oss-fabric-width">

                <option value="90">90cm</option>

                <option value="108">
                    108cm
                </option>

                <option value="110" selected>
                    110cm
                </option>

                <option value="112">
                    112cm
                </option>

                <option value="140">
                    140cm
                </option>

            </select>
                    <div class="oss-field">

            <button
                type="button"
                id="oss-calc"
                class="oss-button"
            >
                🧮 生地を計算する
            </button>

        </div>

        <div class="oss-loading" id="oss-loading" style="display:none;">

            計算中です...

        </div>

        <div
            id="oss-result"
            class="oss-result"
        >

        </div>

        <div
            id="oss-layout"
            class="oss-layout"
            style="display:none;"
        >

            <h3>裁断レイアウト</h3>

            <canvas
                id="oss-layout-canvas"
                width="700"
                height="450"
            ></canvas>

        </div>

        <div
            id="oss-error"
            class="oss-error"
            style="display:none;"
        ></div>

    </div>

</div>
<hr class="oss-divider">

<div class="oss-help">

    <h3>使い方</h3>

    <ol class="oss-help-list">

        <li>作品を選択します。</li>

        <li>完成サイズ・数量・生地幅を入力します。</li>

        <li>「生地を計算する」をクリックします。</li>

        <li>必要な生地・裏地・副資材が表示されます。</li>

    </ol>

</div>

<div class="oss-notice">

    <h3>ご注意</h3>

    <ul>

        <li>計算結果は目安です。</li>

        <li>柄合わせ・水通し・縮み分は含まれていません。</li>

        <li>縫い代は各作品の標準値で計算しています。</li>

        <li>生地は余裕をもってご購入ください。</li>

    </ul>

</div>

<div class="oss-footer">

    <p>
        © <?php echo date('Y'); ?> 小田原ミシン
    </p>

</div>

        </div>