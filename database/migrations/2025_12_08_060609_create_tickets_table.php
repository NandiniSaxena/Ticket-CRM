<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {

            $table->increments('id'); // int AUTO_INCREMENT

            $table->string('subject', 255);
            $table->text('description');

            $table->enum('priority', ['low', 'medium', 'high'])
                ->default('medium')
                ->nullable();

            $table->string('team', 50)
                ->nullable()
                ->default('Support');

            $table->enum('status', ['pending', 'inprogress', 'completed', 'onhold'])
                ->default('inprogress');

            $table->integer('requester_id')->nullable();
            $table->integer('assignee_id')->nullable();

            $table->dateTime('created_at')->useCurrent(); // DEFAULT CURRENT_TIMESTAMP
            $table->dateTime('assigned_at')->nullable();

            $table->dateTime('deleted_at')->nullable();

            $table->string('assigned_to', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
