<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="../resources/css/main.css">
    <title>Team Iris- To do list</title>
</head>

<body>

    <div class="nav-bar">
        <img src="logo.png" />
        <button href="#" class="btn-signup">Sign Up</button>
        <button href="login.html" class="btn-signin">Sign In</button>
    </div>

    <main class="container">
        <section class="welcomeContainer">
            <p><strong>Stay focused,</strong> go after</p>
            <p>your dreams and<strong> keep</p>
            <p>moving</strong> toward your</p>
            <p><strong> goals.</strong></p>
            <h3 class="subtitle">ABC is a powerful and flexible tool that boost your</h3>
            <h3> poductivity and organizes your life - in just a few </h3>
            <h3>steps.</h3>
            <br> <br>
            <button href="#" class="btn-start">Get Started - It's free!</button>
            </p>
        </section>


        <section class="signupContainer">
            <h2>Sign Up</h1>
                <form action="homepage.html" method="post">
                    <label for="fullname"></label>
                    <input type="text" id="fullname" name="name" placeholder="Full Name*" minlength="4" required>
                    <br><br>
                    <label for="email"></label>
                    <input type="email" id="email" name="emailaddress" placeholder="E-mail Address*" required>
                    <br><br>
                    <label for="password"></label>
                    <input type="password" id="password" name="password" placeholder="Password*" minlength="8" maxlength="14" required>
                    <br><br><br>
                    <input class="button" type="submit" value="SIGN UP">
                </form>
        </section>
    </main>

</body>

</html>