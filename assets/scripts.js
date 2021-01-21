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

// SETS LOCATION BUTTON TEXT FROM ARRAY
function locationButtonNames(locationBtn, name) {
    $(locationBtn).text(name)
}

// SETS LOCATION TABLE HEADER TEXT FROM ARRAY
function locationTableHeaders(locationHeader, name) {
    $(locationHeader).text(name);
}

function updateTableBanner(tableName){
    $(".table-title").css('display','block')
    var tableHeaderText = $(tableName).parent().parent().parent().prev().children().first().children().text()
    $(".table-title").text(tableHeaderText);

    bannerImages = [
        ["#table-0", "assets/images/banner0.jpg", "#3F6292"],
        ["#table-1", "assets/images/banner1.jpg", "#D57967"],
        ["#table-2", "assets/images/banner2.jpg", "#AABE8D"],
        ["#table-3", "assets/images/banner3.jpg", "#F2E2BC"],
        ["#table-4", "assets/images/banner4.jpg", "#CA546A"],
        ["#table-5", "assets/images/banner5.jpg", "#E26E5C"],
    ]

    for (x in bannerImages) {
        if (bannerImages[x][0] == tableName){
            matchingImage = bannerImages[x][1];
            matchingBorderColour = "12px solid " + bannerImages[x][2];
            $("#banner-img").css('background-image',`url('${matchingImage}')`)
            $(".location-container").css('border', matchingBorderColour);
            $("#banner-img").css('background-color', matchingBorderColour);
        }
    }
}

function insertRowData(tableName, itemQuantity, itemName){
    console.log(`added ${itemQuantity} ${itemName}`)

    $(tableName).prepend(`
    <tr class="table-row">
        <td class="px-3 red-line"><input type="checkbox" class="item-check"></td>
        <td class="px-3 quantity-field"><span class="quantity-number">${itemQuantity}x</span></td>
        <td class="item-field w-75 text-left">${itemName}</td>
        <td class="px-2"><button class="remove-field"><i class="far fa-trash-alt"></i></button></td>
    </tr>
    `);

    updateHeaderQuantity(tableName);
    updateTableBanner(tableName);

    var tableTitle = $(tableName).parent().parent().parent().prev().children('.float-left').children().children().text()
    $(".added-item-alert").css('display','block');
    $("#modal-bar").html(`Added <strong>${itemName}</strong> into <strong>${tableTitle}</strong>`);
    
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
    } else {
        convertToCsvFormat(sListArray)
    }
})

function convertToCsvFormat(array) {
    flatArray = [];

    for (title in locations){
        flatArray.push(locations[title])
    }

    for (x in array){
        flatArray.push(array[x].name)
        flatArray.push(array[x].quantity)
        flatArray.push(array[x].location)
    }

    console.log("flatArray after items added is " + flatArray)

    csvFormatted = flatArray.join("|")
    csvConcat = "data:application/csv;charset=utf-8," + csvFormatted
    csvDownloadURL = csvConcat.replace(/ /g, '%20')
    console.log(csvDownloadURL)
    $("#createCSV").attr("href", csvDownloadURL)
}

// var uploadedArray = [];

function buttonTableLink(buttonLocation) {
    buttonLocationIndex = buttonLocation.split("location-btn-"|"table-")
    console.log(buttonLocationIndex[1])
}

 var buttonTableLink = [
    {buttonLocation : ".location-btn-0", tableID: "#table-0"},
    {buttonLocation : ".location-btn-1", tableID: "#table-1"},
    {buttonLocation : ".location-btn-2", tableID: "#table-2"},
    {buttonLocation : ".location-btn-3", tableID: "#table-3"},
    {buttonLocation : ".location-btn-4", tableID: "#table-4"},
    {buttonLocation : ".location-btn-5", tableID: "#table-5"},
 ]

 function findButtonTableLink(value) {
    for (i in buttonTableLink){
        if (buttonTableLink[i].buttonLocation == value) {
            return buttonTableLink[i].tableID;
        } else if (buttonTableLink[i].tableID == value) {
            return buttonTableLink[i].buttonLocation;
        }
        else {
            console.log(value + " was not found in " + buttonTableLink[i].tableID)
        }
    }
 }

 function removeAllData() {
    $(".table-row").remove();
    sListArray = [];
 }

//  SOURCE: https://stackoverflow.com/a/38095783
 $("#importCSV").on("click", function() {
     $("#uploadCSV")[0].click();
 })

$("#uploadCSV").change(function() {
    var readFile = new FileReader();
    readFile.onload = function() {
        var result = readFile.result
        var uploadDelimiter = result.split("|")
        var tableTitles = uploadDelimiter.slice(0, 6)
        var listItems = uploadDelimiter.slice(6)

        removeAllData()

        // CHANGE TITLES OF TABLES HERE USING tableTitles VARIABLE
        // find location-edit-btn class
        console.log(tableTitles)

        // for (i in tableTitles){
        //     $(".location-btn-" + i).text(tableTitles[i])
        //     $(".header" + i).text(tableTitles[i])
        // }

        locations = tableTitles
        updateAllLocations()
        updateLocationsMemory()


        for (x in listItems){
            if (x % 3 === 0){
                console.log(x)
                var loopIndex = Number.parseInt(x)
                var quantityIndex = loopIndex + 1
                var locationIndex = loopIndex + 2
                sListArray.push(new Item(listItems[x], listItems[quantityIndex], listItems[locationIndex]));
                items.push(new Item(listItems[x], listItems[quantityIndex], listItems[locationIndex]));
                updateLocalStorage();
                var matchingTable = findButtonTableLink(listItems[locationIndex])
                insertRowData(matchingTable, listItems[quantityIndex], listItems[x]);
                openAllSections()
            }
        }
    }

    readFile.readAsText(this.files[0]); 
});


function collapseCardsLoop(cardsArray){
    for (x in cardsArray){
        var tableItemsCounter = $(cardsArray).eq(x).children().children('.float-right').children('a').text()
        if (tableItemsCounter != "Completed" && tableItemsCounter != "0") {
            $(cardsArray).eq(x).children('.collapse').addClass('show')
            var nextTableId = `#${$(cardsArray).eq(x).children('.collapse').children().children().children().attr('id')}`
            updateTableBanner(nextTableId)
            break;
        }
    }
}

function updateHeaderQuantity(tableId){
    var tableRowCount = $(`${tableId} .item-check:not(:checked)`).length
    $(tableId).parent().parent().parent().prev().children('.float-right').children('a').text(tableRowCount)
    if ($(`${tableId} .item-check:checked`).length >0 && $(`${tableId} .item-check:not(:checked)`).length <=0){ // HANDLES WHEN YOU REMOVE THE LAST UNCHECKED ITEM IN A TABLE OF CHECKED ITEMS
        tableCompleted(tableId)
    }
}

function tableCompleted(tableId){
    $(tableId).parent().parent().parent().collapse("toggle")
    $(tableId).parent().parent().parent().prev().addClass('colour-complete')
    $(tableId).parent().parent().parent().prev().children('.float-right').children('a').text("Completed")
}

function tableIncomplete(tableId){
    updateHeaderQuantity(tableId)
    if ($(tableId).parent().parent().parent().prev().hasClass("colour-complete")){
        $(tableId).parent().parent().parent().prev().removeClass("colour-complete").addClass("colour-neutral")
    }
}

// SOURCE: https://stackoverflow.com/a/12602806
$('#accordion').on('click', 'input[class=item-check]', function(){
    var tableId = "#" + $(this).closest(".table").attr('id');
    var remainingCards = $(tableId).parent().parent().parent().parent().nextAll().toArray()
    var remainingCardsCounter = [];
    var allCards = $("#accordion").children('.card').toArray()
    var tableRowCount = $(`${tableId} .item-check:not(:checked)`).length

    for (x in remainingCards){
        var counters = $(tableId).parent().parent().parent().parent().nextAll().children('.card-header').children('.float-right').children('a').eq(x)
        remainingCardsCounter.push(counters.text())
    }

    // SOURCE: https://stackoverflow.com/questions/8846075/css3-unchecked-pseudo-class
    if ($(`${tableId} .item-check:not(:checked)`).length <1) {
        tableCompleted(tableId)
        // SOURCE: https://stackoverflow.com/a/18867667
        if (remainingCardsCounter.every(x => x === "0") || remainingCardsCounter.every(x => x === "Completed")) {
            collapseCardsLoop(allCards)
        } else {
            collapseCardsLoop(remainingCards)
        }
    } else if (tableRowCount >= 1){ // IF NOT ALL ITEMS ARE CHECKED IN TABLE
        tableIncomplete(tableId)
    }
})

// IF INPUT FIELD ISN'T EMPTY, ADD TO TABLE, OPEN TABLE CARD, CHECK IF IT EXISTS IN LOCALSTORAGE AND IF NOT THEN ADD IT AND RESET INPUT FIELD
function captureInput(location, tableName){
    $(location).on("click", function() {
        if ($(location).hasClass('prevent-click')) {
            return;
        }
        if ($(tableName).parent().parent().parent().prev().hasClass("colour-complete")){
            $(tableName).parent().parent().parent().prev().removeClass("colour-complete").addClass("colour-neutral")
        }
        if ($("#item-name").val() != ""){
            insertRowData(tableName, $("#quantity-counter").text(), $("#item-name").val());

            // ADDS QUANTITY TO TABLE HEADER
            // var TableRowCount = $(tableName).children('tr').length
            // $(tableName).parent().parent().parent().prev().children('.float-right').children('a').text(TableRowCount)

            sListArray.push(new Item($("#item-name").val(), $("#quantity-counter").text(), location));

            // let collapseParent = $(tableName).parent().parent().parent();
            // $(".collapse").not(collapseParent).collapse('hide');
            // $(collapseParent).addClass('show');
            // $(collapseParent).removeClass('hide');
            // goToShoppingList()

            // collapseShow(tableName);
            $(tableName).parent().parent().parent().collapse("show")

            // DETECTS DUPLICATES BEFORE ADDING TO ITEMS ARRAY
            if (items.length > 0){
                for (x in items){
                    if(items[x].name == $("#item-name").val()){
                        console.log(`${$("#item-name").val()} exists in memory`)
                        resetInput();
                        return;
                    }
                }
            }
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

$(".btn").on("click", function() {
    var clickedTableId = `#${$(this).parent().parent().parent().children('.collapse').children().children().children().attr('id')}`
    updateTableBanner(clickedTableId)
})

// OPENS ALL TABLES
function openAllSections() {
    $(".collapse").removeClass('hide');
    $(".collapse").addClass('show');
}

function closeAllSections() {
    $(".collapse").removeClass('show');
    $(".collapse").addClass('hide');
}

// APPLIES OPEN ALL TABLES FUNCTION TO BUTTON CLICK
$("#open-close").on("click", function() {
    var openCloseIcon = $("#open-close").children().children()
    if (openCloseIcon.hasClass('fa-level-down-alt')) {
        $("#open-close").children().children('.open-close-text').text("Close all ")
        $("#open-close").children().children('i').toggleClass("fa-level-down-alt fa-level-up-alt");
        openAllSections();
    } else if (openCloseIcon.hasClass('fa-level-up-alt')) {
        $("#open-close").children().children('.open-close-text').text("Open all ")
        $("#open-close").children().children('i').toggleClass("fa-level-down-alt fa-level-up-alt");
        closeAllSections();
    };
});

function updateAllLocations(){
    locationButtonNames(".location-btn-0", locations[0]);
    locationButtonNames(".location-btn-1", locations[1]);
    locationButtonNames(".location-btn-2", locations[2]);
    locationButtonNames(".location-btn-3", locations[3]);
    locationButtonNames(".location-btn-4", locations[4]);
    locationButtonNames(".location-btn-5", locations[5]);

    locationTableHeaders(".header0", locations[0]);
    locationTableHeaders(".header1", locations[1]);
    locationTableHeaders(".header2", locations[2]);
    locationTableHeaders(".header3", locations[3]);
    locationTableHeaders(".header4", locations[4]);
    locationTableHeaders(".header5", locations[5]);
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
                var locationBtn = ".location-btn-" + $(button).attr('class').split('location-btn-')[1].split('')[0];
                var linkedTable = findButtonTableLink(locationBtn);
                if ($(linkedTable).parent().parent().parent().hasClass('show')) {
                    updateTableBanner(linkedTable);
                }
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
            sListArray.splice(sListArray.findIndex(x => x.name === removedItemName),1);
            updateLocalStorage();
            $(this).closest("tr").remove();
            updateHeaderQuantity(tableName)
            var rowsLength = $(tableName).children('tr').length
            if (rowsLength == "0") {
                tableIncomplete(tableName)
            }
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
    // locationButtonNames(".location-btn-1", locations[1]);
    // locationButtonNames(".location-btn-2", locations[2]);
    // locationButtonNames(".location-btn-3", locations[3]);
    // locationButtonNames(".location-btn-4", locations[4]);
    // locationButtonNames(".location-btn-5", locations[5]);

    updateAllLocations();

    // locationTableHeaders(".header1", locations[0]);
    // locationTableHeaders(".header2", locations[1]);
    // locationTableHeaders(".header3", locations[2]);
    // locationTableHeaders(".header4", locations[3]);
    // locationTableHeaders(".header5", locations[4]);
    // locationTableHeaders(".header6", locations[5]);

    editLocation(".location-edit-btn-0");
    editLocation(".location-edit-btn-1");
    editLocation(".location-edit-btn-2");
    editLocation(".location-edit-btn-3");
    editLocation(".location-edit-btn-4");
    editLocation(".location-edit-btn-5");

    captureInput(".location-btn-0", "#table-0")
    captureInput(".location-btn-1", "#table-1")
    captureInput(".location-btn-2", "#table-2")
    captureInput(".location-btn-3", "#table-3")
    captureInput(".location-btn-4", "#table-4")
    captureInput(".location-btn-5", "#table-5")

    removeRow("#table-0")
    removeRow("#table-1")
    removeRow("#table-2")
    removeRow("#table-3")
    removeRow("#table-4")
    removeRow("#table-5")


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
