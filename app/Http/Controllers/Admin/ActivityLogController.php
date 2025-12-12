<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $activities = [];

        $tickets = DB::table('tickets as t')
            ->leftJoin('users as creator', 't.requester_id', '=', 'creator.id')
            ->leftJoin('users as assignee', 't.assignee_id', '=', 'assignee.id')
            ->select([
                't.id as ticket_id',
                't.subject',
                't.status',
                't.priority',
                't.created_at',
                't.assigned_at',
                't.assignee_id',
                'creator.first_name as creator_fname',
                'creator.last_name as creator_lname',
                'assignee.first_name as assignee_fname',
                'assignee.last_name as assignee_lname',
            ])
            ->whereNull('t.deleted_at')
            ->orderByDesc('t.created_at')
            ->limit(50)
            ->get();

        foreach ($tickets as $row) {
            $creator = trim(($row->creator_fname ?? '') . ' ' . ($row->creator_lname ?? ''));
            $creator = $creator ?: 'Unknown User';

            $assignee = $row->assignee_id
                ? trim(($row->assignee_fname ?? '') . ' ' . ($row->assignee_lname ?? ''))
                : null;

            // Ticket Created
            $activities[] = [
                'icon' => 'bi-plus-circle-fill',
                'color' => 'bg-success',
                'text' => "<strong>{$creator}</strong> created ticket <strong>#{$row->ticket_id}</strong>: " . htmlspecialchars($row->subject),
                'time' => $row->created_at,
            ];

            // Ticket Assigned
            if ($row->assignee_id && $assignee) {
                $activities[] = [
                    'icon' => 'bi-person-check-fill',
                    'color' => 'bg-primary',
                    'text' => "Ticket <strong>#{$row->ticket_id}</strong> assigned to <strong>{$assignee}</strong>",
                    'time' => $row->assigned_at ?: $row->created_at,
                ];
            }

            // Status Changed (if not default)
            if ($row->status && $row->status !== 'open') {
                $activities[] = [
                    'icon' => 'bi-tag-fill',
                    'color' => 'bg-info',
                    'text' => "Ticket <strong>#{$row->ticket_id}</strong> marked as <strong>" . ucfirst($row->status) . "</strong>",
                    'time' => $row->assigned_at ?: $row->created_at,
                ];
            }
        }

        // Sort by time (newest first)
        usort($activities, fn($a, $b) => strtotime($b['time']) <=> strtotime($a['time']));

        return Inertia::render('Admin/ActivityLog', [
            'activities' => $activities,
        ]);
    }
}
