$(document).ready(() => {

    //adds a navigation bar with a menu to navigate through the site
    SDK.User.loadNav();

    //A clickhandler for the "create user" button from createUser.html
    $("#create-user").click(() => {

        const username = $("#inputDesiredUsername").val();
        const password = $("#inputDesiredPassword").val();

        //SDK method that send the username and password to the server and attempts to create it
        SDK.User.create(username, password, (data, err) => {

            let newuser = data;

            //If userCreated was false (not created), the program displays the message "user was not created".
            if (newuser.userCreated === "false"){
                window.alert("User was not created!");
            }

            //if userCreated wasn't false, it has to be true. therefore:
            else{
                window.alert("User created successfully!")
                window.location.href = "login.html";
            }
        });

    });

});