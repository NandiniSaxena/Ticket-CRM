<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\TicketController;
use App\Http\Controllers\Auth\UnassignedController;
use App\Http\Controllers\Admin\AdminTicketController;
use App\Http\Controllers\Admin\AssignTicketController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\AssigneeController;
use App\Http\Controllers\Assignee\DashboardController;
use App\Http\Controllers\Assignee\MyTicketsController;
use App\Http\Controllers\Assignee\InProgressController;
use App\Http\Controllers\Assignee\PendingController;
use App\Http\Controllers\Assignee\OnHoldController;
use App\Http\Controllers\Assignee\CompletedController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/register', [RegisterController::class, 'show'])->name('register');
Route::post('/register', [RegisterController::class, 'store']);

Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth');

Route::get('/dashboard', [App\Http\Controllers\Auth\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/admin/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'adminDashboard'])
    ->middleware('auth')
    ->name('admin.dashboard');


Route::middleware(['auth', 'role:Assignee'])->prefix('assignee')->group(function () {
    Route::get('/dashboard', [AssigneeController::class, 'dashboard']);
});


Route::middleware(['auth'])->group(function () {
    Route::get('/create', [TicketController::class, 'create'])->name('tickets.create'); // renders Inertia page
    Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');  // handles store
});


Route::middleware('auth')->group(function () {
    Route::get('/alltickets', [TicketController::class, 'allTickets'])->name('tickets.all');

    // Use PATCH for update, DELETE for delete
    Route::patch('/ticket/update/{id}', [TicketController::class, 'update'])->name('ticket.update');
    Route::delete('/ticket/delete/{id}', [TicketController::class, 'delete'])->name('ticket.delete');
});

Route::middleware('auth')->group(function () {
    Route::get('/unassigned', [UnassignedController::class, 'index'])->name('unassigned');
});

Route::get('/pending', [\App\Http\Controllers\Auth\TicketController::class, 'pending'])
    ->middleware(['auth'])
    ->name('pending');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});


Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/all-tickets', [AdminTicketController::class, 'index'])->name('admin.tickets.index');
    Route::post('/tickets', [AdminTicketController::class, 'store'])->name('admin.tickets.store');
    Route::patch('/tickets/{id}', [AdminTicketController::class, 'update'])->name('admin.tickets.update');
    Route::post('/tickets/{id}/unassign', [AdminTicketController::class, 'unassign'])->name('admin.tickets.unassign');
    Route::delete('/tickets/{id}', [AdminTicketController::class, 'delete'])->name('admin.tickets.delete');
});


Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/assign-tickets', [AssignTicketController::class, 'index'])->name('admin.assign');
    Route::post('/tickets/assign', [AssignTicketController::class, 'assign'])->name('admin.tickets.assign');
});

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::patch('/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::post('/users/{id}/password', [UserController::class, 'password'])->name('admin.users.password');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
});


Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/admins', [AdminController::class, 'manage'])->name('admin.admins');
    Route::post('/admins', [AdminController::class, 'store'])->name('admin.admins.store');
    Route::patch('/admins/{id}', [AdminController::class, 'update'])->name('admin.admins.update');
    Route::post('/admins/{id}/password', [AdminController::class, 'password'])->name('admin.admins.password');
    Route::post('/admins/{id}/promote', [AdminController::class, 'promote'])->name('admin.admins.promote');
    Route::post('/admins/{id}/demote', [AdminController::class, 'demote'])->name('admin.admins.demote');
    Route::delete('/admins/{id}', [AdminController::class, 'destroy'])->name('admin.admins.destroy');
});

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/activity-log', [ActivityLogController::class, 'index'])->name('admin.activity-log');
});


Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/profile', [AdminProfileController::class, 'index'])->name('admin.profile');
    Route::post('/profile', [AdminProfileController::class, 'update'])->name('admin.profile.update');
});


Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/assignees', [AssigneeController::class, 'index'])->name('admin.assignees');
    Route::post('/assignees', [AssigneeController::class, 'store'])->name('admin.assignees.store');
    Route::post('/assignees/{id}/remove', [AssigneeController::class, 'remove'])->name('admin.assignees.remove');
});

Route::prefix('assignee')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('assignee.dashboard');
    Route::post('/tickets/{ticket}/status', [DashboardController::class, 'updateStatus'])
         ->name('assignee.tickets.updateStatus');
})->middleware('auth');


Route::prefix('assignee')->middleware('auth')->group(function () {
    Route::get('/my-tickets', [MyTicketsController::class, 'index'])->name('assignee.my-tickets');
});

Route::get('/assignee/inprogress', [InProgressController::class, 'index'])
     ->name('assignee.inprogress');

Route::get('/assignee/pending', [PendingController::class, 'index'])
     ->name('assignee.pending');

Route::get('/assignee/onhold', [OnHoldController::class, 'index'])
     ->name('assignee.onhold');

Route::get('/assignee/completed', [CompletedController::class, 'index'])
     ->name('assignee.completed');
