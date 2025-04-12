<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MatriculaResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'ID Da Matrícula' => $this->id,
            'Aluno' => ['ID' => $this->aluno->id, 'Nome' => $this->aluno->nome],
            'Plano (Dias)' => $this->tipo_do_plano,
            'Status' => $this->status_da_matricula,
            'Matrícula' => $this->matricula_formatada,
            'Vencimento' => $this->vencimento_formatado,
        ];
    }
}
