<div class="oss-container">

    <div class="oss-card">

        <h2>生地計算ツール</h2>

        <div class="oss-field">

            <label>作品</label>

            <select id="oss-project">

                <option value="lesson_bag">レッスンバッグ</option>
                <option value="shoe_bag">シューズバッグ（準備中）</option>
                <option value="drawstring">巾着袋（準備中）</option>
                <option value="tote">トートバッグ（準備中）</option>
                <option value="lunch_bag">お弁当袋（準備中）</option>
                <option value="cup_bag">コップ袋（準備中）</option>
                <option value="knapsack">ナップサック（準備中）</option>

            </select>

        </div>

        <div class="oss-field">

            <label>完成幅(cm)</label>

            <input
                type="number"
                id="oss-width"
                value="40"
                min="1"
            >

        </div>

        <div class="oss-field">

            <label>完成高さ(cm)</label>

            <input
                type="number"
                id="oss-height"
                value="30"
                min="1"
            >

        </div>

        <div class="oss-field">

            <label>数量</label>

            <input
                type="number"
                id="oss-qty"
                value="1"
                min="1"
            >

        </div>

        <div class="oss-field">

            <label>生地幅</label>

            <select id="oss-fabric-width">

                <option value="90">90cm</option>
                <option value="108">108cm</option>
                <option value="110" selected>110cm</option>
                <option value="112">112cm</option>
                <option value="140">140cm</option>

            </select>

        </div>

        <div class="oss-field">

            <button
                id="oss-calc"
                class="oss-button"
            >
                計算する
            </button>

        </div>

        <div id="oss-result"></div>

    </div>

</div>