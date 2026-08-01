<?php

namespace OSS\Core;

if (!defined('ABSPATH')) {
    exit;
}

final class Shortcode
{
    /**
     * コンストラクタ
     */
    public function __construct()
    {
        add_shortcode(
            'odawara_sewing_studio',
            [$this, 'render']
        );
    }

    /**
     * ショートコード表示
     */
    public function render(array $atts = []): string
    {
        ob_start();

        $view = OSS_PLUGIN_PATH . 'resources/views/calculator.php';

        if (file_exists($view)) {
            include $view;
        } else {
            ?>
            <div class="oss-container">
                <div class="oss-card">
                    <h2>Odawara Sewing Studio</h2>
                    <p>calculator.php が見つかりません。</p>
                </div>
            </div>
            <?php
        }

        return ob_get_clean();
    }
}