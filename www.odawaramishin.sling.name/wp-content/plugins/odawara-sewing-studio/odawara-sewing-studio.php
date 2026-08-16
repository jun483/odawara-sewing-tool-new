<?php
/**
 * Plugin Name: Odawara Sewing Studio
 * Plugin URI: https://www.odawaramishin.sling.name/
 * Description: 小田原ミシン 生地計算・裁断レイアウト・型紙作成プラグイン
 * Version: 1.0.0
 * Author: 小田原ミシン
 * Author URI: https://www.odawaramishin.sling.name/
 * License: GPL v2 or later
 * Text Domain: odawara-sewing-studio
 */

if (!defined('ABSPATH')) {
    exit;
}

define('OSS_VERSION', '1.0.0');
define('OSS_PLUGIN_FILE', __FILE__);
define('OSS_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('OSS_PLUGIN_URL', plugin_dir_url(__FILE__));

require_once OSS_PLUGIN_PATH . 'app/Core/Autoloader.php';

OSS\Core\Autoloader::register();

add_action('plugins_loaded', function () {
    OSS\Core\Application::boot();
});

// フロントエンド用JavaScript読み込み設定
add_action('wp_enqueue_scripts', function () {
    // resources/js ディレクトリのURLを指定
    $js_dir = OSS_PLUGIN_URL . 'resources/js';
    $version = time();

    // 1. 基盤レジストリ（最初に読み込み）
    wp_enqueue_script(
        'oss-machine-registry',
        $js_dir . '/manufacturers/registry.js',
        array(),
        $version,
        true
    );

    // 2. ジャノメ（契約済み：有効化）
    wp_enqueue_script(
        'oss-machine-janome',
        $js_dir . '/manufacturers/janome.js',
        array('oss-machine-registry'),
        $version,
        true
    );

    // 3. JUKI・ブラザー（未契約：一時停止中）
    /*
    wp_enqueue_script(
        'oss-machine-juki',
        $js_dir . '/manufacturers/juki.js',
        array('oss-machine-registry'),
        $version,
        true
    );
    wp_enqueue_script(
        'oss-machine-brother',
        $js_dir . '/manufacturers/brother.js',
        array('oss-machine-registry'),
        $version,
        true
    );
    */

    // 4. メイン描画処理
    wp_enqueue_script(
        'oss-layout-renderer',
        $js_dir . '/layout-renderer.js',
        array('oss-machine-registry', 'oss-machine-janome'),
        $version,
        true
    );
// functions.php 内の読み込み処理例
function oss_enqueue_scripts() {
    // 1. 基盤となる layout-renderer.js を先に読み込む
    wp_enqueue_script(
        'oss-layout-renderer',
        get_template_directory_uri() . '/resources/js/layout-renderer.js',
        array('jquery'),
        '1.0.0',
        true
    );

    // 2. janome.js は oss-layout-renderer に依存させる
    wp_enqueue_script(
        'oss-janome',
        get_template_directory_uri() . '/resources/js/janome.js',
        array('oss-layout-renderer'),
        '1.0.0',
        true
    );

    // 3. babylock.js も oss-layout-renderer に依存させる
    wp_enqueue_script(
        'oss-babylock',
        get_template_directory_uri() . '/resources/js/babylock.js',
        array('oss-layout-renderer'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'oss_enqueue_scripts');
});
