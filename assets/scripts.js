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

    var itemIndex = items.findIndex(x => x.name === itemName);
    console.log(itemIndex)
    if (itemIndex != -1){
        console.log("is not -1")
        if (items[itemIndex].favourite === false){
            console.log(`favourite status of ${itemName} is false`)
            var favouriteStatus = "";
        } else if (items[itemIndex].favourite === true){
            var favouriteStatus = "favourite-enable";
            console.log(`favourite status of ${itemName} is true`)
        }
    }

    $(tableName).prepend(`
    <tr class="table-row">
        <td class="px-3 red-line"><input type="checkbox"></td>
        <td class="px-3 quantity-field"><span class="quantity-number">${itemQuantity}x</span></td>
        <td class="item-field w-75">${itemName}</td>
        <td class="px-2"><button class="favourite-field ${favouriteStatus}"><i class="far fa-star"></i></button></td>
        <td class="px-2"><button class="edit-field"><i class="fas fa-pencil-alt"></i></button></td>
        <td class="px-2"><button class="remove-field"><i class="far fa-trash-alt"></i></button></td>
        <td class="px-2"><button class="more-button"><i class="fas fa-ellipsis-v"></i></button></td>
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

            items.push(new Item($("#item-name").val(), $("#quantity-counter").text(), location, false));
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

// TOGGLES FAVOURITE STATUS TO TRUE/FALSE AND APPLIES CSS
function toggleFavourite(tableName){
    $(tableName).on("click", ".favourite-field", function() {
        var favouriteItemName = $(this).closest("tr").find(".item-field").text();
        var itemIndex = items.findIndex(x => x.name === favouriteItemName);
        $(this).closest(".favourite-field").toggleClass("favourite-enable");
        if (items[itemIndex].favourite != true) {
            items[itemIndex].favourite = true;
            updateLocalStorage();
            console.log(`favourite status of ${items[itemIndex].name} is ${items[itemIndex].favourite}`);
        } else {
            items[itemIndex].favourite = false;
            console.log(`favourite status of ${items[itemIndex].name} is ${items[itemIndex].favourite}`);
            updateLocalStorage();
        }
    })
}

function editItemName(tableName){
    $(tableName).on("click", ".edit-field", function() {
        // var originalInput = $(".item-field").text()
        var originalInput = $(this).closest('tr').find('.item-field').text();
        if ($(this).find('i').hasClass('fas fa-pencil-alt')){
            $(this).find('i').removeClass().addClass('fas fa-check');
            // $(".item-field").empty()
            $(this).closest('tr').find('.item-field').empty();
            // $(".item-field").append(`<input class="text-center" type="text" placeholder="${originalInput}">`)
            $(this).closest('tr').find('.item-field').append(`<input class="text-center" type="text" placeholder="${originalInput}">`)
            // $(this).closest('tr').find('input').focus();
            $(this).closest('tr').find('.item-field').focus();
        } else if ($(this).find('i').hasClass('fas fa-check')){
            var textInput = $(".item-field").find('input').val();
            if (textInput == "") {
                alert('nothing inputted')
                var placeholderInput = $(".item-field").find('input').attr('placeholder');
                // $(".item-field").empty()
                $(this).closest('tr').find('.item-field').empty();
                // $(".item-field").text(placeholderInput);
                $(this).closest('tr').find('.item-field').text(placeholderInput);
            } else if (textInput != ""){
                alert ('you inputted ' + textInput)
                // $(".item-field").empty()
                $(this).closest('tr').find('.item-field').empty();
                // $(".item-field").text(textInput);
                $(this).closest('tr').find('.item-field').text(textInput);
            }
            $(this).find('i').removeClass().addClass('fas fa-pencil-alt');
        }
    })
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

function moreOptions(tableName){
    $(tableName).on("click", ".more-button", function() {
        $("#options-modal").css('display', 'block');
    })
}

$(document).ready(function() {

    moreOptions("#red-table");
    moreOptions("#blue-table");
    moreOptions("#green-table");
    moreOptions("#yellow-table");
    moreOptions("#orange-table");
    moreOptions("#pink-table");

    editItemName("#red-table");
    editItemName("#blue-table");
    editItemName("#green-table");
    editItemName("#yellow-table");
    editItemName("#orange-table");
    editItemName("#pink-table");

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
    
    toggleFavourite("#red-table")
    toggleFavourite("#blue-table")
    toggleFavourite("#green-table")
    toggleFavourite("#yellow-table")
    toggleFavourite("#orange-table")
    toggleFavourite("#pink-table")

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