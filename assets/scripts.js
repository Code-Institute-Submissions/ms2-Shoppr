function increaseQuantity(quantity){
    return quantity + 1;
}

function decreaseQuantity(quantity){
    return quantity - 1;
}

function checkQuantity(){
    quantity = parseInt($("#quantity-counter").text());
    return (quantity);
}

function resetInput(){
    $("#quantity-counter").text(1);
    $("#item-name").val('');
}

function insertRowData(tableName, itemQuantity, itemName){
    $(tableName).prepend(`
    <tr class="table-row">
        <td class="red-line"><input type="checkbox"></td>
        <td class="quantity-field px-4"><span class="quantity-number">${itemQuantity}x</span></td>
        <td class="item-field w-75">${itemName}</td>
        <td><button class="favourite-field"><i class="far fa-star"></i></button></td>
        <td><button class="remove-field"><i class="far fa-trash-alt"></i></button></td>
    </tr>
    `);
}

class Item {
    constructor(name, quantity, location, favourite) {
        this.name = name;
        this.quantity = quantity;
        this.location = location;
        this.favourite = favourite;
    }
}

items = [];

function captureInput(location, tableName){
    $(location).on("click", function() {
        if (Item.name != ""){
            items.push(new Item($("#item-name").val(), $("#quantity-counter").text(), location, false));
            insertRowData(tableName, $("#quantity-counter").text(), $("#item-name").val());
            resetInput();
            let collapseParent = $(tableName).parent().parent().parent();
            $(".collapse").not(collapseParent).collapse('hide');
            $(collapseParent).addClass('show');
            $(collapseParent).removeClass('hide');
        }
    })
}

$(document).ready(function() {

    captureInput(".red-button", "#red-table")
    captureInput(".blue-button", "#blue-table")
    captureInput(".green-button", "#green-table")
    captureInput(".yellow-button", "#yellow-table")
    captureInput(".orange-button", "#orange-table")
    captureInput(".pink-button", "#pink-table")

    // INCREASE QUANTITY
    $("#plus-button").on("click", function() {
        checkQuantity();
        if (checkQuantity() < 10){
            $("#quantity-counter").text(increaseQuantity(quantity));
        }
    });

    // DECREASE QUANTITY
    $("#minus-button").on("click", function() {
        checkQuantity();
        if (checkQuantity() > 1){
            $("#quantity-counter").text(decreaseQuantity(quantity));
        }
    });


})