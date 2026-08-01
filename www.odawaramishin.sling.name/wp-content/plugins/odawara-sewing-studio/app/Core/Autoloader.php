<?php

namespace OSS\Core;

if (!defined('ABSPATH')) {
    exit;
}

final class Autoloader
{
    /**
     * 名前空間
     */
    private const PREFIX = 'OSS\\';

    /**
     * ベースディレクトリ
     */
    private static string $baseDir;

    /**
     * オートローダー登録
     */
    public static function register(): void
    {
        self::$baseDir = dirname(__DIR__) . DIRECTORY_SEPARATOR;

        spl_autoload_register([self::class, 'autoload']);
    }

    /**
     * クラス自動読込
     */
    private static function autoload(string $class): void
    {
        if (strpos($class, self::PREFIX) !== 0) {
            return;
        }

        $relativeClass = substr($class, strlen(self::PREFIX));

        $file = self::$baseDir .
            str_replace('\\', DIRECTORY_SEPARATOR, $relativeClass) .
            '.php';

        if (file_exists($file)) {
            require_once $file;
        }
    }
}