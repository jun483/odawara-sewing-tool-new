<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class ResultBuilder
{
    public static function build(array $result): array
    {
        $fabricWidth = (float)($result['fabric_width'] ?? 110);
        $cutWidth    = (float)($result['cut_width'] ?? 1);
        $cutHeight   = (float)($result['cut_height'] ?? 1);
        $quantity    = max(1, (int)($result['quantity'] ?? 1));

        // 裁断レイアウト計算
        $layout = self::calculateLayout(
            $fabricWidth,
            $cutWidth,
            $cutHeight,
            $quantity
        );

        $result['columns']       = $layout['columns'];
        $result['rows']          = $layout['rows'];
        $result['rotate']        = $layout['rotate'];
        $result['layout_length'] = $layout['length'];

        // 材料リンク
        $result['links'] = [

            'fabric' => '/fabric/',
            'lining' => '/lining/',
            'handle' => '/handle/',
            'cord'   => '/cord/',
            'd_ring' => '/d-ring/'

        ];

        // 購入材料一覧
        $result['materials'] = [

            'fabric' => [
                'name' => '表地',
                'quantity' => $result['purchase_fabric'] ?? $result['fabric'] ?? 0,
                'unit' => 'm',
                'url' => 'https://odawaramishin.sling.name/fabric/'
            ],

            'lining' => [
                'name' => '裏地',
                'quantity' => $result['purchase_lining'] ?? $result['lining'] ?? 0,
                'unit' => 'm',
                'url' => 'https://odawaramishin.sling.name/lining/'
            ],

            'handle' => [
                'name' => '持ち手テープ',
                'quantity' => $result['handle'] ?? 0,
                'unit' => 'cm',
                'url' => 'https://odawaramishin.sling.name/handle/'
            ],

            'cord' => [
                'name' => 'カラーひも',
                'quantity' => $result['cord'] ?? 0,
                'unit' => 'cm',
                'url' => 'https://odawaramishin.sling.name/cord/'
            ],

            'd_ring' => [
                'name' => 'Dカン',
                'quantity' => $result['d_ring'] ?? 0,
                'unit' => '個',
                'url' => 'https://odawaramishin.sling.name/d-ring/'
            ]

        ];

        return $result;
    }

    private static function calculateLayout(
        float $fabricWidth,
        float $cutWidth,
        float $cutHeight,
        int $quantity
    ): array {

        $normalColumns = max(1, (int)floor($fabricWidth / $cutWidth));
        $normalRows    = (int)ceil($quantity / $normalColumns);
        $normalLength  = $normalRows * $cutHeight;

        $rotateColumns = max(1, (int)floor($fabricWidth / $cutHeight));
        $rotateRows    = (int)ceil($quantity / $rotateColumns);
        $rotateLength  = $rotateRows * $cutWidth;

        if ($rotateLength < $normalLength) {

            return [
                'rotate' => true,
                'columns' => $rotateColumns,
                'rows' => $rotateRows,
                'length' => $rotateLength
            ];

        }

        return [
            'rotate' => false,
            'columns' => $normalColumns,
            'rows' => $normalRows,
            'length' => $normalLength
        ];
    }
}