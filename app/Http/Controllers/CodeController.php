<?php

namespace App\Http\Controllers;

use App\Services\CodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CodeController extends Controller
{
    public function __construct(private readonly CodeService $codeService)
    {
    }

    public function submitCode(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $executionId = $this->codeService->publishCode($data['code'], $data['input']);
        return new JsonResponse($executionId, Response::HTTP_CREATED);
    }

    public function getStatus(string $executionId): JsonResponse
    {
        $executionId = $this->codeService->getExecutionStatus($executionId);

        return new JsonResponse($executionId, Response::HTTP_OK);
    }
}
