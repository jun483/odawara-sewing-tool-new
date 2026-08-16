<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class ShoeBagCalculator
{
    public function calculate(array $data): array
    {
        $width        = (float)($data['width'] ?? 0);
        $height       = (float)($data['height'] ?? 0);
        $quantity     = max(1, (int)($data['quantity'] ?? 1));
        $fabricWidth  = (int)($data['fabric_width'] ?? 110);

        if ($width <= 0 || $height <= 0) {
            return [
                'success' => false,
                'message' => '完成サイズを入力してください。'
            ];
        }

        // 縫い代（左右各2cm）
        $seam = 2;

        // 【修正】裁断サイズ（横幅の2倍計算を解除し、正しく左右縫い代のみ加算）
        $cutWidth  = $width + ($seam * 2);      // 横：完成幅 ＋ 左右縫い代
        $cutHeight = $height + 6 + ($seam * 2); // 縦：完成高さ ＋ 折り返し(6cm) ＋ 縫い代

        // 本体2枚（前・後）
        $pieces = $quantity * 2;

        $fabricCalculator = new FabricCalculator();

        $fabric = $fabricCalculator->calculate($cutWidth, $cutHeight, $pieces, $fabricWidth);
        $layout = $fabricCalculator->layout($cutWidth, $cutHeight, $pieces, $fabricWidth);

        return [
            'success'      => true,
            'type'         => 'shoe_bag',
            'title'        => '上履き入れ',
            'fabric'       => $fabric,
            'lining'       => $fabric,
            'fabric_width' => $fabricWidth,
            'cut_width'    => round($cutWidth, 1),
            'cut_height'   => round($cutHeight, 1),

            'quantity'     => $pieces,                   // 描画用（パーツ合計枚数）
            'bag_quantity' => $quantity,                 // 個数
            'pieces'       => $pieces,
            'columns'      => $layout['columns'] ?? 1,   // 列数
            'rows'         => $layout['rows'] ?? 1,      // 行数
            'rotate'       => $layout['rotate'] ?? false,// 回転フラグ
            'layout'       => $layout,

            'handle'       => 30 * $quantity,            // 持ち手用テープ長さ(cm)
            'd_ring'       => 1 * $quantity,             // Dカン個数
            'interfacing'  => round(($cutWidth * $cutHeight * $pieces) / 10000, 2),
        ];
    }
}