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
        Schema::table('janji_temus', function (Blueprint $table) {
            $table->unsignedBigInteger('ustadz_id')->nullable()->after('keperluan');
            $table->foreign('ustadz_id')->references('id')->on('ustadzs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('janji_temus', function (Blueprint $table) {
            $table->dropForeign(['ustadz_id']);
            $table->dropColumn('ustadz_id');
        });
    }
};
