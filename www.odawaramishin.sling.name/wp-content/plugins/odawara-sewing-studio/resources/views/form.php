<div class="oss-card">

    <h2>生地用尺自動計算ツール</h2>

    <div class="oss-field">

        <label for="oss-project">作品を選択</label>

        <select id="oss-project">

            <option value="lesson_bag">レッスンバッグ</option>
            <option value="shoe_bag">シューズバッグ</option>
            <option value="drawstring">巾着袋</option>
            <option value="tote">トートバッグ</option>
            <option value="lunch_bag">お弁当袋</option>
            <option value="cup_bag">コップ袋</option>
            <option value="knapsack">ナップサック</option>
            <option value="apron">エプロン</option>
            <option value="child_apron">子供用エプロン</option>
            <option value="bandana">三角巾</option>

        </select>

    </div>

    <p id="oss-size-guide" class="oss-guide"></p>

    <div class="oss-field">

        <label for="oss-width">完成横幅（cm）</label>

        <input
            type="number"
            id="oss-width"
            value="40"
            min="1"
            step="0.5"
        >

    </div>

    <div class="oss-field">

        <label for="oss-height">完成高さ（cm）</label>

        <input
            type="number"
            id="oss-height"
            value="30"
            min="1"
            step="0.5"
        >

    </div>

    <div
        id="oss-gusset-area"
        class="oss-field"
        style="display:none;"
    >

        <label for="oss-gusset">マチ（cm）</label>

        <input
            type="number"
            id="oss-gusset"
            value="10"
            min="0"
            step="0.5"
        >

    </div>

    <div class="oss-field">

        <label for="oss-qty">数量</label>

        <input
            type="number"
            id="oss-qty"
            value="1"
            min="1"
        >

    </div>

    <div class="oss-field">

        <label for="oss-fabric-type">生地の種類</label>

        <select id="oss-fabric-type">

            <option value="oxford">オックス</option>

            <option value="canvas">帆布</option>

            <option value="broad">ブロード</option>

            <option value="sheeting">シーチング</option>

            <option value="twill">ツイル</option>

            <option value="linen">リネン</option>

            <option value="quilting">キルティング</option>

            <option value="laminate">ラミネート</option>

            <option value="denim">デニム</option>

            <option value="double_gauze">ダブルガーゼ</option>

            <option value="fleece">フリース</option>

        </select>

        <label for="oss-fabric-width">生地幅</label>

        <select id="oss-fabric-width">

            <option value="90">90cm</option>
            <option value="108">108cm</option>
            <option value="110" selected>110cm</option>

        </select>

    </div>

    <div class="oss-button-area">

        <button
            id="oss-calc"
            type="button"
            class="oss-button"
        >
            計算する
        </button>

    </div>

</div>