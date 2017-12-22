//Inspiration has been drawn by Jespers checkouts.js, located at https://github.com/Distribuerede-Systemer-2017/javascript-client/blob/exercise/js/checkout.js

$(document).ready(() => {

    //Loads the navigation to the top of the page
    SDK.User.loadNav();

    const $modalTbody = $("#basket-tbody");
    const $modalTbody2 = $("#basket-tbody2");
    const $checkoutActions = $("#checkout-actions");

    //Function that loads the basket by adding every item in the localstorage to a table.
    function loadBasket() {
        const currentUser = SDK.User.current();
        const item = SDK.Storage.load("basket") || [];
        let total = 0;

        //Foreach loop that runs through every "entry" in the basket section of the local storage
        item.forEach(entry => {
            let subtotal = entry.item.itemPrice * entry.count;
            total += subtotal;

            //Appends the HTML code into the checkout.html site at the tbody
            $modalTbody.append(`
            <tr>
            <td colspan="1"></td>
            <td>${entry.item.itemName}</td>
            <td>${entry.count}</td>
            <td>kr. ${entry.item.itemPrice}</td>
            <td>kr. ${subtotal}</td>
            </tr>
            `);

            //Appends the HTML code into the shop.html site at the tbody
            $modalTbody2.append(`
            <tr>
            <td>${entry.item.itemName}</td>
            <td>${entry.count}</td>
            <td>${subtotal}</td>
            </tr>
            `);

        });

        //Appends the HTML code into the checkout.html site at the tbody
        $modalTbody.append(`
        <tr>
        <td colspan="3"></td>
        <td><b>Subtotal</b></td>
        <td>kr. ${total}</td>
        </tr>
        `);

        //Appends the HTML code into the shop.html site at the tbody
        $modalTbody2.append(`
         <tr>
        <td><b>Subtotal</b></td>
        <td><b>Kr.</b></td>
        <td><b>${total}</b></td>
        </tr>
        `);

        //SHow a checkout button (responsible for adding an order) to the user if they are logged in.
        if (currentUser) {
            $checkoutActions.append(`
                <button class="btn btn-success btn-lg" id="checkout-button">Checkout</button>
            `);
        }
        //Shows a "log in" button if the user isnt logged in.
        else {
            $checkoutActions.append(`
                 <a href="login.html">
                 <button class="btn btn-info btn-lg">Log in to checkout</button>
                </a>
            `);
        }
    }

    loadBasket();

    //Referal button-logic on the shop that send you to the checkout (basket).
    $("#go-to-checkout-button").click(() => {
        window.location.href = "checkout.html";
    });

    //Removes everything in the local storage by clicking "clear basket"
    $("#clear-basket-button").click(() => {
        SDK.Storage.remove("basket");
        window.location.href = "checkout.html";
    });

    //Adds the current basket as an order
    $("#checkout-button").click(() => {
        let userId = SDK.Storage.load("userId");
        let basket = SDK.Storage.load("basket");
        let itemList = [];

        basket.forEach((item, i, basket) => {
            itemList.push(basket[i].item);
        });


        SDK.Order.create(userId, itemList, (data, err)=>{

            SDK.Storage.remove("basket");
            window.alert("Order confirmed!");
            window.location.href = "myOrder.html";

        });

    });

});