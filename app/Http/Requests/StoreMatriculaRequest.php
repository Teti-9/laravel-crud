<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\Planos;

class StoreMatriculaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'aluno_id' => 'required|exists:alunos,id',
            'tipo_do_plano' => 'required|integer|in:' . implode(
                ',',
                array_column(
                    Planos::cases(),
                    'value'
                )
            )
        ];
    }

    public function messages(): array
    {
        return [
            'aluno_id.required' => 'O campo aluno_id é obrigatório.',
            'tipo_do_plano.in' => 'O plano deve ser um dos seguintes: 30, 90, 180 ou 365 dias.',
        ];
    }
}
