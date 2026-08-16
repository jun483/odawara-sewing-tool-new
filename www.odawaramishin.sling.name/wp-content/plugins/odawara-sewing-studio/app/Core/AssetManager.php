<?php

namespace OSS\Core;

if (!defined('ABSPATH')) {
    exit;
}

final class AssetManager
{
    public function __construct()
    {
        \add_action('wp_enqueue_scripts', [$this, 'enqueueFrontend']);
    }

    /**
     * フロント画面のCSS・JavaScript読込
     */
    public function enqueueFrontend(): void
    {
        /*
         * ----------------------------------------
         * CSS
         * ----------------------------------------
         */
        \wp_enqueue_style(
            'oss-style',
            OSS_PLUGIN_URL . 'resources/css/app.css',
            [],
            OSS_VERSION
        );

        /*
         * ----------------------------------------
         * メインJavaScript
         * ----------------------------------------
         */
        \wp_enqueue_script(
            'oss-script',
            OSS_PLUGIN_URL . 'resources/js/app.js',
            [],
            OSS_VERSION,
            true
        );

        /*
         * AJAX設定
         */
        \wp_localize_script(
            'oss-script',
            'oss',
            [
                'ajaxUrl' => \admin_url('admin-ajax.php'),
                'nonce'   => \wp_create_nonce('oss_nonce'),
            ]
        );

        /*
         * ----------------------------------------
         * レイアウト・おすすめミシンエンジン
         *
         * oss-script の後に読み込む
         * ----------------------------------------
         */
        \wp_enqueue_script(
            'oss-layout-renderer',
            OSS_PLUGIN_URL . 'resources/js/layout-renderer.js',
            ['oss-script'],
            OSS_VERSION,
            true
        );

        /*
         * ----------------------------------------
         * ジャノメ
         *
         * layout-renderer.js の後に読み込む
         * ----------------------------------------
         */
        \wp_enqueue_script(
            'oss-janome',
            OSS_PLUGIN_URL . 'resources/js/manufacturers/janome.js',
            ['oss-layout-renderer'],
            OSS_VERSION,
            true
        );
    }
}