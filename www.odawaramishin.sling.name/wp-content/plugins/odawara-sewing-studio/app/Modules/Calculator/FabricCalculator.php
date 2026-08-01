<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class FabricCalculator
{
    /**
     * 必要な生地(m)を計算
     */
    public function calculate(
        float $cutWidth,
        float $cutHeight,
        int $pieces,
        int $fabricWidth = 110,
        float $lossRate = 0.10
    ): float {

        if (
            $cutWidth <= 0 ||
            $cutHeight <= 0 ||
            $pieces <= 0
        ) {
            return 0;
        }

        // 横方向に何枚並ぶか
        $columns = max(
            1,
            (int) floor($fabricWidth / $cutWidth)
        );

        // 必要段数
        $rows = (int) ceil($pieces / $columns);

        // 必要長さ(cm)
        $length = $rows * $cutHeight;

        // ロス率追加
        $length *= (1 + $lossRate);

        // mへ変換
        return round($length / 100, 2);
    }

    /**
     * 裁断レイアウト情報
     */
    public function layout(
        float $cutWidth,
        float $cutHeight,
        int $pieces,
        int $fabricWidth = 110
    ): array {

        $columns = max(
            1,
            (int) floor($fabricWidth / $cutWidth)
        );

        $rows = (int) ceil($pieces / $columns);

        $layout = [];

        $count = 0;

        for ($r = 0; $r < $rows; $r++) {

            $line = [];

            for ($c = 0; $c < $columns; $c++) {

                if ($count >= $pieces) {
                    break;
                }

                $line[] = [
                    'x' => $c * $cutWidth,
                    'y' => $r * $cutHeight,
                    'width' => $cutWidth,
                    'height' => $cutHeight,
                ];

                $count++;
            }

            $layout[] = $line;
        }

        return [
            'fabric_width' => $fabricWidth,
            'columns'      => $columns,
            'rows'         => $rows,
            'pieces'       => $pieces,
            'layout'       => $layout,
        ];
    }
}