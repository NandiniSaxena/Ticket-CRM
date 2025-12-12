<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@gmail.com')->first();
        $support = User::where('email', 'assignee@gmail.com')->first();

        if ($admin && $support) {
            $tickets = [
                [
                    'requester_id' => $admin->id,
                    'assignee_id' => $support->id,
                    'subject' => 'Urgent: Production API deployment failure',
                    'description' => 'The nightly deployment failed, and the API is returning 500 errors. Needs immediate attention.',
                    'priority' => 'high',
                    'team' => 'DevOps',
                    'status' => 'inprogress',
                    'created_at' => now()->subHours(2)->toDateTimeString(),
                    'updated_at' => now()->subHours(1)->toDateTimeString(),
                    'assigned_at' => now()->subHours(1)->toDateTimeString(),
                    'assigned_to' => $support->first_name . ' ' . $support->last_name,
                ],
                [
                    'requester_id' => $admin->id,
                    'assignee_id' => null,
                    'subject' => 'Request for new cloud IDE licenses',
                    'description' => 'Need 5 new licenses for the development team starting next sprint. Awaiting approval.',
                    'priority' => 'medium',
                    'team' => 'IT Procurement',
                    'status' => 'pending',
                    'created_at' => now()->subDays(1)->toDateTimeString(),
                    'updated_at' => now()->toDateTimeString(),
                    'assigned_at' => null,
                    'assigned_to' => '',
                ],
                [
                    'requester_id' => $admin->id,
                    'assignee_id' => $support->id,
                    'subject' => 'VPN setup for remote access completed',
                    'description' => 'Successfully completed the setup of VPN access for all new remote employees.',
                    'priority' => 'low',
                    'team' => 'IT Support',
                    'status' => 'completed',
                    'created_at' => now()->subDays(7)->toDateTimeString(),
                    'updated_at' => now()->subDays(5)->toDateTimeString(),
                    'assigned_at' => now()->subDays(6)->toDateTimeString(),
                    'assigned_to' => $support->first_name . ' ' . $support->last_name,
                ],
            ];

            DB::table('tickets')->insert($tickets);
        }
    }
}
