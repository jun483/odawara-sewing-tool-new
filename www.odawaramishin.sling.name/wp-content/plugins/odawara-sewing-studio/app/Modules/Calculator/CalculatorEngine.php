<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class CalculatorEngine
{
    /**
     * 作品ごとの計算
     */
    public function calculate(array $data): array
    {
        $type = $data['type'] ?? '';

        switch ($type) {

            case 'lesson_bag':
                return (new LessonBagCalculator())->calculate($data);

            case 'shoe_bag':
                return [
                    'success' => false,
                    'message' => 'シューズバッグは現在開発中です。'
                ];

            case 'drawstring':
                return [
                    'success' => false,
                    'message' => '巾着袋は現在開発中です。'
                ];

            case 'tote':
                return [
                    'success' => false,
                    'message' => 'トートバッグは現在開発中です。'
                ];

            case 'lunch_bag':
                return [
                    'success' => false,
                    'message' => 'お弁当袋は現在開発中です。'
                ];

            case 'cup_bag':
                return [
                    'success' => false,
                    'message' => 'コップ袋は現在開発中です。'
                ];

            case 'knapsack':
                return [
                    'success' => false,
                    'message' => 'ナップサックは現在開発中です。'
                ];

            default:
                return [
                    'success' => false,
                    'message' => '作品を選択してください。'
                ];
        }
    }
}