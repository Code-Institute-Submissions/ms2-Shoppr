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
    console.log(`added ${itemQuantity} ${itemName}`)

    $(tableName).prepend(`
    <tr class="table-row">
        <td class="px-3 red-line"><input type="checkbox"></td>
        <td class="px-3 quantity-field"><span class="quantity-number">${itemQuantity}x</span></td>
        <td class="item-field w-75 text-left">${itemName}</td>
        <td class="px-2"><button class="remove-field"><i class="far fa-trash-alt"></i></button></td>
    </tr>
    `);
}

class Item {
    constructor(name, quantity, location) {
        this.name = name;
        this.quantity = quantity;
        this.location = location;
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
            insertRowData(tableName, $("#quantity-counter").text(), $("#item-name").val());
            let collapseParent = $(tableName).parent().parent().parent();
            $(".collapse").not(collapseParent).collapse('hide');
            $(collapseParent).addClass('show');
            $(collapseParent).removeClass('hide');
            goToShoppingList()
            if (items.length > 0){
                for (x in items){
                    if(items[x].name == $("#item-name").val()){
                        console.log(`${$("#item-name").val()} exists in memory`)
                        resetInput();
                        return;
                    }
                }
            }

            // if (JSON.parse(localStorage.getItem('inputObjects')) == undefined){
                
            // }

            items.push(new Item($("#item-name").val(), $("#quantity-counter").text(), location));
            localStorage.setItem('inputObjects', JSON.stringify(items));
            resetInput();
        }
    })
}

function goToShoppingList(){
    document.location = "#shopping-list";
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
    console.log("autofill has been cleared")
    location.reload();
})

// OPENS ALL TABLES
$("#open-sections").on("click", function() {
    $(".collapse").removeClass('hide');
    $(".collapse").addClass('show');
});

$("#edit-sections").on("click", function() {
    var redPlaceholder = $('.red-button').text();
    if ($('#edit-sections').text().includes("Edit locations")){
        $('.red-button').off('click');
        $('.red-button').empty().append(`<input type="text" placeholder="${redPlaceholder}"></input>`)
        $('.red-button').parent().removeClass('col-6 text-right').addClass('col-12 text-center');
        $('#edit-sections').text('Save Changes')
    } else if ($('#edit-sections').text().includes("Save Changes")){
        $('.red-button').on('click');
        $('.red-button').empty()
        // var redPlaceholder = 
        $('.red-button').text(redPlaceholder)
        $('.red-button').parent().removeClass('col-12 text-center').addClass('col-6 text-right');
        $('#edit-sections').text(`<i class="px-2 fas fa-pencil-alt"></i> Edit locations`)
    }
})

// UPDATES LOCALSTORAGE WITH CHANGES TO ITEMS ARRAY
function updateLocalStorage(){
    localStorage.setItem('inputObjects', JSON.stringify(items));
}

// REMOVES ROW FROM TABLE AND LOCALSTORAGE ARRAY
    // Source: https://stackoverflow.com/a/171293
    function removeRow(tableName){
        $(tableName).on("click", ".remove-field", function() {
            var removedItemName = $(this).closest("tr").find(".item-field").text();
            items.splice(items.findIndex(x => x.name === removedItemName),1);
            updateLocalStorage();
            $(this).closest("tr").remove();
            console.log(`Removed ${removedItemName} from array`);
        });
    }


// ADD BUTTON APPEARS AFTER SCROLLING DOWN
// SOURCE: https://www.tutorialfor.com/questions-309330.htm
$('#add-button').css('display', 'none');
$(window).scroll(function () {
    var height = $(window).height();
    if ($(window).scrollTop() >height) {
        $('#add-button').css('display', 'block');
    } else {
        $('#add-button').css('display', 'none');
    }
})

$(document).ready(function() {

    captureInput(".red-button", "#red-table")
    captureInput(".blue-button", "#blue-table")
    captureInput(".green-button", "#green-table")
    captureInput(".yellow-button", "#yellow-table")
    captureInput(".orange-button", "#orange-table")
    captureInput(".pink-button", "#pink-table")

    removeRow("#red-table")
    removeRow("#blue-table")
    removeRow("#green-table")
    removeRow("#yellow-table")
    removeRow("#orange-table")
    removeRow("#pink-table")


    // INCREASE QUANTITY
    $("#plus-btn").on("click", function() {
        checkQuantity();
        if (checkQuantity() < 10){
            $("#quantity-counter").text(increaseQuantity(quantity));
        }
    });

    // DECREASE QUANTITY
    $("#minus-btn").on("click", function() {
        checkQuantity();
        if (checkQuantity() > 1){
            $("#quantity-counter").text(decreaseQuantity(quantity));
        }
    });

})