<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/users', 'UserController@index')->name('users.all');

Route::post('/user/register', 'UserController@register')->name('users.register');

Route::post('/user/login', 'UserController@login')->name('users.login');

Route::get('/user/{user}', 'UserController@getById')->name('tasks.getId');

Route::put('/user/{user}', 'TaskController@update')->name('user.update');

Route::delete('/user/{user}', 'UserController@delete')->name('user.delete');