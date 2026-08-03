<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class KnapsackCalculator
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

        // マチ
        $gusset = 8;

        // 裁断サイズ
        $cutWidth = ($width * 2) + ($seam * 2);
        $cutHeight = $height + $gusset + 10 + ($seam * 2);

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

            'title' => 'ナップサック',

            'fabric' => $fabric,

            'lining' => 0,

            'fabric_width' => $fabricWidth,

            'cut_width' => round($cutWidth, 1),

            'cut_height' => round($cutHeight, 1),

            'quantity'     => $quantity,

            // 両ひも
            'cord' => ($height + 60) * 2 * $quantity,

            'handle' => 0,

            'interfacing' => 0,

            'pieces' => $pieces,

            'layout' => $layout
        ];
    }
}