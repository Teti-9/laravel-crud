<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAlunoRequest;
use App\Http\Controllers\Controller;
use App\Models\Aluno;

class AlunoController extends Controller
{

    public function index()
    {
        $alunos = Aluno::get();

        if ($alunos->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum aluno encontrado.'
            ], 404);
        }

        return response()->json($alunos->map(function ($aluno) {
            return [
                'ID' => $aluno->id,
                'Nome' => $aluno->nome,
                'Nascimento' => $aluno->data_de_nascimento,
                'Telefone' => $aluno->telefone,
                'CEP' => $aluno->endereco_cep,
                'Matrícula' => $aluno->matricula ? [
                    'ID' => $aluno->matricula->id,
                    'Plano (Dias)' => $aluno->matricula->tipo_do_plano,
                    'Status' => $aluno->matricula->status_da_matricula,
                    'Matrícula' => $aluno->matricula->matricula_formatada,
                    'Vencimento' => $aluno->matricula->vencimento_formatado,
                ] : 'Não há matrícula associada.',
            ];
        }));
    }

    public function store(StoreAlunoRequest $request)
    {
        try {

            Aluno::create($request->validated());

            return response()->json(['message' => 'Aluno cadastrado com sucesso.'], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erro ao criar aluno: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(string $id)
    {
        try {

            $aluno = Aluno::with('matricula')->findOrFail($id);

            return response()->json([
                'ID' => $aluno->id,
                'Nome' => $aluno->nome,
                'Nascimento' => $aluno->data_de_nascimento,
                'Telefone' => $aluno->telefone,
                'CEP' => $aluno->endereco_cep,
                'Matrícula' => $aluno->matricula ? [
                    'ID' => $aluno->matricula->id,
                    'Plano (Dias)' => $aluno->matricula->tipo_do_plano,
                    'Status' => $aluno->matricula->status_da_matricula,
                    'Matrícula' => $aluno->matricula->matricula_formatada,
                    'Vencimento' => $aluno->matricula->vencimento_formatado,
                ] : 'Não há matrícula associada.',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Aluno não encontrado.'
            ], 404);
        }
    }

    public function update(StoreAlunoRequest $request, string $id)
    {
        try {

            $aluno = Aluno::findOrFail($id);
            $aluno->update($request->validated());

            return response()->json(['message' => 'Aluno atualizado com sucesso.']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Aluno não encontrado.'
            ], 404);
        }
    }

    public function destroy(string $id)
    {
        try {

            $aluno = Aluno::findOrFail($id);
            $aluno->delete();

            return response()->json(['message' => 'Aluno deletado com sucesso.']);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Aluno não encontrado.'
            ], 404);
        }
    }
}
