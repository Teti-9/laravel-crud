<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Matricula extends Model
{

    use HasFactory;

    protected $fillable = [
        'aluno_id',
        'tipo_do_plano',
        'data_da_matricula',
        'vencimento_da_matricula',
        'status_da_matricula',
    ];

    public function aluno()
    {
        return $this->belongsTo(Aluno::class);
    }

    public function getMatriculaFormatadaAttribute()
    {
        return \Carbon\Carbon::parse($this->data_da_matricula)->format('d/m/Y H:i');
    }

    public function getVencimentoFormatadoAttribute()
    {
        return \Carbon\Carbon::parse($this->vencimento_da_matricula)->format('d/m/Y H:i');
    }
}
