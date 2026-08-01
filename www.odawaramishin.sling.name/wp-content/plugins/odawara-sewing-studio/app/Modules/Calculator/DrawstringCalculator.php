<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class DrawstringCalculator
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
        $cutHeight = $height + 10 + ($seam * 2);

        // 本体2枚
        $pieces = $quantity * 2;

        $calculator = new FabricCalculator();

        $fabric = $calculator->calculate(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth
        );

        return [

            'success' => true,

            'title' => '巾着袋',

            'fabric' => $fabric,

            'lining' => 0,

            'fabric_width' => $fabricWidth,

            'cut_width' => round($cutWidth, 1),

            'cut_height' => round($cutHeight, 1),

            'handle' => 0,

            // 両ひも仕様
            'cord' => ($width * 2 + 20) * 2 * $quantity,

            'interfacing' => 0

        ];
    }
}