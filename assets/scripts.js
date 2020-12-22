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

// CREATES LOCALSTORAGE ITEMS ARRAY
if (JSON.parse(localStorage.getItem('inputObjects')) == undefined){
    var items = [];
} else {
    var items = JSON.parse(localStorage.getItem('inputObjects'));
}

// IF INPUT FIELD ISN'T EMPTY, ADD TO TABLE, OPEN TABLE CARD, CHECK IF IT EXISTS IN LOCALSTORAGE AND IF NOT THEN ADD IT AND RESET INPUT FIELD
function captureInput(location, tableName){
    $(location).on("click", function() {
        if (Item.name != ""){
            alert("added")
            insertRowData(tableName, $("#quantity-counter").text(), $("#item-name").val());
            let collapseParent = $(tableName).parent().parent().parent();
            $(".collapse").not(collapseParent).collapse('hide');
            $(collapseParent).addClass('show');
            $(collapseParent).removeClass('hide');
            if (items.length > 0){
                for (x in items){
                    if(items[x].name == $("#item-name").val()){
                        alert("already in items")
                        return;
                    }
                }
            }
            items.push(new Item($("#item-name").val(), $("#quantity-counter").text(), location, false));
            localStorage.setItem('inputObjects', JSON.stringify(items));
            resetInput();
        }
    })
}

// CREATES ARRAY OF ITEM NAMES FROM LOCALSTORAGE
itemNames = [];
for (x in items){
    itemNames.push(items[x].name)
}

// PROVIDES AUTOCOMPLETE SUGGESTIONS FROM ITEM NAMES
$( "#item-name" ).autocomplete({
    source: itemNames,
});

// CLEARS THE LOCALSTORAGE MEMORY
$("#clear-autofill").on("click", function() {
    localStorage.clear();
    alert("Autofill Cleared")
    location.reload();
})

// OPENS ALL TABLES
$("#open-sections").on("click", function() {
    $(".collapse").removeClass('hide');
    $(".collapse").addClass('show');
});

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