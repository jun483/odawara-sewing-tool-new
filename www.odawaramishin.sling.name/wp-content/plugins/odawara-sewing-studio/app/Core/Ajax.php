<?php

namespace OSS\Core;

use OSS\Modules\Calculator\CalculatorEngine;

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
        check_ajax_referer('oss_nonce', 'nonce');

        $engine = new CalculatorEngine();

        $result = $engine->calculate([
            'type'         => sanitize_text_field($_POST['type'] ?? ''),
            'width'        => (float) ($_POST['width'] ?? 0),
            'height'       => (float) ($_POST['height'] ?? 0),
            'quantity'     => max(1, (int) ($_POST['quantity'] ?? 1)),
            'fabric_width' => (int) ($_POST['fabric_width'] ?? 110),

            // ここを追加
            'fabric_type'  => sanitize_text_field(
                $_POST['fabric_type'] ?? 'oxford'
            ),
        ]);

        wp_send_json($result);
    }
}