<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class LunchBagCalculator
{
    public function calculate(array $data): array
    {
        $width       = (float)($data['width'] ?? 0);
        $height      = (float)($data['height'] ?? 0);
        $quantity    = max(1, (int)($data['quantity'] ?? 1));
        $fabricWidth = (int)($data['fabric_width'] ?? 110);

        if ($width <= 0 || $height <= 0) {
            return [
                'success' => false,
                'message' => '完成サイズを入力してください。'
            ];
        }

        // ==========================
        // マチ
        // ==========================

        $gusset = 10;

        // ==========================
        // 縫い代
        // ==========================

        $seam = 2;

        // ==========================
        // 裁断サイズ
        // ==========================

        $cutWidth = $width + $gusset + ($seam * 2);

        $cutHeight =
            $height
            + ($gusset / 2)
            + 12
            + ($seam * 2);

        // ==========================
        // 本体2枚
        // ==========================

        $pieces = $quantity * 2;

        $calculator = new FabricCalculator();

        // ==========================
        // 表地
        // ロスなしの実必要量
        // ==========================

        $fabric = $calculator->calculate(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth,
            0.0
        );

        // ==========================
        // おすすめ購入量
        // 必要量 + 10%
        // 10cm単位で切り上げ
        // ==========================

        $purchaseFabric = 0;

        if ($fabric > 0) {
            $purchaseFabric =
                ceil($fabric * 1.1 * 10) / 10;
        }

        // ==========================
        // 裁断レイアウト
        // ==========================

        $layout = $calculator->layout(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth
        );

        // ==========================
        // 結果
        // ==========================

        return [

            'success' => true,

            'type' => 'lunch_bag',

            'title' => 'お弁当袋',

            // --------------------------
            // 表地
            // --------------------------

            'fabric' => $fabric,

            'purchase_fabric' => $purchaseFabric,

            // --------------------------
            // 裏地
            // --------------------------

            'lining' => 0,

            'purchase_lining' => 0,

            // --------------------------
            // 生地情報
            // --------------------------

            'fabric_width' => $fabricWidth,

            'cut_width' => round($cutWidth, 1),

            'cut_height' => round($cutHeight, 1),

            // --------------------------
            // 数量
            // --------------------------

            'quantity' => $pieces,

            'bag_quantity' => $quantity,

            'pieces' => $pieces,

            // --------------------------
            // レイアウト
            // --------------------------

            'columns' => $layout['columns'] ?? 1,

            'rows' => $layout['rows'] ?? 1,

            'rotate' => $layout['rotate'] ?? false,

            'layout' => $layout,

            // --------------------------
            // 付属材料
            // --------------------------

            'cord' => ($width * 2 + 20) * 2 * $quantity,

            'handle' => 0,

            'interfacing' => 0,
        ];
    }
}