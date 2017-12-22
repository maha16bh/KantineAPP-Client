$(document).ready(() => {

    //Adds a navigation bar with a menu that lets you navigate through the site.
    SDK.User.loadNav();

    //Gets all orders from the database.
    SDK.Staff.findOrders((data, err) => {

        let allOrders = data;

            //forEach loop that runs through all the orders and adds them to the html table.
            allOrders.forEach((order) => {

                    let id = order.orderId
                    let userId = order.User_userId;
                    let time = order.orderTime;
                    let $items = [];
                    let $isReady = 0;

                    //forEach loop that runs through all the items in an order and adds them to an array.
                    order.items.forEach((item) => {

                        //If the array isnt empty, add a ", " first to seperate the names
                    if ($items.length >= 1) {
                        $items += ", " + item.itemName;
                    }

                    //If the array is empty, add the name only
                    else {
                        $items += item.itemName;
                    }

                     });

                //if the order is marked as ready, don't add it to the table.
                if (order.isReady) {

                }

                //if it isnt marked as ready, add it and give it the option to be marked as ready (button).
                else {

                $("#allOrders").append(
                    "<tr id=" + id + ">" +
                    "<td>" + id + "</td>" +
                    "<td>" + userId + "</td>" +
                    "<td>" + time + "</td>" +
                    "<td>" + $items + "</td>" +
                    "<td> <button data-toggle=modal class=\"btn btn-success btn-lg\" id='makeReady'>Make ready</td>" +
                    "</tr>");
                }
            });


                 $("#allOrders").delegate("tr", "click", function(clickedItem) {

                     //finds the row that was clicked's "id".
                    let chosenOrder = $(clickedItem.currentTarget).attr('id');

                    //sends an order through the SDK method to set it as "ready"
                    SDK.Staff.makeReady(chosenOrder);

                    window.alert("Order is ready for purchase");

                 });
    });

});






