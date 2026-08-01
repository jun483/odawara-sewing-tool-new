<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class ToteBagCalculator
{
    public function calculate(array $data): array
    {
        $width = (float)($data['width'] ?? 0);
        $height = (float)($data['height'] ?? 0);
        $quantity = max(1, (int)($data['quantity'] ?? 1));
        $fabricWidth = (int)($data['fabric_width'] ?? 110);

        if ($width <= 0 || $height <= 0) {
            return [
                'success' => false,
                'message' => '完成サイズを入力してください。'
            ];
        }

        // 縫い代
        $seam = 2;

        // 裁断サイズ
        $cutWidth  = ($width * 2) + ($seam * 2);
        $cutHeight = $height + 6 + ($seam * 2);

        // 本体2枚
        $pieces = $quantity * 2;

        $calculator = new FabricCalculator();

        $fabric = $calculator->calculate(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth
        );

        $layout = $calculator->layout(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth
        );

        return [

            'success' => true,

            'title' => 'トートバッグ',

            'fabric' => $fabric,

            'lining' => $fabric,

            'fabric_width' => $fabricWidth,

            'cut_width' => round($cutWidth, 1),

            'cut_height' => round($cutHeight, 1),

            // 持ち手60cm×2本
            'handle' => 60 * 2 * $quantity,

            'interfacing' => round(
                ($cutWidth * $cutHeight * $pieces) / 10000,
                2
            ),

            'pieces' => $pieces,

            'layout' => $layout

        ];
    }
}