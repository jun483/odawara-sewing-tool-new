<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class ResultBuilder
{
    public static function build(array $result): array
    {
        $fabricWidth = (float) ($result['fabric_width'] ?? 110);
        $cutWidth    = (float) ($result['cut_width'] ?? 1);
        $cutHeight   = (float) ($result['cut_height'] ?? 1);
        $quantity    = max(1, (int) ($result['quantity'] ?? 1));

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
        $result['links'] = [
            'fabric' => '/fabric/',
            'lining' => '/lining/',
            'handle' => '/handle/',
            'cord' => '/cord/',
            'd_ring' => '/d-ring/'
];

        return $result;
    }

    private static function calculateLayout(
        float $fabricWidth,
        float $cutWidth,
        float $cutHeight,
        int $quantity
    ): array {

        $normalColumns = max(1, (int) floor($fabricWidth / $cutWidth));
        $normalRows = (int) ceil($quantity / $normalColumns);
        $normalLength = $normalRows * $cutHeight;

        $rotateColumns = max(1, (int) floor($fabricWidth / $cutHeight));
        $rotateRows = (int) ceil($quantity / $rotateColumns);
        $rotateLength = $rotateRows * $cutWidth;

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