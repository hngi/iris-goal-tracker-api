# API for the Goal Tracker App developed by Team Iris
<!-- [![Build Status](https://travis-ci.org/timolinn/hng.tech.svg?branch=master)](https://travis-ci.org/timolinn/hng.tech) -->

<div align="center">

![Team Iris](https://res.cloudinary.com/dka33u9mx/image/upload/v1569325835/iris-logo_stgywb.png)

<br>

</div>

# Installation Guide

- You need a server, download [Wamp](http://www.wampserver.com/en/) or [Xampp](https://www.apachefriends.org/index.html)
- Clone this repository into `htdocs` of `www` folder in your respective servers. <br>
- **If you have not been added to the organization, kindly work in your forked repository and open a pull request here** <br>
- Fork the repository and push to your `staging branch`
- Merge to your `master` and compare forks with the original repository
- Open a Pull Request.
- **Read [this](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork) or watch [this](https://www.youtube.com/watch?v=G1I3HF4YWEw) for more help**

```bash
git clone https://github.com/hngi/iris-goal-tracker-api.git
```

```bash
cd iris-goal-tracker-api.
```

```bash
cp .env.example .env
```

```bash
php artisan key:generate
```

```bash
php artisan migrate
```

```bash
php artisan serve
```

```bash
Visit localhost:8000 in your browser
```

# How to Use Goal Tracker by Team Iris

```bash
Navigate to https://hng-iris-goal-tracker.herokuapp.com/
```

- Create an account providing your Fullname, Email and desired password.
<div align="center">

![Team Iris Sign Up Page](https://res.cloudinary.com/dka33u9mx/image/upload/v1569487701/sign_up_vlvsmm.png)

<br>

</div>

- A six digit pin would be sent to your email to complete the registration process.
<div align="center">

![Team Iris Login Page](https://res.cloudinary.com/dka33u9mx/image/upload/v1569487708/validate_u3fxqq.png)
<br>

</div>

- Once registration is complete, you can login to our app.
<div align="center">

![Team Iris Login Page](https://res.cloudinary.com/dka33u9mx/image/upload/v1569487712/login_ef1htr.png)

<br>

</div>

- You can edit your Name and Email.
<div align="center">

![Team Iris Edit Info](https://res.cloudinary.com/dka33u9mx/image/upload/v1569488450/editacct_zeejsf.png)
<br>

</div>

- You can Add goals and Descriptions.
<div align="center">

![Team Iris Add Goal](https://res.cloudinary.com/dka33u9mx/image/upload/v1569489099/addgoal_ydvcsg.png)
<br>

</div>

- You can View and see the Progress of your goal(s).
<div align="center">

![Team Iris Goal Progress](https://res.cloudinary.com/dka33u9mx/image/upload/v1569489296/at_a_glance_oteew3.png)
<br>

</div>

- You can Check Completed Todo(s).
<div align="center">

![Team Iris Add Goal](https://res.cloudinary.com/dka33u9mx/image/upload/v1569489099/todo_unmbqe.png)
<br>

</div>
