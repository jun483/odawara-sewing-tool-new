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
                $result = (new LessonBagCalculator())->calculate($data);
                return ResultBuilder::build($result);

            case 'shoe_bag':
                $result = (new ShoeBagCalculator())->calculate($data);
                return ResultBuilder::build($result);

            case 'drawstring':
                $result = (new DrawstringCalculator())->calculate($data);
                return ResultBuilder::build($result);

            case 'tote':
                $result = (new ToteBagCalculator())->calculate($data);
                return ResultBuilder::build($result);

            case 'lunch_bag':
                $result = (new LunchBagCalculator())->calculate($data);
                return ResultBuilder::build($result);

            case 'cup_bag':
                $result = (new CupBagCalculator())->calculate($data);
                return ResultBuilder::build($result);

            case 'knapsack':
                $result = (new KnapsackCalculator())->calculate($data);
                return ResultBuilder::build($result);

            default:
                return [
                    'success' => false,
                    'message' => '作品を選択してください。'
                ];
        }
    }
}
