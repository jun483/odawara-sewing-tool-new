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