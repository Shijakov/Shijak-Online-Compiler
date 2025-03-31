<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class CodeService
{
    public function publishCode($code, $input): string
    {
        $executionId = Str::uuid();

        $problemToSend = [
            'id' => $executionId,
            'code' => $code,
            'input' => $input,
        ];

        Redis::publish(env('REDIS_CHANNEL'), json_encode($problemToSend));

        Redis::set($executionId, json_encode(['status' => "waiting"]));

        return $executionId;
    }

    public function getExecutionStatus(string $executionId)
    {
        return Redis::get($executionId);
    }
}
