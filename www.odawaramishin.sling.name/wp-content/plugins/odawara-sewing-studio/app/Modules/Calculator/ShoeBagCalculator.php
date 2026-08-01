<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class ShoeBagCalculator
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


        // 袋本体裁断サイズ
        $cutWidth = $width + ($seam * 2);

        $cutHeight = ($height * 2) + 6 + ($seam * 2);


        // 表裏2枚
        $pieces = $quantity;


        $calculator = new FabricCalculator();


        $fabric = $calculator->calculate(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth
        );


        return [

            'success' => true,

            'title' => 'シューズバッグ',

            'fabric' => $fabric,

            'lining' => $fabric,

            'fabric_width' => $fabricWidth,

            'cut_width' => round($cutWidth,1),

            'cut_height' => round($cutHeight,1),

            'handle' => 30 * $quantity,

            'interfacing' => round(
                ($cutWidth * $cutHeight * $pieces) / 10000,
                2
            )

        ];

    }
}