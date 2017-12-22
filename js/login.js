//Inspiration taken by Jesper at https://github.com/Distribuerede-Systemer-2017/javascript-client/blob/exercise/js/login.js
$(document).ready(() => {

    //Adds navigation bar with a menu to navigate through the site
    SDK.User.loadNav();

    //Clickhandler for the login button on the login.html site.
    $("#login-button").click(() => {

            const username = $("#inputUsername").val();
            const password = $("#inputPassword").val();

            //SDK method that attempts to authorize a login using the given username and password.
            SDK.User.login(username, password, (data, err) => {

                var code

                //Timeout function to give the server time to report a xhr.status code.
                setTimeout(function() {

                    code = statusCode;

                    //If the status code returned by the server is 401:
                if (code == 401) {
                    $(".form-group").addClass("has-error");
                    window.alert("Wrong input.");
                }
                    //if the status code returned by the server is 400:
                else if (code == 400) {
                    $(".form-group").addClass("has-error");
                    console.log("Wrong input.");
                }
                //Otherwise we asssume it is 200 (Token etc have already been stored in the SDK method).
                else {
                    window.location.href = "index.html";
                }

            }, 500);
        });
    });

    //Create user button that sends you to the createUser.html
    $("#create-user-button").click(() => {
        window.location.href = "createUser.html";
    });

});