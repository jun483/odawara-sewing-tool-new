<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class MaterialCalculator
{
    public static function calculate(array $result): array
    {
        $type = $result['type'] ?? '';

        switch ($type) {

            case 'lesson_bag':
                $result['handle'] = 70 * ($result['quantity'] ?? 1);
                $result['cord'] = 0;
                $result['d_ring'] = 0;
            break;

            case 'shoe_bag':
                $result['handle'] = 70 * ($result['quantity'] ?? 1);
                $result['cord'] = 0;
                $result['d_ring'] = 2 *    ($result['quantity'] ?? 1);
            break;

            case 'drawstring':
                $result['handle'] = 0;
                $result['cord'] = 160;
                $result['d_ring'] = 0;
            break;

            case 'lunch_bag':
                $result['handle'] = 0;
                $result['cord'] = 120;
                $result['d_ring'] = 0;
            break;

            case 'cup_bag':
                $result['handle'] = 0;
                $result['cord'] = 100;
                $result['d_ring'] = 0;
            break;

            case 'knapsack':
                $result['handle'] = 0;
                $result['cord'] = 300;
                $result['d_ring'] = 2;
            break;

            case 'apron':

                $result['handle']=0;
                $result['cord']=0;
                $result['d_ring']=0;

            break;


case 'child_apron':

    $result['handle']=0;
    $result['cord']=0;
    $result['d_ring']=0;

break;


case 'bandana':

    $result['handle']=0;
    $result['cord']=0;
    $result['d_ring']=0;

break;

            default:
                $result['handle'] = 0;
                $result['cord'] = 0;
                $result['d_ring'] = 0;
        }

        return $result;
    }
}