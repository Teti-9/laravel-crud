<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAlunoRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => 'required|string|max:255',
            'data_de_nascimento' => 'required|date_format:d/m/Y',
            'telefone' => [
                'required',
                'string',
                'regex:/^\(\d{2}\) \d{5}\-\d{4}$/'
            ],
            'endereco_cep' => [
                'required',
                'string',
                'regex:/^\d{5}\-\d{3}$/'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome é obrigatório.',
            'data_de_nascimento.date_format' => 'A data de nascimento deve estar no formato dd/mm/yyyy.',
            'telefone.regex' => 'O telefone deve estar no formato (XX) XXXXX-XXXX',
            'endereco_cep.regex' => 'O CEP deve estar no formato XXXXX-XXX',
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'nome' => ucwords(strtolower($this->nome)),
        ]);
    }
}
