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
        Schema::create('kegiatan_mendatang', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('deskripsi');
            $table->string('gambar')->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->time('waktu_mulai');
            $table->time('waktu_selesai')->nullable();
            $table->string('lokasi');
            $table->string('penanggung_jawab');
            $table->text('persyaratan')->nullable();
            $table->integer('kuota_peserta')->nullable();
            $table->decimal('biaya_pendaftaran', 10, 0)->default(0);
            $table->enum('status', ['draft', 'published', 'cancelled'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->json('kontak_info')->nullable(); // {phone, email, whatsapp}
            $table->text('catatan_tambahan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kegiatan_mendatang');
    }
};
