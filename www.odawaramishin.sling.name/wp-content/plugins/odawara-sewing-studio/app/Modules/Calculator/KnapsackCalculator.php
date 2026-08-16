<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class KnapsackCalculator
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

        // 縫い代（左右各2cm）
        $seam = 2;

        // マチ
        $gusset = 8;

        // 【修正】パーツ1枚あたりの裁断サイズ（横幅の2倍計算を修正）
        $cutWidth  = $width + ($seam * 2);
        $cutHeight = $height + $gusset + 10 + ($seam * 2);

        // 本体2枚（前・後）
        $pieces = $quantity * 2;

        $calculator = new FabricCalculator();

        $fabric = $calculator->calculate(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth,
            0.0
        );

        $layout = $calculator->layout(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth
        );

        return [
            'success'      => true,
            'type'         => 'knapsack',
            'title'        => 'ナップサック',
            'fabric'       => $fabric,
            'lining'       => 0,
            'fabric_width' => $fabricWidth,
            'cut_width'    => round($cutWidth, 1),
            'cut_height'   => round($cutHeight, 1),

            // 描画・レイアウト必須項目
            'quantity'     => $pieces,                   // 描画用（パーツ合計枚数）
            'bag_quantity' => $quantity,                 // 作品の個数
            'pieces'       => $pieces,
            'columns'      => $layout['columns'] ?? 1,   // 列数
            'rows'         => $layout['rows'] ?? 1,      // 行数
            'rotate'       => $layout['rotate'] ?? false,// 回転フラグ
            'layout'       => $layout,

            // 付属材料
            'cord'         => ($height + 60) * 2 * $quantity, // ひも長さ
            'handle'       => 0,
            'd_ring'       => 2 * $quantity,                  // Dカン（またはループ用パーツ）個数
            'interfacing'  => 0,
        ];
    }
}