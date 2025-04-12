<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matriculas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aluno_id')->unique()->constrained('alunos')->onDelete('cascade');
            $table->dateTime('data_da_matricula')->default(now());
            $table->date('vencimento_da_matricula')->nullable();
            $table->integer('tipo_do_plano')->default(30);
            $table->string('status_da_matricula')->default('Inativo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matriculas');
    }
};
