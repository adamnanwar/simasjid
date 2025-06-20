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
        Schema::table('ustadzs', function (Blueprint $table) {
            // Add new structured schedule fields
            $table->json('schedule_days')->after('schedule'); // Array of days: ['Senin', 'Selasa', ...]
            $table->time('schedule_start_time')->after('schedule_days'); // Start time: 08:00
            $table->time('schedule_end_time')->after('schedule_start_time'); // End time: 17:00
            
            // Keep the old schedule field for backward compatibility (will be removed later)
            $table->text('schedule')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ustadzs', function (Blueprint $table) {
            $table->dropColumn(['schedule_days', 'schedule_start_time', 'schedule_end_time']);
            $table->text('schedule')->nullable(false)->change();
        });
    }
};
