<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class PurchaseCalculator
{
    /**
     * 購入目安(m)
     */
    public static function recommend(float $length): float
    {
        if ($length <= 0) {
            return 0;
        }

        // 0.5m単位で切り上げ
        return ceil($length * 2) / 2;
    }
}