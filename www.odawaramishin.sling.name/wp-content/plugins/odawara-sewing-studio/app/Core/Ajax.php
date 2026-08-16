<?php

namespace OSS\Core;

use OSS\Modules\Calculator\CalculatorEngine;
use OSS\Modules\Calculator\ResultBuilder;

if (!defined('ABSPATH')) {
    exit;
}

final class Ajax
{
    public function __construct()
    {
        add_action('wp_ajax_oss_calculate', [$this, 'calculate']);
        add_action('wp_ajax_nopriv_oss_calculate', [$this, 'calculate']);
    }

    /**
     * 生地計算
     */
    public function calculate(): void
    {
        // nonceチェック
        check_ajax_referer('oss_nonce', 'nonce');

        // 計算エンジン
        $engine = new CalculatorEngine();

        // 入力値取得と計算実行
        $result = $engine->calculate([
            'type'         => sanitize_text_field($_POST['type'] ?? ''),
            'width'        => (float) ($_POST['width'] ?? 0),
            'height'       => (float) ($_POST['height'] ?? 0),
            'quantity'     => max(1, (int) ($_POST['quantity'] ?? 1)),
            'fabric_width' => (int) ($_POST['fabric_width'] ?? 110),
            'fabric_type'  => sanitize_text_field($_POST['fabric_type'] ?? 'oxford'),
            'gusset'       => (float) ($_POST['gusset'] ?? 0),
        ]);

        // ResultBuilderで結果を構築
        $result = ResultBuilder::build($result);

        // AJAXレスポンス（JSON返却）
        wp_send_json($result);
    }
}