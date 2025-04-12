<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AlunoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'ID' => $this->id,
            'Nome' => $this->nome,
            'Nascimento' => $this->data_de_nascimento,
            'Telefone' => $this->telefone,
            'CEP' => $this->endereco_cep,
            'Matrícula' => $this->matricula ? [
                'ID' => $this->matricula->id,
                'Plano (Dias)' => $this->matricula->tipo_do_plano,
                'Status' => $this->matricula->status_da_matricula,
                'Matrícula' => $this->matricula->matricula_formatada,
                'Vencimento' => $this->matricula->vencimento_formatado,
            ] : 'Não há matrícula associada.',
        ];
    }
}
