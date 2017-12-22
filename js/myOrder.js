$(document).ready(() => {

    //Adds a navigator bar to the top of the page that contains a menu to navigate through the site
    SDK.User.loadNav();

    //method that gets all orders marked with the current users ID
    SDK.User.findMyOrders((orders, err) => {

        //Foreach loop that runs through all the orders and adds them to the tabel.
        orders.forEach((order) => {

                let id = order.orderId;
                let isReady = order.isReady;
                let time = order.orderTime;
                let $items = [];
                let $orderPrice = 0;
                let icon;
                let bg;

                    //Foreach loop that runs through an orders items and adds them to the array
                    order.items.forEach((item) => {

                        //If the array isnt empty, add a ", " first to seperate the names
                        if ($items.length >= 1) {
                            $items += ", " + item.itemName;
                        }

                        //If the array is empty, add the name only
                        else {
                            $items += item.itemName;
                        }

                        //If an order is marked as "ready", add a checkmark and make the row green
                        if (isReady) {
                            icon = `&#x2705`;
                            bg = `#ccffcc`;
                         }

                         //If it isnt marked as "ready", add a cross to the row.
                        else {
                            icon = `&#x274C`;
                        }

                        //Appends the orders values to the HTMl page through the Tbody to be displayed in the html page.
                        $("#orderUserList").append(
                            "<tr style='background-color:" + bg + "'>" +
                            "<td>" + id + "</td>" +
                            "<td>" + time + "</td>" +
                            "<td>" + $items + "</td>" +
                            "<td>" + icon + "</td>" +
                            "</tr>");

                });
        });
    });
});