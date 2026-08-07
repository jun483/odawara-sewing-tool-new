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

            case 'apron':

                $result = [
                'success'=>true,
                'type'=>'apron',
                'title'=>'エプロン',

                'fabric_width'=>$fabricWidth,

                'cut_width'=>75,
                'cut_height'=>90,

                'fabric'=>2.0,
                'lining'=>0,

                'handle'=>0,
                'cord'=>0,

            ];

    break;

            case 'child_apron':

            $result = [
            'success'=>true,
            'type'=>'child_apron',
            'title'=>'子供用エプロン',

            'fabric_width'=>$fabricWidth,

            'cut_width'=>65,
            'cut_height'=>75,

            'fabric'=>1.5,
            'lining'=>0,

            ];

    break;

        case 'bandana':

            $result = [
            'success'=>true,
            'type'=>'bandana',
            'title'=>'三角巾',

            'fabric_width'=>$fabricWidth,

            'cut_width'=>60,
            'cut_height'=>60,

            'fabric'=>0.6,
            'lining'=>0,

            ];

    break;

            default:
                return [
                    'success' => false,
                    'message' => '作品を選択してください。'
                ];
        }
    }
}
