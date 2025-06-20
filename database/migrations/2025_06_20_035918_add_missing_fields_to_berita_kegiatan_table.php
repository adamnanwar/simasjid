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
        Schema::table('berita_kegiatan', function (Blueprint $table) {
            $table->text('ringkasan')->nullable()->after('konten');
            $table->string('kategori')->default('Pengumuman')->after('ringkasan');
            $table->enum('status', ['draft', 'published'])->default('published')->after('kategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('berita_kegiatan', function (Blueprint $table) {
            $table->dropColumn(['ringkasan', 'kategori', 'status']);
        });
    }
};
