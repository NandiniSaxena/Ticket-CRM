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
        Schema::table('users', function (Blueprint $table) {
            // Rename 'name' to 'first_name'
            if (Schema::hasColumn('users', 'name')) {
                $table->renameColumn('name', 'first_name');
            }

            // Add last_name column if it doesn't exist
            if (!Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name', 100)->nullable()->after('first_name');
            }

            // Modify email column length and add index if needed
            if (Schema::hasColumn('users', 'email')) {
                $table->string('email', 150)->nullable()->change();
                $table->index('email');
            } else {
                $table->string('email', 150)->nullable()->after('last_name')->index();
            }

            // Modify password column
            if (!Schema::hasColumn('users', 'password')) {
                $table->string('password', 255)->nullable()->after('email');
            }

            // Add role column with default 'User'
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role', 15)->default('User')->after('password');
            } else {
                $table->string('role', 15)->default('User')->change();
            }

            // Add department column
            if (!Schema::hasColumn('users', 'department')) {
                $table->string('department', 50)->nullable()->after('role');
            }

            // Modify created_at to default CURRENT_TIMESTAMP
            if (Schema::hasColumn('users', 'created_at')) {
                $table->timestamp('created_at')->useCurrent()->change();
            } else {
                $table->timestamp('created_at')->useCurrent()->after('department');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Optional: revert changes if needed
            // Drop added columns
            if (Schema::hasColumn('users', 'last_name')) $table->dropColumn('last_name');
            if (Schema::hasColumn('users', 'role')) $table->dropColumn('role');
            if (Schema::hasColumn('users', 'department')) $table->dropColumn('department');
        });
    }
};
