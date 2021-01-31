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

$("#resetLocations").on("click", function() {
    // var defaultLocations = ['Fruit & Veg', 'Front Shelves', 'Fridges', 'Freezers', 'Middle Shelves', 'End Shelves']
    locations = ['Fruit & Veg', 'Front Shelves', 'Fridges', 'Freezers', 'Middle Shelves', 'End Shelves']
    localStorage.removeItem('locationsMemory')
    locationButtonNames('.location-btn-0', locations[0])
    locationButtonNames('.location-btn-1', locations[1])
    locationButtonNames('.location-btn-2', locations[2])
    locationButtonNames('.location-btn-3', locations[3])
    locationButtonNames('.location-btn-4', locations[4])
    locationButtonNames('.location-btn-5', locations[5])

    locationTableHeaders(".header0", locations[0]);
    locationTableHeaders(".header1", locations[1]);
    locationTableHeaders(".header2", locations[2]);
    locationTableHeaders(".header3", locations[3]);
    locationTableHeaders(".header4", locations[4]);
    locationTableHeaders(".header5", locations[5]);

    $("#settings-btn").trigger('click');
    // defaultHeroBanner();

    var allTables = $(".card").children('.card-header').next('.collapse')
    for (x in allTables){
        if ($(allTables).eq(x).length >0 && $(allTables).eq(x).hasClass('show')){
            var openTableText = $(allTables).eq(x).parent().children('.card-header').children('.float-left').children('a').children('h5').text()
            $(".table-title").text(openTableText)
            return;
        }
    } 

    modalPopup("Reset location names back to default", "all")
 })


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
            $("#banner-img").css('background-image',`url('${matchingImage}')`)
            $("#banner-img").css('background-color', bannerImages[x][2]);
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
    // $(".added-item-alert").css('display','block');
    // $("#modal-bar").html(`Added <strong>${itemName}</strong> into <strong>${tableTitle}</strong>`);
    modalPopup(`Added <strong>${itemName}</strong> into <strong>${tableTitle}</strong>`, "mobile")
    
}

function modalPopup(text, breakpoint){
    if (breakpoint == "mobile"){
        $("#modal-container").removeClass();
        $("#modal-container").addClass("d-xl-none d-lg-none d-md-none");
    } else if (breakpoint == "desktop"){
        $("#modal-container").removeClass();
        $("#modal-container").addClass("d-xl-block d-lg-block d-md-block d-sm-none d-none");
    } else if (breakpoint == "all"){
        $("#modal-container").removeClass();
    }
    $("#modal-bar").html(text);
    $(".popup-alert").fadeIn('1000')
    setTimeout(function(){ $(".popup-alert").fadeOut('1000') }, 1500);
}

// class Item {
//     constructor(name, quantity, location) {
//         this.name = name;
//         this.quantity = quantity;
//         this.location = location;
//     }
// }

function Item (name, quantity, location) {
    this.name = name;
    this.quantity = quantity;
    this.location = location;
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
        modalPopup("There are no items to download", "all")
    } else {
        convertToCsvFormat(sListArray)
        modalPopup("Downloaded CSV file", "all")
    }
})

function encodeDataURL(string){
    var encoded = encodeURIComponent(string)
    var url = 'data:application/octet-stream,' + encoded
    return url;
}

function convertToCsvFormat(array) {
    flatArray = [];

    for (title in locations){
        flatArray.push(locations[title])
        console.log(locations[title])
    }


    for (x in array){
        flatArray.push(array[x].name)
        flatArray.push(array[x].quantity)
        flatArray.push(array[x].location)
    }

    console.log("flatArray after items added is " + flatArray)

    csvFormatted = flatArray.join("|")
    // csvConcat = "data:application/csv;charset=utf-8," + csvFormatted // OLD VERSION
    // encoded = encodeURIComponent(csvFormatted) // NEW VERSION
    // csvDownloadURL = 'data:application/octet-stream,' + encoded // NEW VERSION
    // csvDownloadURL = csvConcat.replace(/ /g, '%20') // NEEDED FOR OLD VERSION
    $("#createCSV").attr("href", encodeDataURL(csvFormatted))

    return csvFormatted;
}

// var uploadedArray = [];

// function buttonTableLink(buttonLocation) {
//     buttonLocationIndex = buttonLocation.split("location-btn-"|"table-")
//     console.log(buttonLocationIndex[1])
// }

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
    $(".card-header").children('.float-right').children('a').text("0");
 }

 $("#emptyShoppingList").on("click", function() {
    removeAllData()
    $("#settings-btn").trigger('click');
    toggleSectionCollapse("closed")
    modalPopup("Emptied shopping list", "all")
 })

//  SOURCE: https://stackoverflow.com/a/38095783
 $("#importCSV").on("click", function() {
     $("#uploadCSV")[0].click();
 })

$("#uploadCSV").change(function() {
    var readFile = new FileReader();
    readFile.onload = function() {
        var read = readFile.result
        var result = read.replace('&amp;', '&')
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

                var matchingTable = findButtonTableLink(listItems[locationIndex]);
                insertRowData(matchingTable, listItems[quantityIndex], listItems[x]);
                toggleSectionCollapse("open");
                defaultHeroBanner();
                
                 // DETECTS DUPLICATES BEFORE ADDING TO ITEMS ARRAY
                if (itemNames.length > 0){
                    console.log("itemNames length is more than 0")
                    if (itemNames.indexOf(listItems[loopIndex]) != -1){
                        console.log(listItems[loopIndex] + " was found in itemNames array")
                    } else if (itemNames.indexOf(listItems[loopIndex]) == -1){
                        items.push(new Item(listItems[loopIndex], listItems[quantityIndex], listItems[locationIndex]));
                        itemNames.push(listItems[loopIndex])
                    }
                } else if (itemNames.length <1) {
                    items.push(new Item(listItems[loopIndex], listItems[quantityIndex], listItems[locationIndex]));
                    itemNames.push(listItems[loopIndex])
                }

                updateLocalStorage();
            }
        }
    }

    readFile.readAsText(this.files[0]); 
    // var defaultHeroImg = "assets/images/banner-default.jpg"
    // $("#banner-img").css('background-color','#299D8E')
    // $("#banner-img").css('background-image',`url('${defaultHeroImg}')`)
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
    $(tableId).parent().parent().parent().prev().removeClass('card-header')
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
        if (remainingCardsCounter.every(x => x === "0") || remainingCardsCounter.every(x => x === "Completed")) {
            collapseCardsLoop(allCards)
        } else {
            collapseCardsLoop(remainingCards)
        }
    } else if (tableRowCount >= 1){ // IF NOT ALL ITEMS ARE CHECKED IN TABLE
        tableIncomplete(tableId)
    }
})

function detectDuplicates(item, array){
    for (x in array){
        if (array[x].name != $(item).val()){
            console.log(`${$(item).val()} doesn't exist in array`)
            var itemValue = $(item).val();
            return itemValue;
        }
    } 
}

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
        } else if ($("#item-name").val() == ""){
            $('.input-row').effect('shake')
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
    source: itemNames
});

// CLEARS THE LOCALSTORAGE MEMORY
// SOURCE: https://stackoverflow.com/a/24099610
$("#clear-autofill").on("click", function() {
    $("#item-name").autocomplete({source: []});
    localStorage.removeItem('inputObjects');
    $("#settings-btn").trigger('click');
    modalPopup("Cleared auto-suggestions", "all")
})

$("#autoSuggestToggle").on("click", function() {
    if ($("#autoSuggestToggle").children('i').hasClass('fa-toggle-on')){
        $("#autoSuggestToggle").html('<i></i> Auto-suggest off');
        $("#autoSuggestToggle").children('i').addClass('fas fa-toggle-off');
        $("#item-name").autocomplete('disable');
        localStorage.setItem('autoSuggestToggleState', "toggle-off");
    } else if ($("#autoSuggestToggle").children('i').hasClass('fa-toggle-off')){
        $("#autoSuggestToggle").html('<i></i> Auto-suggest on');
        $("#autoSuggestToggle").children('i').addClass('fas fa-toggle-on');
        $("#item-name").autocomplete('enable');
        localStorage.setItem('autoSuggestToggleState', "toggle-on");
    }
})

$(".btn").on("click", function() {
    var clickedTableId = `#${$(this).parent().parent().parent().children('.collapse').children().children().children().attr('id')}`
    updateTableBanner(clickedTableId)
})

$('.card-header').on("click", function() {
    $(this).next('.collapse').collapse('toggle')
    var cardTableId = "#" + $(this).next().children().children().children().attr('id')
    updateTableBanner(cardTableId)
})

function defaultHeroBanner(){
    var defaultHeroImg = "assets/images/banner-default.jpg"
    $("#banner-img").css('background-color','#299D8E')
    $("#banner-img").css('background-image',`url('${defaultHeroImg}')`)
    $(".table-title").empty()
    $(".table-title").css('display','none')
}

function toggleSectionCollapse(toggle){
    if (toggle == "open") {
        $("#accordion .collapse").removeClass('hide');
        $("#accordion .collapse").addClass('show');
        defaultHeroBanner();
        $("#open-close").children().children('.open-close-text').text("Close all ")
        $("#open-close").children().children('i').removeClass("fa-level-down-alt").addClass("fa-level-up-alt");
    } else if (toggle == "closed") {
        $(".collapse").removeClass('show');
        $(".collapse").addClass('hide');
        defaultHeroBanner();
        $("#open-close").children().children('.open-close-text').text("Open all ")
        // $("#open-close").children().children('i').toggleClass("fa-level-down-alt fa-level-up-alt");
        $("#open-close").children().children('i').removeClass("fa-level-up-alt").addClass("fa-level-down-alt");
    }
}

// APPLIES OPEN ALL TABLES FUNCTION TO BUTTON CLICK
$("#open-close").on("click", function() {
    var openCloseIcon = $("#open-close").children().children()
    if (openCloseIcon.hasClass('fa-level-down-alt')) {
        toggleSectionCollapse("open")
    } else if (openCloseIcon.hasClass('fa-level-up-alt')) {
        toggleSectionCollapse("closed")
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
            $(button).empty().append(`<input type="text" class="text-center location-input" maxlength="18" placeholder="${originalText}"></input>`)
            $(button).removeClass('hover center');
            $(button).find('input').focus();
            $(this).find('i').removeClass('fa-pencil-alt').addClass('fa-check');

            // SOURCE: https://stackoverflow.com/a/302154
            $(button).bind('keypress', function(e) {
                if(e.keyCode==13){
                    $(button).parent().next().children('button').trigger('click')
                }
            });

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
                toggleSectionCollapse("closed")
            }
            console.log(`Removed ${removedItemName} from array`);
            
        });
    }

// ADD BUTTON APPEARS AFTER SCROLLING DOWN
// SOURCE: https://www.tutorialfor.com/questions-309330.htm
// if ($(window).width() >= 768) {
//     $('#add-button').css('display', 'none');
// } else if ($(window).width() < 768) {
//     $('#add-button').css('display', 'none');
//     $(window).scroll(function () {
//         var height = $(window).height();
//         if ($(window).scrollTop() >height) {
//             $('#add-button').css('display', 'block');
//         } else {
//             $('#add-button').css('display', 'none');
//         }
//     })
// }

function emailTable(itemsObject){

    var table0 = [];
    var table1 = [];
    var table2 = [];
    var table3 = [];
    var table4 = [];
    var table5 = [];

    var tables = [table0, table1, table2, table3, table4, table5]

    function tableRow(name, quantity){
        return `<tr>
        <td style="border: 1px dotted black; padding: 8px; border-radius: 8px;">${quantity}x</td>
        <td style="text-align: left; padding-left: 15px;">${name}</td>
        </tr>`
    }

    for (x in itemsObject){
        if (itemsObject[x].location == ".location-btn-0"){
            table0.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
            // var tableIndex = tables.indexOf(table0)
            // tables[tableIndex].push(tableRow(itemsObject[x].name, itemsObject[x].quantity))

        } else if (itemsObject[x].location == ".location-btn-1"){
            table1.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
            // var tableIndex = tables.indexOf(table1)
            // tables[tableIndex].push(tableRow(itemsObject[x].name, itemsObject[x].quantity))
            
        } else if (itemsObject[x].location == ".location-btn-2"){
            table2.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
            // var tableIndex = tables.indexOf(table2)
            // tables[tableIndex].push(tableRow(itemsObject[x].name, itemsObject[x].quantity))
            
        } else if (itemsObject[x].location == ".location-btn-3"){
            table3.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
            // var tableIndex = tables.indexOf(table3)
            // tables[tableIndex].push(tableRow(itemsObject[x].name, itemsObject[x].quantity))
            
        } else if (itemsObject[x].location == ".location-btn-4"){
            table4.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
            // var tableIndex = tables.indexOf(table4)
            // tables[tableIndex].push(tableRow(itemsObject[x].name, itemsObject[x].quantity))
            
        } else if (itemsObject[x].location == ".location-btn-5"){
            table5.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
            // var tableIndex = tables.indexOf(table5)
            // tables[tableIndex].push(tableRow(itemsObject[x].name, itemsObject[x].quantity))
            
        }

    }

    function emailTableHeader(tableID){
        var tableName = $(tableID).parent().parent().parent().parent().children('.card-header').children('.float-left').children('a').children().text()
        console.dir(tableName)
        return `
                <tr>
                <th> </th>
                <th style="text-align: left; padding-left: 15px; padding-top: 10px;">${tableName}</th>
                </tr>
        `
    }

    var concatHTML = [];

    for (i in tables){
        if (tables[i].length >= 1) {
            var populatedTableId = `#table-${i}`
            var populatedTableData = tables[i].join(' ')
            concatHTML.push(emailTableHeader(populatedTableId))
            concatHTML.push(populatedTableData)

        }
    }

    // var result = "<table style='font-size: 16px;'>" + emailTableHeader("#table-0") + table0.join(' ') + emailTableHeader("#table-1") + table1.join(' ') + emailTableHeader("#table-2") + table2.join(' ') + "</table>"

    // console.log(result)
    // console.log("HERE")
    result = "<table style='font-size: 18px; font-family: sans-serif;'>" + concatHTML.join(' ') + "</table>"
    
    return result;
}

$("#sendEmail").on("click", function() {
    var userEmail = $("#emailInput").val();
    if (userEmail == ""){
        $("#emailInput").effect("shake")
        return;
    }
    var csvContent = convertToCsvFormat(sListArray);
    var enc = window.btoa(csvContent)
    console.log("here")
    console.log(enc)
    $("#sendEmail").css('background-color','#FFF3CD')
    $("#sendEmail").text("Sending...")

    var tableHTML = emailTable(sListArray)

    var csvDownloadURL = "https://rbsam176.github.io/ms2-Shoppr#" + encodeDataURL(csvContent)
    console.log(csvDownloadURL)


    emailjs.init("user_VBOljHoPAv6fbpkGFq5GA");
    emailjs.send('gmail', 'export_email', {
        "from_name": "Shoppr",
        "to_email": userEmail,
        message: `
        <body style="background-color: rgb(238, 238, 238);">
            <div style="width: 90%; background-color: white; border: 4px solid black; border-radius: 20px; text-align: center; margin: auto; margin-top: 2.5%; padding: 20px;">
                <a href="https://rbsam176.github.io/ms2-Shoppr/" style="text-decoration: none;"><h1 style="color: black; font-size: 32px; font-family: sans-serif; width: 100%;">Shoppr <img src="https://raw.githubusercontent.com/rbsam176/ms2-Shoppr/develop/assets/images/shopping-basket-solid.png" height="38px"></h1></a>
                <h2 style="font-family: sans-serif; font-size: 22px; font-weight: 400;">Hello!</h2>
                <p style="font-family: sans-serif; font-size: 20px;">Your exported shopping list is displayed below, but it is also attached to this email as a CSV file.</p>
                <p style="line-height: 1.6; border: 2px dotted black; background-color: #fff6e6; padding: 20px; border-radius: 10px; font-family: sans-serif; color: rgb(71, 71, 71);">
                    <img src="https://raw.githubusercontent.com/rbsam176/ms2-Shoppr/develop/assets/images/lightbulb-solid.png" height="32px" style="padding-bottom: 10px;"><br>
                    <em style="font-size: 16px;">This attached file allows you to import your list back into Shoppr, useful for sharing with others or transfering your list on to another of your devices.</em><br>
                    <em style="font-size: 14px;">Email missing attachment?</em><br>
                    <a style="font-size: 14px;" href="https://rbsam176.github.io/ms2-Shoppr#${csvDownloadURL}">Click here to download your shopping list CSV instead.</a>
                </p>
                <h2 style="font-family: sans-serif; font-weight: 400; font-size: 16px;">Your shopping list:</h2>
                <div style="display: inline-block;">${tableHTML}</div>
            </div>
        `,
        variable_sazymqs: enc
    })
    .then(
        function(response) {
            console.log("Success", response);
            $("#sendEmail").css('background-color','#D4EDDA')
            $("#sendEmail").text("Sent!")
        },
        function(error){
            console.log("Failed", error);
            $("#sendEmail").css('background-color','#E26E5C')
            $("#sendEmail").text("Try again")
        });


})

// CLICKING ON EMAIL BUTTON WILL FOCUS ON INPUT
// SOURCE: https://getbootstrap.com/docs/4.0/components/collapse/
$("#emailDropdown.collapse").on("shown.bs.collapse", function() {
    $("#emailInput").focus();
  });


$(document).ready(function() {

    if (location.hash.includes("data:application/octet-stream")){
        var fileURLsplit = location.hash.split("data:application")[1];
        var fileURL = "data:application" + fileURLsplit;
        console.log(fileURL)
        $(`<a href="${fileURL}" download="shoppr-export.csv">`)[0].click()
        $("#downloadModal").modal('show')
        $("#modalDownloadBtn").attr("href", fileURL)
        $("#modalDownloadClose").on('click', function() {
            window.location.hash = "#"
            defaultHeroBanner();
        })
    }

    // SET DEFAULT STATE FOR AUTO-SUGGEST FEATURE AS ON
    if (localStorage.getItem('autoSuggestToggleState') === null) {
        localStorage.setItem('autoSuggestToggleState', 'toggle-on')
    }
    // IF WHEN PAGE LOADS THE STATE IS ON THEN WRITE HTML AND CORRECT ON TOGGLE ICON
    if (localStorage.getItem('autoSuggestToggleState') === "toggle-on") {
        $("#autoSuggestToggle").html('<i></i> Auto-suggest on');
        $("#autoSuggestToggle").children('i').addClass('fas fa-toggle-on');
        $("#item-name").autocomplete('enable');
    }
    // IF WHEN PAGE LOADS THE STATE IS OFF THEN WRITE HTML AND CORRECT OFF TOGGLE ICON
    if (localStorage.getItem('autoSuggestToggleState') === "toggle-off") {
        $("#autoSuggestToggle").html('<i></i> Auto-suggest off');
        $("#autoSuggestToggle").children('i').addClass('fas fa-toggle-off');
        $("#item-name").autocomplete('disable');
    }

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

