<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('nama_donatur');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->date('tanggal');
            $table->enum('kategori', ['Infaq', 'Sedekah', 'Zakat']);
            $table->string('program');
            $table->decimal('jumlah', 15, 2);
            $table->enum('metode', ['Tunai', 'Transfer Bank', 'E-Wallet', 'Kartu Kredit']);
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->boolean('anonim')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
