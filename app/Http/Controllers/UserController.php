<?php

namespace App\Http\Controllers;


use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

    class UserController extends Controller
    {
    //     /**
    //  * Create a new AuthController instance.
    //  *
    //  * @return void
    //  */
    // public function __construct()
    // {
    //     $this->middleware('auth:api', ['except' => ['login']]);
    // }
        public function register(Request $request)
        {
                $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
            ]);

            if($validator->fails()){
                    return response()->json($validator->errors()->toJson(), 400);
            }

            $user = User::create([
                'name' => $request->get('name'),
                'email' => $request->get('email'),
                'password' => Hash::make($request->get('password')),
            ]);

            $token = JWTAuth::fromUser($user);

            return response()->json(["status"=>"success","token"=>$token,"user"=>$user],201);
        }

    public function index(){
        $users = UserResource::all();

        return $users;
    }

    public function login(Request $user)
    {
        $credentials = collect($user)->only(['email','password']);

        try {
            if ($token = JWTAuth::attempt($credentials->toArray())) {
                $user = auth()->user();
                return response()->json(["status"=>"success","token"=>$token,"user"=>$user]);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(['error' => 'invalid_credentials'], 400);

    }

    public function loginPage(){
        return view('login');
    }

    // public function login(Request $user){
    //     $credentials = collect($user)->only(['email','password']);
    //     // dd($data);
    //     if($user = auth()->attempt($credentials->toArray())){
    //         $user = auth()->user();
    //         return new UserResource($user);
    //     }

    //     return  false;

    // }


    
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
