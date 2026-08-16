<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class FabricCalculator
{
    /**
     * 必要な生地(m)を計算
     *
     * 通常方向と90度回転方向を比較し、
     * より少ない生地量になるレイアウトを採用します。
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
            $pieces <= 0 ||
            $fabricWidth <= 0
        ) {
            return 0;
        }

        $normal = $this->calculateLayoutData(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth
        );

        $rotated = $this->calculateLayoutData(
            $cutHeight,
            $cutWidth,
            $pieces,
            $fabricWidth
        );

        /*
         * 生地幅に収まらない場合は、
         * その方向を無効にします。
         */
        $normalLength = $normal['valid']
            ? $normal['length']
            : PHP_FLOAT_MAX;

        $rotatedLength = $rotated['valid']
            ? $rotated['length']
            : PHP_FLOAT_MAX;

        /*
         * より短い方向を採用
         */
        $bestLength = min(
            $normalLength,
            $rotatedLength
        );

        if ($bestLength === PHP_FLOAT_MAX) {
            return 0;
        }

        /*
         * ロス率を追加
         */
        $bestLength *= (1 + $lossRate);

        /*
         * cm → m
         */
        return round($bestLength / 100, 2);
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

        if (
            $cutWidth <= 0 ||
            $cutHeight <= 0 ||
            $pieces <= 0 ||
            $fabricWidth <= 0
        ) {
            return [
                'fabric_width' => $fabricWidth,
                'columns' => 0,
                'rows' => 0,
                'pieces' => 0,
                'rotate' => false,
                'length' => 0,
                'layout' => [],
            ];
        }

        /*
         * 通常方向
         */
        $normal = $this->calculateLayoutData(
            $cutWidth,
            $cutHeight,
            $pieces,
            $fabricWidth
        );

        /*
         * 90度回転
         */
        $rotated = $this->calculateLayoutData(
            $cutHeight,
            $cutWidth,
            $pieces,
            $fabricWidth
        );

        /*
         * 生地に収まる方向だけを候補にする
         */
        $candidates = [];

        if ($normal['valid']) {
            $candidates[] = [
                'rotate' => false,
                'data' => $normal,
            ];
        }

        if ($rotated['valid']) {
            $candidates[] = [
                'rotate' => true,
                'data' => $rotated,
            ];
        }

        /*
         * どちらも入らない場合
         */
        if (empty($candidates)) {
            return [
                'fabric_width' => $fabricWidth,
                'columns' => 0,
                'rows' => 0,
                'pieces' => $pieces,
                'rotate' => false,
                'length' => 0,
                'layout' => [],
            ];
        }

        /*
         * 一番短いレイアウトを選択
         */
        usort(
            $candidates,
            function ($a, $b) {
                return $a['data']['length']
                    <=> $b['data']['length'];
            }
        );

        $best = $candidates[0];

        $data = $best['data'];

        /*
         * レイアウト図を作成
         */
        $layout = [];

        $count = 0;

        for ($r = 0; $r < $data['rows']; $r++) {

            $line = [];

            for ($c = 0; $c < $data['columns']; $c++) {

                if ($count >= $pieces) {
                    break;
                }

                $line[] = [
                    'x' => $c * $data['width'],
                    'y' => $r * $data['height'],
                    'width' => $data['width'],
                    'height' => $data['height'],
                ];

                $count++;
            }

            $layout[] = $line;
        }

        return [
            'fabric_width' => $fabricWidth,

            'columns' => $data['columns'],

            'rows' => $data['rows'],

            'pieces' => $pieces,

            'rotate' => $best['rotate'],

            'length' => $data['length'],

            'layout' => $layout,
        ];
    }


    /**
     * 1方向のレイアウト計算
     */
    private function calculateLayoutData(
        float $width,
        float $height,
        int $pieces,
        int $fabricWidth
    ): array {

        /*
         * 生地幅に収まらない
         */
        if ($width > $fabricWidth) {
            return [
                'valid' => false,
                'columns' => 0,
                'rows' => 0,
                'length' => 0,
                'width' => $width,
                'height' => $height,
            ];
        }

        /*
         * 横方向に何枚並ぶか
         */
        $columns = max(
            1,
            (int) floor($fabricWidth / $width)
        );

        /*
         * 必要段数
         */
        $rows = (int) ceil(
            $pieces / $columns
        );

        /*
         * 必要生地長
         */
        $length = $rows * $height;

        return [
            'valid' => true,

            'columns' => $columns,

            'rows' => $rows,

            'length' => $length,

            'width' => $width,

            'height' => $height,
        ];
    }
}