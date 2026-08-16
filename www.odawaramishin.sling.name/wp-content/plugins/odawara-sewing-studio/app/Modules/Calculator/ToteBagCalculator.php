<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class ToteBagCalculator
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
        // 縫い代
        // ==========================

        $seam = 2;

        // ==========================
        // 裁断サイズ
        // ==========================

        $cutWidth  = $width + ($seam * 2);
        $cutHeight = $height + 6 + ($seam * 2);

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
        // 裏地
        // 表地と同じ必要量
        // ==========================

        $lining = $fabric;

        // ==========================
        // おすすめ購入量
        // 必要量 + 10%
        // 10cm単位で切り上げ
        // ==========================

        $purchaseFabric = 0;

        if ($fabric > 0) {
            $purchaseFabric = ceil($fabric * 1.1 * 10) / 10;
        }

        $purchaseLining = 0;

        if ($lining > 0) {
            $purchaseLining = ceil($lining * 1.1 * 10) / 10;
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

            'type' => 'tote',

            'title' => 'トートバッグ',

            // --------------------------
            // 表地
            // --------------------------

            'fabric' => $fabric,

            'purchase_fabric' => $purchaseFabric,

            // --------------------------
            // 裏地
            // --------------------------

            'lining' => $lining,

            'purchase_lining' => $purchaseLining,

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

            'handle' => 60 * 2 * $quantity,

            'interfacing' => round(
                ($cutWidth * $cutHeight * $pieces) / 10000,
                2
            ),
        ];
    }
}