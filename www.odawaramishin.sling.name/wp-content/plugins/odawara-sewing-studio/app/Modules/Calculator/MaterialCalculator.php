<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class MaterialCalculator
{
    /**
     * 作品ごとの付属材料を計算
     */
    public static function calculate(array $result): array
    {
        $type = $result['type'] ?? '';
        $quantity = max(1, (int)($result['quantity'] ?? 1));

        switch ($type) {

            case 'lesson_bag':

                $result['handle'] = 70 * $quantity;
                $result['cord'] = 0;
                $result['d_ring'] = 0;

                break;


            case 'shoe_bag':

                $result['handle'] = 70 * $quantity;
                $result['cord'] = 0;
                $result['d_ring'] = 2 * $quantity;

                break;


            case 'drawstring':

                $result['handle'] = 0;
                $result['cord'] = 160 * $quantity;
                $result['d_ring'] = 0;

                break;


            case 'lunch_bag':

                $result['handle'] = 0;
                $result['cord'] = 120 * $quantity;
                $result['d_ring'] = 0;

                break;


            case 'cup_bag':

                $result['handle'] = 0;
                $result['cord'] = 100 * $quantity;
                $result['d_ring'] = 0;

                break;


            case 'knapsack':

                $result['handle'] = 0;
                $result['cord'] = 300 * $quantity;
                $result['d_ring'] = 2 * $quantity;

                break;


            case 'tote':

                $result['handle'] = 120 * $quantity;
                $result['cord'] = 0;
                $result['d_ring'] = 0;

                break;


            case 'apron':

                $result['handle'] = 0;
                $result['cord'] = 0;
                $result['d_ring'] = 0;

                break;


            case 'child_apron':

                $result['handle'] = 0;
                $result['cord'] = 0;
                $result['d_ring'] = 0;

                break;


            case 'bandana':

                $result['handle'] = 0;
                $result['cord'] = 0;
                $result['d_ring'] = 0;

                break;


            default:

                $result['handle'] = 0;
                $result['cord'] = 0;
                $result['d_ring'] = 0;

                break;
        }

        return $result;
    }
}