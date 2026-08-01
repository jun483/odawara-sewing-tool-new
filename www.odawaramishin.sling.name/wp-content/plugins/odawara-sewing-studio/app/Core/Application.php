<?php

namespace OSS\Core;

if (!defined('ABSPATH')) {
    exit;
}

final class Application
{
    /**
     * インスタンス
     */
    private static ?Application $instance = null;

    /**
     * 起動
     */
    public static function boot(): Application
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * コンストラクタ
     */
    private function __construct()
    {
        add_action('init', [$this, 'init']);
    }

    /**
     * 初期化
     */
    public function init(): void
    {
        $this->registerCore();
    }

    /**
     * Coreクラス登録
     */
    private function registerCore(): void
    {
        new AssetManager();
        new Shortcode();
        new Ajax();
    }
}