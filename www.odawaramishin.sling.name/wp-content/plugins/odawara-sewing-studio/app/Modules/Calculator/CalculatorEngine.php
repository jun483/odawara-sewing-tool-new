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
                return (new ShoeBagCalculator())->calculate($data);

            case 'drawstring':
                return (new DrawstringCalculator())->calculate($data);

            case 'tote':
                return (new ToteBagCalculator())->calculate($data);

            case 'lunch_bag':
                return (new LunchBagCalculator())->calculate($data);

            case 'cup_bag':
                return (new CupBagCalculator())->calculate($data);

            case 'knapsack':
                return (new KnapsackCalculator())->calculate($data);

            default:
                return [
                    'success' => false,
                    'message' => '作品を選択してください。'
                ];
        }
    }
}