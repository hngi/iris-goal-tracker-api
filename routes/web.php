<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/goals/create', 'GoalsController@create')->name('goals.create');

Route::post('goals/store', 'GoalsController@store')->name('goals.store');

Route::get('/redirect', 'SocialAuthFacebookController@redirect');

Route::get('/callback', 'SocialAuthFacebookController@callback');

Route::post('/login', 'UserController@login')->name('login');

Route::get('/login-page', 'UserController@loginPage')->name('user.login');
