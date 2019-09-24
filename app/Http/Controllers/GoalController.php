<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Goal;
use App\Repositories\GoalRepository;

class GoalController extends Controller

{
    /**
     * The task repository instance.
     *
     * @var GoalRepository
     */
    protected $goals;

    /**
     * Create a new controller instance.
     *
     * @param  GoalsRepository  $goals
     * @return void
     */
    public function __construct(TaskRepository $tasks)
    {
        $this->middleware('auth');

        $this->goals = $goals;
    }

    /**
     * Display a list of all of the user's task.
     *
     * @param  Request  $request
     * @return Response
     */
    public function index(Request $request)
    {
        return view('goals.index', [
            'goals' => $this->goals->forUser($request->user()),
        ]);
    }

    /**
     * Create a new task.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|max:255',
        ]);

        $request->user()->tasks()->create([
            'name' => $request->name,
        ]);

        return redirect('/goals');
    }

    /**
     * Destroy the given task.
     *
     * @param  Request  $request
     * @param  Goal  $goal
     * @return Response
     */
    public function destroy(Request $request, Goal $goal)
    {
        $this->authorize('destroy', $goal);

        $goal->delete();

        return redirect('/goal');
    }
}
