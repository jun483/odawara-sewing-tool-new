<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class ResultBuilder
{
    /**
     * 計算結果を完成させる
     */
    public static function build(array $result): array
    {
        // ==============================
        // 基本データ
        // ==============================

        $fabricWidth = (float) ($result['fabric_width'] ?? 110);

        $cutWidth = (float) ($result['cut_width'] ?? 1);

        $cutHeight = (float) ($result['cut_height'] ?? 1);

        $quantity = max(
            1,
            (int) ($result['quantity'] ?? 1)
        );

        // ==============================
        // 裁断レイアウト計算
        // ==============================

        $layout = self::calculateLayout(
            $fabricWidth,
            $cutWidth,
            $cutHeight,
            $quantity
        );

        $result['columns'] = $layout['columns'];

        $result['rows'] = $layout['rows'];

        $result['rotate'] = $layout['rotate'];

        $result['layout_length'] = $layout['length'];

        // ==============================
        // おすすめ購入量
        // ==============================
        //
        // FabricCalculator側ですでに10%の
        // ロスを加えているため、
        // ここでは0.1m単位に切り上げる。
        //

        $fabricRequired = (float) ($result['fabric'] ?? 0);

        if ($fabricRequired > 0) {
            $result['purchase_fabric'] =
                ceil($fabricRequired * 10) / 10;
        } else {
            $result['purchase_fabric'] = 0;
        }

        $liningRequired = (float) ($result['lining'] ?? 0);

        if ($liningRequired > 0) {
            $result['purchase_lining'] =
                ceil($liningRequired * 10) / 10;
        } else {
            $result['purchase_lining'] = 0;
        }

        // ==============================
        // 生地種類
        // ==============================

        $fabricType = $result['fabric_type'] ?? 'oxford';

        $fabricNames = [

            'oxford' => 'オックス生地',

            'canvas' => '帆布',

            'broad' => 'ブロード生地',

            'sheeting' => 'シーチング生地',

            'twill' => 'ツイル生地',

            'linen' => 'リネン生地',

            'quilting' => 'キルティング生地',

            'laminate' => 'ラミネート生地',

            'denim' => 'デニム生地',

            'double_gauze' => 'ダブルガーゼ',

            'fleece' => 'フリース',
        ];

        $fabricName =
            $fabricNames[$fabricType]
            ?? 'オックス生地';

        // ==============================
        // 材料数量
        // ==============================

        // 表地
        $fabricQuantity =
            (float) ($result['purchase_fabric'] ?? 0);

        // 裏地
        $liningQuantity =
            (float) ($result['purchase_lining'] ?? 0);

        // 持ち手
        $handleQuantity =
            (float) ($result['handle'] ?? 0);

        // ひも
        $cordQuantity =
            (float) ($result['cord'] ?? 0);

        // Dカン
        $dRingQuantity =
            (int) ($result['d_ring'] ?? 0);

        // ==============================
        // 材料購入ページ
        // ==============================

        $result['links'] = [

            'fabric' =>
                'https://odawaramishin.sling.name/fabric/',

            'lining' =>
                'https://odawaramishin.sling.name/lining/',

            'handle' =>
                'https://odawaramishin.sling.name/handle/',

            'cord' =>
                'https://odawaramishin.sling.name/cord/',

            'd_ring' =>
                'https://odawaramishin.sling.name/d-ring/',
        ];

        // ==============================
        // 購入材料一覧
        // ==============================

        $result['materials'] = [

            // ------------------------------
            // 表地
            // ------------------------------

            'fabric' => [

                'name' =>
                    $fabricName,

                'quantity' =>
                    $fabricQuantity,

                'unit' =>
                    'm',

                'url' =>
                    $result['links']['fabric'],
            ],

            // ------------------------------
            // 裏地
            // ------------------------------

            'lining' => [

                'name' =>
                    '裏地（シーチング）',

                'quantity' =>
                    $liningQuantity,

                'unit' =>
                    'm',

                'url' =>
                    $result['links']['lining'],
            ],

            // ------------------------------
            // 持ち手
            // ------------------------------

            'handle' => [

                'name' =>
                    '持ち手テープ',

                'quantity' =>
                    $handleQuantity,

                'unit' =>
                    'cm',

                'url' =>
                    $result['links']['handle'],
            ],

            // ------------------------------
            // ひも
            // ------------------------------

            'cord' => [

                'name' =>
                    'カラーひも',

                'quantity' =>
                    $cordQuantity,

                'unit' =>
                    'cm',

                'url' =>
                    $result['links']['cord'],
            ],

            // ------------------------------
            // Dカン
            // ------------------------------

            'd_ring' => [

                'name' =>
                    'Dカン',

                'quantity' =>
                    $dRingQuantity,

                'unit' =>
                    '個',

                'url' =>
                    $result['links']['d_ring'],
            ],
        ];

        // ==============================
        // 完成した結果を返す
        // ==============================

        return $result;
    }


    /**
     * 裁断レイアウト計算
     */
    private static function calculateLayout(
        float $fabricWidth,
        float $cutWidth,
        float $cutHeight,
        int $quantity
    ): array {

        // ==============================
        // 通常方向
        // ==============================

        $normalColumns = max(
            1,
            (int) floor(
                $fabricWidth / $cutWidth
            )
        );

        $normalRows = (int) ceil(
            $quantity / $normalColumns
        );

        $normalLength =
            $normalRows * $cutHeight;


        // ==============================
        // 90度回転
        // ==============================

        $rotateColumns = max(
            1,
            (int) floor(
                $fabricWidth / $cutHeight
            )
        );

        $rotateRows = (int) ceil(
            $quantity / $rotateColumns
        );

        $rotateLength =
            $rotateRows * $cutWidth;


        // ==============================
        // 短い方を採用
        // ==============================

        if ($rotateLength < $normalLength) {

            return [

                'rotate' =>
                    true,

                'columns' =>
                    $rotateColumns,

                'rows' =>
                    $rotateRows,

                'length' =>
                    $rotateLength,
            ];
        }


        return [

            'rotate' =>
                false,

            'columns' =>
                $normalColumns,

            'rows' =>
                $normalRows,

            'length' =>
                $normalLength,
        ];
    }
}