<?php

use App\Http\Controllers\AlunoController;
use App\Http\Controllers\MatriculaController;
use Illuminate\Support\Facades\Route;

Route::apiResource('/alunos', AlunoController::class);
Route::apiResource('/matriculas', MatriculaController::class);
