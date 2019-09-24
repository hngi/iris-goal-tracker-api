<?php

namespace App;

use App\Goal;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];

    /**
     * Get the goal that owns the todo.
     */
    public function goal()
    {
        return $this->belongsTo(Goal::class);
    }
}
