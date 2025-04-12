<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Matricula;
use App\Http\Requests\StoreMatriculaRequest;

class MatriculaController extends Controller
{

    public function index()
    {
        $matriculas = Matricula::get();

        if ($matriculas->isEmpty()) {
            return response()->json([
                'message' => 'Nenhuma matrícula encontrada.'
            ], 404);
        }

        return response()->json($matriculas->map(function ($matricula) {
            return [
                'ID Da Matrícula' => $matricula->id,
                'Aluno' => ['ID' => $matricula->aluno->id, 'Nome' => $matricula->aluno->nome],
                'Plano (Dias)' => $matricula->tipo_do_plano,
                'Status' => $matricula->status_da_matricula,
                'Matrícula' => $matricula->matricula_formatada,
                'Vencimento' => $matricula->vencimento_formatado,
            ];
        }));
    }

    public function store(StoreMatriculaRequest $request)
    {

        try {
            Matricula::create([
                'aluno_id' => $request->validated()['aluno_id'],
                'tipo_do_plano' => $request->validated()['tipo_do_plano'],
                'status_da_matricula' => 'Ativo',
                'vencimento_da_matricula' => now()->addDays($request->validated()['tipo_do_plano']),
            ]);
            return response()->json(['message' => 'Matrícula realizada com sucesso.'], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Já existe uma matrícula ativa para este aluno.'
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {

            $matricula = Matricula::findOrFail($id);

            return response()->json([
                'ID Da Matrícula' => $matricula->id,
                'Aluno' => ['ID' => $matricula->aluno->id, 'Nome' => $matricula->aluno->nome],
                'Plano (Dias)' => $matricula->tipo_do_plano,
                'Status' => $matricula->status_da_matricula,
                'Matrícula' => $matricula->matricula_formatada,
                'Vencimento' => $matricula->vencimento_formatado,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Matrícula não encontrada.'
            ], 404);
        }
    }

    public function update(StoreMatriculaRequest $request, string $id)
    {
        try {

            $matricula = Matricula::where('id', $id)
                ->where('aluno_id', $request->validated()['aluno_id'])
                ->firstOrFail();

            $matricula->update([
                'tipo_do_plano' => $request->validated()['tipo_do_plano'],
                'vencimento_da_matricula' => now()->addDays($request->validated()['tipo_do_plano'])
            ]);

            return response()->json(['message' => 'Matrícula atualizada com sucesso.']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Matrícula não encontrada.'
            ], 404);
        }
    }

    public function destroy(string $id)
    {
        try {

            $matricula = Matricula::findOrFail($id);
            $matricula->delete();

            return response()->json(['message' => 'Matrícula deletada com sucesso.']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Matrícula não encontrada.'
            ], 404);
        }
    }
}
