<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Aluno extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'data_de_nascimento',
        'telefone',
        'endereco_cep',
    ];

    public function matricula() {
        return $this->hasOne(Matricula::class);
    }
    
}
