<?php

namespace OSS\Modules\Calculator;

if (!defined('ABSPATH')) {
    exit;
}

class CalculatorEngine
{
    /**
     * 生地種類の表示名マッピング
     */
    private const FABRIC_TYPES = [
        'oxford'   => 'オックス',
        'sheeting' => 'シーチング・ブロード',
        'quilt'    => 'キルティング',
        'canvas'   => 'キャンバス・帆布',
    ];

    /**
     * 作品ごとの計算
     */
    public function calculate(array $data): array
    {
        $type = $data['type'] ?? '';

        // リクエストデータから数値・値を取り出す
        $fabricWidth = isset($data['fabric_width']) ? (int)$data['fabric_width'] : 110;
        $rawFabricType = $data['fabric_type'] ?? '';
        $fabricTypeName = self::FABRIC_TYPES[$rawFabricType] ?? $rawFabricType;

        $result = [];

        switch ($type) {

            case 'lesson_bag':
                $result = (new LessonBagCalculator())->calculate($data);
                break;

            case 'shoe_bag':
                $result = (new ShoeBagCalculator())->calculate($data);
                break;

            case 'drawstring':
                $result = (new DrawstringCalculator())->calculate($data);
                break;

            case 'tote':
                $result = (new ToteBagCalculator())->calculate($data);
                break;

            case 'lunch_bag':
                $result = (new LunchBagCalculator())->calculate($data);
                break;

            case 'cup_bag':
                $result = (new CupBagCalculator())->calculate($data);
                break;

            case 'knapsack':
                $result = (new KnapsackCalculator())->calculate($data);
                break;

            case 'apron':
    $result = (new ApronCalculator())->calculate($data);
    break;

case 'child_apron':
    $result = (new ChildApronCalculator())->calculate($data);
    break;

case 'bandana':
    $result = (new BandanaCalculator())->calculate($data);
    break;

            default:
                return [
                    'success' => false,
                    'message' => '作品を選択してください。'
                ];
        }

        // 生地種類を結果データへセット
        $result['fabric_type'] = $fabricTypeName;

        return ResultBuilder::build($result);
    }
}