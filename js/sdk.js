//Some SDK methods are inspired by Jespers, located at https://github.com/Distribuerede-Systemer-2017/javascript-client/blob/exercise/js/sdk.js

//Establishing global variable to send statusCode to functions
var statusCode = 200;
const SDK = {
    serverURL: "http://localhost:8080/api",
    request: (options, cb) => {

        let headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach((h) => {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        //AJAX call med all nødvendige informationer
        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            headers: headers,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(data, status, xhr);
                statusCode = xhr.status;
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
                statusCode = xhr.status;
            }
        });

    },

    //All methods concerning items
    Item: {

        //Methods responsible for getting the items on the database (through the server).
        findAllItems: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/getItems",
                headers: {authorization: "Bearer" + SDK.Storage.load("token")}
            }, cb);
        },

        //Method responsible for adding items to your "basket" located on local storage
        addToBasket: (item) => {
            let basket = SDK.Storage.load("basket");

            if (!basket) {
                return SDK.Storage.persist("basket", [{
                    count: 1,
                    item: item
                }]);
            }

            let foundItem = basket.find(i => i.item.itemId === item.itemId);
            if (foundItem) {
                let i = basket.indexOf(foundItem);
                basket[i].count++;

            } else {
                basket.push({
                    count: 1,
                    item: item
                });
            }

            SDK.Storage.persist("basket", basket);
        },

    },

    //Contains all methods regarding the user
    User: {

        //Checks whether you are logged in by checking if a token is present.
        current: () => {
            return SDK.Storage.load("token");
        },


        //Method that creates a new user with the given username and password
        create: (username, password, cb) => {
            SDK.request({
                method: "POST",
                url: "/user/createUser",
                data: {
                    username: username,
                    password: password
                },
                headers: {authorization: "Bearer" + SDK.Storage.load("token")}
            }, (err) => {

                if (err) {
                    return cb(err);
                }

                cb(null);
            })

        },

        //Finds all orders with a specific user ID.
        findMyOrders: (cb) => {
            SDK.request({
                method: "GET",
                url: "/user/getOrdersById/" + SDK.Storage.load("userId"),
                headers: {
                    authorization: "Bearer " + SDK.Storage.load("token")
                }
            }, (err, data) => {

                if (err) {
                    return cb(err);
                }

                cb(null, data);

            })
        },


        //Method responsible for logging a user in and storing their personal data (token, id, name, personel)
        login: (username, password, cb) => {

            SDK.request({
                method: "POST",
                url: "/start/login",
                data: {
                    username: username,
                    password: password
                },
                headers: {authorization: SDK.Storage.load("token")}
            }, (data, err) => {

                //Add personal data to local storage
                SDK.Storage.persist("token", data.token);
                SDK.Storage.persist("userId", data.user_id);
                SDK.Storage.persist("username", data.username);
                SDK.Storage.persist("isPersonnel", data.isPersonel);

                cb(null);
            });
        },

        //Method that logs you out by removing all localstorage items.
        logout: () => {

            //Removes all data from local storage
            SDK.Storage.remove("token");
            SDK.Storage.remove("userId");
            SDK.Storage.remove("username");
            SDK.Storage.remove("isPersonnel");
            SDK.Storage.remove("basket");
            window.location.href = "login.html";
        },

        //Navigator bar that contains links the HTML sites
        loadNav: (cb) => {
            $("#nav-container").load("nav.html", () => {

                const currentUser = SDK.User.current();
                const isPersonnel = SDK.Storage.load("isPersonnel");

                //Checks if a user is personel (Staff)
                if (isPersonnel) {
                    $(".navbar-right").html(`
                         <li><a href="orders.html">All orders</a></li>
                         <li><a href="index.html" id="logout-link">Logout</a></li>
                    `);
                }

                //Checks if a user is logged in
                else if (currentUser) {
                    $(".navbar-right").html(`
                         <li><a href="myOrder.html">My orders</a></li>
                         <li><a href="index.html" id="logout-link">Logout</a></li>
                    `);
                }

                //If not logged in
                else {
                    $(".navbar-right").html(`
                        <li><a href="login.html">Login <span class="sr-only">(current)</span></a></li>
                `);
                }
                    $("#logout-link").click(() => SDK.User.logout());
            });
        }

    },

    //Contains methods regarding orders
    Order: {
        //Method that creates a new order containing a userId and an array of items.
        create: (user_Id, items, cb) => {
            SDK.request({
                method: "POST",
                url: "/user/createOrder",
                data:{
                    User_userId: user_Id,
                    items: items
                },
                headers: {authorization: "Bearer" + SDK.Storage.load("token")}
            }, (err) => {

                if (err) {
                    return cb(err);
                }

                //success
                cb(null);
            })
        },

    },

    //All methods that only staff (isPersonnel) has access to.
    Staff: {

        //Method that gets all orders from the database.
        findOrders: (cb) => {
            SDK.request({
                method: "GET",
                url: "/staff/getOrders"},

                cb);
        },

        //Method that changes the "isReady" property of a specific order (by ID) on the database.
        makeReady: (orderId, cb) => {
            SDK.request({
                    method: "POST",
                    url: "/staff/makeReady/" + orderId,
                    headers: {authorization: "Bearer" + SDK.Storage.load("token")
                    },
                    data: {
                        orderId : orderId
                    }
                }, (err) => {

            });
        }
    },

    //All methods concerning local storage
    Storage: {
        prefix: "Just-Pay-",

        //Method that adds a value (key) to local storage
        persist: (key, value) => {
            window.localStorage.setItem(SDK.Storage.prefix + key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },

        //Method that loads a value (key) from the local storage
        load: (key) => {
            const val = window.localStorage.getItem(SDK.Storage.prefix + key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },

        //Method that removes everything stored on local storage (logout)
        remove: (key) => {
            window.localStorage.removeItem(SDK.Storage.prefix + key);
        }
    }
};