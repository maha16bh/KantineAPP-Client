//Inspired by Jespers shop which can be found at : https://github.com/Distribuerede-Systemer-2017/javascript-client/blob/exercise/js/shop.js
$(document).ready(() => {

    //Loads a navigation bar containing a menu to navigate the site
    SDK.User.loadNav();

    //Gets all items from the database through this SDK method.
    SDK.Item.findAllItems((data, err) => {

        const $purchaseModal = $('purchase-modal');
        const $itemList = $("#item-list");

        let allItemsList = data;

        //forEach loop that runs through all the items in the database and adds them to the shop.
        allItemsList.forEach((item) => {

            const id = item.itemId;
            const name = item.itemName;
            const description = item.itemDescription;
            const price = item.itemPrice;

            //HTML element to be injected into the Tbody (the shops design).
            const itemHTML = `
        <div class="col-lg-4 book-container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${item.itemName}</h3>
                </div>
                <div class="panel-body">
                    <div class="col-lg-4">
                        <img src="http://drpattydental.com/wp-content/uploads/2017/05/placeholder.png"/>
                    </div>
                    <div class="col-lg-8">
                      <dl>
                        <dt>Description</dt>
                        <dd>${item.itemDescription}</dd>
                        <dt>Caloric contents</dt>
                        <dd>Ask the personel for specifics</dd>
                      </dl>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="row">
                        <div class="col-lg-4 price-label">
                            <p>Kr. <span class="price-amount">${item.itemPrice}</span></p>
                        </div>
                        <div class="col-lg-8 text-right">
                            <button class="btn btn-success purchase-button" data-item-id="${item.itemId}">Add to basket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

            //Appends the HTML element to the tbody in shop.html
            $itemList.append(itemHTML);
        });

        //clickhandler for the "add to basket" button.
        $(".purchase-button").click(function () {
            $purchaseModal.modal('toggle');

            //Finds the targeted item ID
            const itemId = $(this).data("item-id");

            //Finds the targeted item using the item ID
            const item = data.find(item => item.itemId === itemId);

            //Adds the item to the basket in local storage
            SDK.Item.addToBasket(item);

            //Updates the html site to keep the live basket updated.
            window.location.href = "shop.html";
        });

    });
});