<?php

namespace App\Http\Controllers;


use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index(){
        $users = UserResource::all();

        return $users;
    }

    public function register(Request $request){

        Validator::make($request->all(), [
			'name'  		=> 'required|string', 'max:255',
			'email' 	 		=> 'required|string|email|max:255|unique:users',
			'password' 	 		=> 'required|string|min:8|confirmed',

        ])->validate();
        
        $user = $request->only([
		 'name', 'password', 'email',
        ]);

        $user['password'] = bcrypt($user['password']);

        User::create($user);

        return new UserResource($user);
    }

    public function login(array $user){
        $credentials = collect($user)->only(['email','password']);
        // dd($data);
        if($user = auth()->attempt($credentials->toArray())){
            $user = auth()->user();
            return new UserResource($user);
        }

        return  false;

    }


    
    public function getById($id){

        $user = $this->user->findorfail($id);

        return new UserResource($user);
    }
      
      
    public function updateUser(Request $request, $id){
        Validator::make($request->all(), [
            'first_name' 		=> 'required|string|max:255',
            'last_name'  		=> 'required|string', 'max:255',
            'outlet_id'  		=>  'required',
            'phone'   			=> 'required|max:15',
            'role'     			=> 'required',
            'email' 	 		=> 'required|string|email|max:255|unique:users',
            'password' 	 		=> 'required|string|min:8|confirmed',
        ]);

        $user = User::findorfail($id);
		$user->name   = $request->name;
		$user->email  = $request->email;

		if (trim(Input::get('password')) != '') {
			$user->password = Hash::make(trim(Input::get('password')));
		}

        $user->save();
        
        if($user){
            return new UserResource($user);
        }
    }

    public function delete($id){

        return  User::find($id)->delete();
          
    }
}
