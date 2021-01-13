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

function updateLocationsMemory() {
    localStorage.setItem('locationsMemory', JSON.stringify(locations));
}

if (JSON.parse(localStorage.getItem('locationsMemory')) == undefined){
    var locations = ['Fruit & Veg', 'Front Shelves', 'Fridges', 'Freezers', 'Middle Shelves', 'End Shelves'];
} else {
    var locations = JSON.parse(localStorage.getItem('locationsMemory'));
}

// var locations = ['Fruit & Veg', 'Front Shelves', 'Fridges', 'Freezers', 'Middle Shelves', 'End Shelves'];

// SETS LOCATION BUTTON TEXT FROM ARRAY
function locationButtonNames(locationBtn, name) {
    $(locationBtn).text(name)
}

// SETS LOCATION TABLE HEADER TEXT FROM ARRAY
function locationTableHeaders(locationHeader, name) {
    $(locationHeader).text(name);
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

var sListArray = [];

$("#createCSV").on("click", function() {
    if (sListArray.length === 0) {
        alert('there is nothing in the shoping list')
    }
})

function convertToCsvFormat(array) {
    flatArray = [];
    for (x in array){
        flatArray.push(array[x].name)
        flatArray.push(array[x].quantity)
        flatArray.push(array[x].location)
    }
    csvFormatted = flatArray.join("|")
    csvConcat = "data:application/csv;charset=utf-8," + csvFormatted
    csvDownloadURL = csvConcat.replace(/ /g, '%20')
    console.log(csvDownloadURL)
    $("#createCSV").attr("href", csvDownloadURL)
}

var uploadedArray = [];

// function buttonTableLink(buttonLocation) {
//     buttonLocationIndex = buttonLocation.split("location-btn-"|"table-")
//     console.log(buttonLocationIndex[1])
// }

 var buttonTableLink = [
    {buttonLocation : ".location-btn-1", tableID: "#table-1"},
    {buttonLocation : ".location-btn-2", tableID: "#table-2"},
    {buttonLocation : ".location-btn-3", tableID: "#table-3"},
    {buttonLocation : ".location-btn-4", tableID: "#table-4"},
    {buttonLocation : ".location-btn-5", tableID: "#table-5"},
    {buttonLocation : ".location-btn-6", tableID: "#table-6"},
 ]

 function findButtonTableLink(value) {
    for (i in buttonTableLink){
        if (buttonTableLink[i].buttonLocation == value) {
            return buttonTableLink[i].tableID;
        } else if (buttonTableLink[i].tableID == value) {
            return buttonTableLink[i].buttonLocation;
        }
        else {
            console.log("not found")
        }
    }
 }

$("#uploadCSV").change(function() {
    var readFile = new FileReader();
    readFile.onload = function() {
        var result = readFile.result
        var uploadConvertToArray = result.split("|")
        for (x in uploadConvertToArray){
            if (x % 3 === 0){
                console.log(x)
                var loopIndex = Number.parseInt(x)
                var quantityIndex = loopIndex + 1
                var locationIndex = loopIndex + 2
                uploadedArray.push(new Item(uploadConvertToArray[x], uploadConvertToArray[quantityIndex], uploadConvertToArray[locationIndex]));
                var matchingTable = findButtonTableLink(uploadConvertToArray[locationIndex])
                console.log(x)

                // console.log(uploadConvertToArray[x])
                // console.log(uploadedArray[length])
                // console.log("matching table of " + uploadConvertToArray[x] + "is " + matchingTable)

                insertRowData(matchingTable, uploadConvertToArray[quantityIndex], uploadConvertToArray[x]);

                $(".collapse").removeClass('hide');
                $(".collapse").addClass('show');
                

                // DOES NOT OPEN TABLE CARD
            }
        }
        // NEED TO CONVERT CSV BACK INTO OBJECT ARRAY AND CLEAR SLISTARRAY/TABLE OF CONTENT
    }

    readFile.readAsText(this.files[0]); 
});




// IF INPUT FIELD ISN'T EMPTY, ADD TO TABLE, OPEN TABLE CARD, CHECK IF IT EXISTS IN LOCALSTORAGE AND IF NOT THEN ADD IT AND RESET INPUT FIELD
function captureInput(location, tableName){
    $(location).on("click", function() {
        if ($(location).hasClass('prevent-click')) {
            return;
        }
        if ($("#item-name").val() != ""){
            insertRowData(tableName, $("#quantity-counter").text(), $("#item-name").val());

            sListArray.push(new Item($("#item-name").val(), $("#quantity-counter").text(), location));
            convertToCsvFormat(sListArray)

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

function updateAllLocations(){
    locationButtonNames(".location-btn-1", locations[0]);
    locationButtonNames(".location-btn-2", locations[1]);
    locationButtonNames(".location-btn-3", locations[2]);
    locationButtonNames(".location-btn-4", locations[3]);
    locationButtonNames(".location-btn-5", locations[4]);
    locationButtonNames(".location-btn-6", locations[5]);

    locationTableHeaders(".header1", locations[0]);
    locationTableHeaders(".header2", locations[1]);
    locationTableHeaders(".header3", locations[2]);
    locationTableHeaders(".header4", locations[3]);
    locationTableHeaders(".header5", locations[4]);
    locationTableHeaders(".header6", locations[5]);
}

// ENABLES EDITING OF LOCATION NAMES
function editLocation(button){
    $(button).on("click", function() {
        var button = $(this).parent().prev().find('button');
        originalText = button.text();
        if ($(this).find('i').hasClass('fa-pencil-alt')){
            $(button).addClass('prevent-click');
            $(button).empty().append(`<input type="text" class="text-center location-input" placeholder="${originalText}"></input>`)
            $(button).removeClass('hover center');
            $(button).find('input').focus();
            $(this).find('i').removeClass('fa-pencil-alt').addClass('fa-check');
        } else if ($(this).find('i').hasClass('fa-check')){
            var inputPlaceholder = $(button).find('input').attr('placeholder')
            var inputText = $(button).find('input').val();
            if (inputText == ""){
                $(button).empty();
                $(button).text(inputPlaceholder)
                $(button).addClass('hover center');
                $(this).find('i').removeClass('fa-check').addClass('fa-pencil-alt');
            }
            else if (inputText != ""){
                $(button).empty();
                // $(button).text(inputText)
                $(button).addClass('hover center');
                $(this).find('i').removeClass('fa-check').addClass('fa-pencil-alt');
                // var targetTableHeader = $(`h5:contains('${inputPlaceholder}')`); 
                // updateTableHeaders(inputText, targetTableHeader)
                var locationIndex = locations.indexOf(inputPlaceholder);
                locations[locationIndex] = inputText;
                updateAllLocations();
                updateLocationsMemory();
            }
            $(button).removeClass('prevent-click');
        }
    })
}

function updateTableHeaders(newLocationName, targetTableHeader) {
    $(targetTableHeader).text(`${newLocationName}`);
}

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
if ($(window).width() >= 768) {
    $('#add-button').css('display', 'none');
} else if ($(window).width() < 768) {
    $('#add-button').css('display', 'none');
    $(window).scroll(function () {
        var height = $(window).height();
        if ($(window).scrollTop() >height) {
            $('#add-button').css('display', 'block');
        } else {
            $('#add-button').css('display', 'none');
        }
    })
}


$(document).ready(function() {

    // locationButtonNames(".location-btn-1", locations[0]);
    // locationButtonNames(".location-btn-2", locations[1]);
    // locationButtonNames(".location-btn-3", locations[2]);
    // locationButtonNames(".location-btn-4", locations[3]);
    // locationButtonNames(".location-btn-5", locations[4]);
    // locationButtonNames(".location-btn-6", locations[5]);

    updateAllLocations();

    // locationTableHeaders(".header1", locations[0]);
    // locationTableHeaders(".header2", locations[1]);
    // locationTableHeaders(".header3", locations[2]);
    // locationTableHeaders(".header4", locations[3]);
    // locationTableHeaders(".header5", locations[4]);
    // locationTableHeaders(".header6", locations[5]);

    editLocation(".location-edit-btn-1");
    editLocation(".location-edit-btn-2");
    editLocation(".location-edit-btn-3");
    editLocation(".location-edit-btn-4");
    editLocation(".location-edit-btn-5");
    editLocation(".location-edit-btn-6");

    captureInput(".location-btn-1", "#table-1")
    captureInput(".location-btn-2", "#table-2")
    captureInput(".location-btn-3", "#table-3")
    captureInput(".location-btn-4", "#table-4")
    captureInput(".location-btn-5", "#table-5")
    captureInput(".location-btn-6", "#table-6")

    removeRow("#table-1")
    removeRow("#table-2")
    removeRow("#table-3")
    removeRow("#table-4")
    removeRow("#table-5")
    removeRow("#table-6")


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