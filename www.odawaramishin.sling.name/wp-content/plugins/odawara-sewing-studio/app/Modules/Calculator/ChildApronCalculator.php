<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class ChildApronCalculator
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

        $seam = 2;

        $cutWidth  = $width + ($seam * 2);
        $cutHeight = $height + ($seam * 2);

        $pieces = $quantity;

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
            'type'         => 'child_apron',
            'title'        => '子供用エプロン',
            'fabric'       => $fabric,
            'lining'       => 0,
            'fabric_width' => $fabricWidth,
            'cut_width'    => round($cutWidth, 1),
            'cut_height'   => round($cutHeight, 1),

            'quantity'     => $pieces,
            'bag_quantity' => $quantity,
            'pieces'       => $pieces,

            'columns'      => $layout['columns'] ?? 1,
            'rows'         => $layout['rows'] ?? 1,
            'rotate'       => $layout['rotate'] ?? false,
            'layout'       => $layout,

            'handle'       => 0,
            'cord'         => 0,
            'interfacing'  => 0,
        ];
    }
}