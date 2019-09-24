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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::get('/users', 'UserController@index');

Route::post('/register', 'UserController@register');

Route::post('/login', 'UserController@login');

Route::get('/user/{user}', 'UserController@getById');

Route::put('/user/{user}', 'TaskController@update');

Route::delete('/user/{user}', 'UserController@delete');