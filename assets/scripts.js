// INCREASES SPECIFIED QUANTITY VALUE BY 1
function increaseQuantity(quantity){
    return quantity + 1;
}

// REDUCES SPECIFIED QUANTITY VALUE BY 1
function decreaseQuantity(quantity){
    return quantity - 1;
}

// RETURNS CURRENT QUANTITY TEXT VALUE
function checkQuantity(){
    var quantity = parseInt($("#quantity-counter").text());
    return (quantity);
}

// INCREASE QUANTITY ON BUTTON CLICK
$("#plus-btn").on("click", function() {
    var quantity = checkQuantity();
    if (quantity < 10){
        $("#quantity-counter").text(increaseQuantity(quantity));
    }
});

// DECREASE QUANTITY ON BUTTON CLICK
$("#minus-btn").on("click", function() {
    var quantity = checkQuantity();
    if (quantity > 1){
        $("#quantity-counter").text(decreaseQuantity(quantity));
    }
});

// RESET ITEM TEXT INPUT FIELD
function resetInput(){
    $("#quantity-counter").text(1);
    $("#item-name").val('');
}

// WRITE LOCATIONS ARRAY TO LOCALSTORAGE
function updateLocationsMemory() {
    localStorage.setItem('locationsMemory', JSON.stringify(locations));
}

// SET DEFAULT LOCATIONS ARRAY VALUES OR PULL FROM LOCALSTORAGE IF IT EXISTS
if (JSON.parse(localStorage.getItem('locationsMemory')) == undefined){
    var locations = ['Fruit & Veg', 'Front Shelves', 'Fridges', 'Freezers', 'Middle Shelves', 'End Shelves'];
} else {
    var locations = JSON.parse(localStorage.getItem('locationsMemory'));
}

// RESET LOCATION BUTTON/TABLE NAMES ON BUTTON CLICK
$("#resetLocations").on("click", function() {
    locations = ['Fruit & Veg', 'Front Shelves', 'Fridges', 'Freezers', 'Middle Shelves', 'End Shelves'];
    localStorage.removeItem('locationsMemory');
    locationButtonNames('.location-btn-0', locations[0]);
    locationButtonNames('.location-btn-1', locations[1]);
    locationButtonNames('.location-btn-2', locations[2]);
    locationButtonNames('.location-btn-3', locations[3]);
    locationButtonNames('.location-btn-4', locations[4]);
    locationButtonNames('.location-btn-5', locations[5]);
    locationTableHeaders(".header0", locations[0]);
    locationTableHeaders(".header1", locations[1]);
    locationTableHeaders(".header2", locations[2]);
    locationTableHeaders(".header3", locations[3]);
    locationTableHeaders(".header4", locations[4]);
    locationTableHeaders(".header5", locations[5]);
    $("#settings-btn").trigger('click');
    var allTables = $(".card").children('.card-header').next('.collapse');
    for (var x in allTables){
        if ($(allTables).eq(x).length >0 && $(allTables).eq(x).hasClass('show')){
            var openTableText = $(allTables).eq(x).parent().children('.card-header').children('.float-left').children('a').children().text();
            $(".table-title").text(openTableText);
            return;
        }
    } 
    modalPopup("Reset location names back to default", "all");
 });


// SETS SPECIFIED LOCATION BUTTON TEXT VALUE
function locationButtonNames(locationBtn, name) {
    $(locationBtn).text(name);
}

// SETS SPECIFIED TABLE HEADER TEXT VALUE
function locationTableHeaders(locationHeader, name) {
    $(locationHeader).text(name);
}

// SETS HERO BANNER TEXT/IMAGE
function updateTableBanner(tableID){
    $(".table-title").css('display','block');
    var tableHeaderText = $(tableID).parent().parent().parent().prev().children().first().children().text();
    $(".table-title").text(tableHeaderText);
    var bannerImages = [
        ["#table-0", "assets/images/banner0.jpg", "#3F6292"],
        ["#table-1", "assets/images/banner1.jpg", "#D57967"],
        ["#table-2", "assets/images/banner2.jpg", "#AABE8D"],
        ["#table-3", "assets/images/banner3.jpg", "#F2E2BC"],
        ["#table-4", "assets/images/banner4.jpg", "#CA546A"],
        ["#table-5", "assets/images/banner5.jpg", "#55a1b8"],
    ];
    for (var x in bannerImages) {
        if (bannerImages[x][0] == tableID){
            var matchingImage = bannerImages[x][1];
            $("#banner-img").css('background-image',`url('${matchingImage}')`);
            $("#banner-img").css('background-color', bannerImages[x][2]);
        }
    }
}

// RECEIVES USER INPUT DATA AND WRITES HTML ROW INTO SPECIFIED TABLE
function insertRowData(tableID, itemQuantity, itemName){
    $(tableID).prepend(`
    <tr class="table-row">
        <td class="px-3 red-line"><input type="checkbox" aria-label="item checkbox" class="item-check"></td>
        <td class="px-3 quantity-field"><span aria-label="item quantity" class="quantity-number">${itemQuantity}x</span></td>
        <td class="item-field w-75 text-left" aria-label="item name">${itemName}</td>
        <td class="px-2"><button class="remove-field" aria-label="remove item"><i class="far fa-trash-alt"></i></button></td>
    </tr>
    `);
    updateHeaderQuantity(tableID);
    updateTableBanner(tableID);
}

// CREATES MODAL ALERT POPUP VISIBLE ON SPECIFIED DEVICE TYPE
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
    $(".popup-alert").fadeIn('1000');
    setTimeout(function(){
        $(".popup-alert").fadeOut('1000');
    }, 1500);
}

// CONSTRUCTOR FUNCTION THAT MAPS ITEM INPUT DATA INTO OBJECT
function Item (name, quantity, location) {
    this.name = name;
    this.quantity = quantity;
    this.location = location;
}

// CREATES EMPTY ITEMS ARRAY IF LOCALSTORAGE ITEMS ARRAY IS EMPTy
if (JSON.parse(localStorage.getItem('inputObjects')) == undefined){
    var items = [];
} else {
    var items = JSON.parse(localStorage.getItem('inputObjects'));
}

// WILL CONTAIN CURRENT SHOPPING LIST ITEMS
var sListArray = [];

// TAKES ARRAY OF ITEM OBJECTS AND DETACHES VALUES FROM OBJECT TO FORM A CSV FORMAT
function convertToCsvFormat(array) {
    var flatArray = [];
    for (var title = 0; title < locations.length; title++) {
        flatArray.push(locations[title]);
    }
    for (var x = 0; x < array.length; x++) {
        flatArray.push(array[x].name);
        flatArray.push(array[x].quantity);
        flatArray.push(array[x].location);
    }
    var csvFormatted = flatArray.join("|");
    return csvFormatted;
}

// CONVERTS SPECIFIED CSV STRING INTO DATA URL
function encodeDataURL(string){
    var encoded = encodeURIComponent(string);
    var url = 'data:application/octet-stream,' + encoded;
    return url;
}

// TRIGGERS DOWNLOAD OF SHOPING LIST AS CSV FILE
$("#createCSV").on("click", function() {
    if (sListArray.length === 0) {
        modalPopup("There are no items to download", "all");
    } else {
        toggleSectionCollapse("open");
        $("#createCSV").attr("href", encodeDataURL(convertToCsvFormat(sListArray)));
        $("#downloadModal").modal('show');
        $("#modalDownloadBtn").attr("href", encodeDataURL(convertToCsvFormat(sListArray)));
        $("#modalDownloadClose").on('click', function() {
            defaultHeroBanner();
        });
    }
});

// FORMS RELATIONSHIP BETWEEN EACH LOCATION BUTTON AND ITS CORRESPONDING TABLE
 var buttonTableLink = [
    {buttonLocation : ".location-btn-0", tableID: "#table-0"},
    {buttonLocation : ".location-btn-1", tableID: "#table-1"},
    {buttonLocation : ".location-btn-2", tableID: "#table-2"},
    {buttonLocation : ".location-btn-3", tableID: "#table-3"},
    {buttonLocation : ".location-btn-4", tableID: "#table-4"},
    {buttonLocation : ".location-btn-5", tableID: "#table-5"},
 ];

// FINDS CORRESPONDING TABLE/LOCATION BUTTON FROM SPECIFIED VALUE
 function findButtonTableLink(value) {
    for (var i in buttonTableLink){
        if (buttonTableLink[i].buttonLocation == value) {
            return buttonTableLink[i].tableID;
        } else if (buttonTableLink[i].tableID == value) {
            return buttonTableLink[i].buttonLocation;
        }
    }
 }

//  REMOVES ALL ROWS FROM TABLE
 function removeAllData() {
    $(".table-row").remove();
    sListArray = [];
    $(".card-header").children('.float-right').children('a').text("0");
 }

//  CALLS TO REMOVE ALL ROW DATA AND RESETS STATE OF UI
 $("#emptyShoppingList").on("click", function() {
    removeAllData();
    $("#settings-btn").trigger('click');
    toggleSectionCollapse("closed");
    modalPopup("Emptied shopping list", "all");
 });

// CLICKS ON HIDDEN FILE BROWSE BUTTON ON CLICK OF CUSTOM 'IMPORT' BUTTON
//  SOURCE: https://stackoverflow.com/a/38095783
 $("#importCSV").on("click", function() {
    $("#uploadCSV")[0].click();
 });

//  HANDLES USER INPUT FILE, ADDS TO TABLES AND AUTO-SUGGEST SOURCE
$("#uploadCSV").change(function() {
    var readFile = new FileReader();
    readFile.onload = function() {
        var read = readFile.result;
        var result = read.replace('&amp;', '&');
        var uploadDelimiter = result.split("|");
        var tableTitles = uploadDelimiter.slice(0, 6);
        var listItems = uploadDelimiter.slice(6);
        removeAllData();
        locations = tableTitles;
        updateAllLocations();
        updateLocationsMemory();
        for (var x in listItems){
            if (x % 3 === 0){
                var loopIndex = Number.parseInt(x);
                var quantityIndex = loopIndex + 1;
                var locationIndex = loopIndex + 2;
                sListArray.push(new Item(listItems[x], listItems[quantityIndex], listItems[locationIndex]));
                var matchingTable = findButtonTableLink(listItems[locationIndex]);
                insertRowData(matchingTable, listItems[quantityIndex], listItems[x]);
                modalPopup("Import successful", "mobile");
                toggleSectionCollapse("open");
                defaultHeroBanner();
                 // DETECTS DUPLICATES BEFORE ADDING TO ITEMS ARRAY
                if (itemNames.length > 0){
                    if (itemNames.indexOf(listItems[loopIndex]) != -1){
                    } else if (itemNames.indexOf(listItems[loopIndex]) == -1){
                        items.push(new Item(listItems[loopIndex], listItems[quantityIndex], listItems[locationIndex]));
                        itemNames.push(listItems[loopIndex]);
                    }
                } else if (itemNames.length <1) {
                    items.push(new Item(listItems[loopIndex], listItems[quantityIndex], listItems[locationIndex]));
                    itemNames.push(listItems[loopIndex]);
                }
                updateLocalStorage();
            }
        }
    };
    readFile.readAsText(this.files[0]);
});

// CHECKS REMAINING TABLES IN ARRAY FOR WHICH NEXT TABLE HAS ITEMS AND COLLAPSES
function collapseCardsLoop(cardsArray){
    for (var x = 0; x < cardsArray.length; x++) {
        var tableItemsCounter = $(cardsArray).eq(x).children().children('.float-right').children('a').text();
        if (tableItemsCounter != "Completed" && tableItemsCounter != "0") {
            $(cardsArray).eq(x).children('.collapse').addClass('show');
            var nextTableId = `#${$(cardsArray).eq(x).children('.collapse').children().children().children().attr('id')}`;
            updateTableBanner(nextTableId);
            break;
        }
    }
}

//  UPDATES TABLE QUANTITY WHEN ITEM IS UNCHECKED OR LAST UNCHECKED ITEM IS REMOVED
function updateHeaderQuantity(tableId){
    var uncheckedRows = $(`${tableId} .item-check:not(:checked)`).length;
    var checkedRows = $(`${tableId} .item-check:checked`).length;
    $(tableId).parent().parent().parent().prev().children('.float-right').children('a').text(uncheckedRows);
    if (checkedRows > 0 && uncheckedRows <= 0) {
        tableCompleted(tableId);
    }
}

// CHANGES TABLE HEADER TO COMPLETED STATE
function tableCompleted(tableId){
    $(tableId).parent().parent().parent().collapse("toggle");
    $(tableId).parent().parent().parent().prev().removeClass('card-header');
    $(tableId).parent().parent().parent().prev().addClass('colour-complete');
    $(tableId).parent().parent().parent().prev().children('.float-right').children('a').text("Completed");
}

// CHANGES TABLE HEADER TO NORMAL STATE
function tableIncomplete(tableId){
    updateHeaderQuantity(tableId);
    if ($(tableId).parent().parent().parent().prev().hasClass("colour-complete")){
        $(tableId).parent().parent().parent().prev().removeClass("colour-complete").addClass("colour-neutral");
    }
}

// ON CHECKBOX CLICK, DETERMINE WHICH IS THE NEXT TABLE TO COLLAPSE
// SOURCE: https://stackoverflow.com/a/12602806
$('#accordion').on('click', 'input[class=item-check]', function(){
    var tableId = "#" + $(this).closest(".table").attr('id');
    var remainingCards = $(tableId).parent().parent().parent().parent().nextAll().toArray();
    var remainingCardsCounter = [];
    var allCards = $("#accordion").children('.card').toArray();
    var tableRowCount = $(`${tableId} .item-check:not(:checked)`).length;
    for (var x = 0; x < remainingCards.length; x++ in remainingCards){
        var counters = $(tableId).parent().parent().parent().parent().nextAll().children('.card-header').children('.float-right').children('a').eq(x);
        remainingCardsCounter.push(counters.text());
    }
    // SOURCE: https://stackoverflow.com/questions/8846075/css3-unchecked-pseudo-class
    if ($(`${tableId} .item-check:not(:checked)`).length <1) {
        tableCompleted(tableId);
        if (remainingCardsCounter.every(x => x === "0") || remainingCardsCounter.every(x => x === "Completed")) {
            collapseCardsLoop(allCards);
        } else {
            collapseCardsLoop(remainingCards);
        }
    } else if (tableRowCount >= 1){ 
        tableIncomplete(tableId);
    }
});

// TAKES USER INPUT, ADDS IT TO TABLE AND ADDS TO AUTO-SUGGEST SOURCE IF UNIQUE
function captureInput(location, tableID){
    $(location).on("click", function() {
        if ($(location).hasClass('prevent-click')) {
            return;
        }
        if ($(tableID).parent().parent().parent().prev().hasClass("colour-complete")){
            $(tableID).parent().parent().parent().prev().removeClass("colour-complete").addClass("colour-neutral");
        }
        if ($("#item-name").val() != ""){
            insertRowData(tableID, $("#quantity-counter").text(), $("#item-name").val());
            var tableTitle = $(tableID).parent().parent().parent().parent().children('.card-header').children('.float-left').children('a').children().text();
            modalPopup(`Added <strong>${$("#item-name").val()}</strong> into <strong>${tableTitle}</strong>`, "mobile");
            sListArray.push(new Item($("#item-name").val(), $("#quantity-counter").text(), location));
            $(tableID).parent().parent().parent().collapse("show");
            // DETECTS DUPLICATES BEFORE ADDING TO ITEMS ARRAY
            if (items.length > 0){
                for (var x in items){
                    if(items[x].name == $("#item-name").val()){
                        resetInput();
                        return;
                    }
                }
            }
            items.push(new Item($("#item-name").val(), $("#quantity-counter").text(), location));
            localStorage.setItem('inputObjects', JSON.stringify(items));
            resetInput();
        } else if ($("#item-name").val() == ""){
            $('.input-row').effect('shake');
        }
    });
}

// CREATES ARRAY OF ITEM NAMES FROM LOCALSTORAGE ARRAY OF ITEMS
var itemNames = [];
for (var x = 0; x < items.length; x++){
    itemNames.push(items[x].name);
}

// USES ITEMNAMES ARRAY AS SOURCE FOR AUTO-SUGGEST FEATURE
$( "#item-name" ).autocomplete({
    source: itemNames
});

// CLEARS AUTO-SUGGEST SOURCE ARRAY OF VALUES
// SOURCE: https://stackoverflow.com/a/24099610
$("#clear-autofill").on("click", function() {
    $("#item-name").autocomplete({source: []});
    localStorage.removeItem('inputObjects');
    $("#settings-btn").trigger('click');
    modalPopup("Cleared auto-suggestions", "all");
});

// DETERMINES IF AUTO-SUGGESTIONS ARE VISIBLE TO THE USER
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
});

// TOGGLES COLLAPSE ON CLICK OF TABLE HEADER BAR AND UPDATES HERO BANNER
$('.card-header').on("click", function() {
    $(this).next('.collapse').collapse('toggle');
    var cardTableId = "#" + $(this).next().children().children().children().attr('id');
    updateTableBanner(cardTableId);
});

// SETS HERO BANNER TO DEFAULT STATE
function defaultHeroBanner(){
    var defaultHeroImg = "assets/images/banner-default.jpg";
    $("#banner-img").css('background-color','#299D8E');
    $("#banner-img").css('background-image',`url('${defaultHeroImg}')`);
    $(".table-title").empty();
    $(".table-title").css('display','none');
}

// CHANGES STATE TO OPEN/CLOSE
function toggleSectionCollapse(toggle){
    if (toggle == "open") {
        $("#accordion .collapse").removeClass('hide');
        $("#accordion .collapse").addClass('show');
        defaultHeroBanner();
        $("#open-close").children().children('.open-close-text').text("Close all ");
        $("#open-close").children().children('i').removeClass("fa-level-down-alt").addClass("fa-level-up-alt");
    } else if (toggle == "closed") {
        $(".collapse").removeClass('show');
        $(".collapse").addClass('hide');
        defaultHeroBanner();
        $("#open-close").children().children('.open-close-text').text("Open all ");
        $("#open-close").children().children('i').removeClass("fa-level-up-alt").addClass("fa-level-down-alt");
    }
}

// DETERMINES STATE OF OPEN/CLOSE TOGGLE ON CLICK
$("#open-close").on("click", function() {
    var openCloseIcon = $("#open-close").children().children();
    if (openCloseIcon.hasClass('fa-level-down-alt')) {
        toggleSectionCollapse("open");
    } else if (openCloseIcon.hasClass('fa-level-up-alt')) {
        toggleSectionCollapse("closed");
    }
});

// RESETS LOCATION BUTTONS AND TABLE HEADERS TO VALUES FROM LOCATIONS ARRAY
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

// TOGGLES STATE OF EDITING LOCATION NAMES, CREATES TEXT INPUT AND SAVES TO LOCALSTORAGE
$(".location-edit").on("click", function() {
    var button = $(this).parent().prev().find('button');
    var originalText = button.text();
    if ($(this).find('i').hasClass('fa-pencil-alt')){
        $(button).addClass('prevent-click');
        $(button).empty().append(`<input type="text" class="text-center location-input" aria-label="Type new table name" maxlength="18" placeholder="${originalText}"></input>`);
        $(button).removeClass('hover center');
        $(button).find('input').focus();
        $(this).find('i').removeClass('fa-pencil-alt').addClass('fa-check');
        $(this).find('i').attr('aria-label', 'Save edited table name');
        // SOURCE: https://stackoverflow.com/a/302154
        $(button).bind('keypress', function(e) {
            if(e.keyCode==13){
                $(button).parent().next().children('button').trigger('click');
            }
        });
    } else if ($(this).find('i').hasClass('fa-check')){
        var inputPlaceholder = $(button).find('input').attr('placeholder');
        var inputText = $(button).find('input').val();
        if (inputText == ""){
            $(button).empty();
            $(button).text(inputPlaceholder);
            $(button).addClass('hover center');
            $(this).find('i').removeClass('fa-check').addClass('fa-pencil-alt');
        }
        else if (inputText != ""){
            $(button).empty();
            $(button).addClass('hover center');
            $(this).find('i').removeClass('fa-check').addClass('fa-pencil-alt');
            var locationIndex = locations.indexOf(inputPlaceholder);
            locations[locationIndex] = inputText;
            updateAllLocations();
            updateLocationsMemory();
            var locationBtn = ".location-btn-" + $(button).attr('class').split('location-btn-')[1].split('')[0];
            var linkedTable = findButtonTableLink(locationBtn);
            if ($(linkedTable).parent().parent().parent().hasClass('show')) {
                updateTableBanner(linkedTable);
            }
            if ($(".table-title").css('display') == 'block') {
                if ($(".table-title").text().indexOf(inputPlaceholder) > 0 ) {
                    $(".table-title").text(inputText);
                }
            }
        }
        $(button).removeClass('prevent-click');
    }
});

// CALLS TO UPDATE LOCALSTORAGE WITH CHANGES TO ITEMS ARRAY
function updateLocalStorage(){
    localStorage.setItem('inputObjects', JSON.stringify(items));
}

// REMOVES ROW FROM TABLE AND LOCALSTORAGE ARRAY
// Source: https://stackoverflow.com/a/171293
$(".card").on("click", ".remove-field", function() {
    var tableID = "#" + $(this).parent().parent().parent().attr('id');
    var removedItemName = $(this).closest("tr").find(".item-field").text();
    items.splice(items.findIndex(x => x.name === removedItemName),1);
    sListArray.splice(sListArray.findIndex(x => x.name === removedItemName),1);
    updateLocalStorage();
    $(this).closest("tr").remove();
    updateHeaderQuantity(tableID);
    var rowsLength = $(tableID).children('tr').length;
    if (rowsLength == "0") {
        tableIncomplete(tableID);
        toggleSectionCollapse("closed");
    }
});

// CREATES SIMPLIFIED HTML TABLE OF ITEMS OBJECT FOR EMAIL TEMPLATE
function emailTable(itemsObject){
    var table0 = [];
    var table1 = [];
    var table2 = [];
    var table3 = [];
    var table4 = [];
    var table5 = [];
    var tables = [table0, table1, table2, table3, table4, table5];
    function tableRow(name, quantity){
        return `<tr>
        <td style="border: 1px dotted black; padding: 8px; border-radius: 8px;">${quantity}x</td>
        <td style="text-align: left; padding-left: 15px;">${name}</td>
        </tr>`;
    }
    for (var x in itemsObject){
        if (itemsObject[x].location == ".location-btn-0"){
            table0.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
        } else if (itemsObject[x].location == ".location-btn-1"){
            table1.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
        } else if (itemsObject[x].location == ".location-btn-2"){
            table2.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
        } else if (itemsObject[x].location == ".location-btn-3"){
            table3.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
        } else if (itemsObject[x].location == ".location-btn-4"){
            table4.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
        } else if (itemsObject[x].location == ".location-btn-5"){
            table5.push(tableRow(itemsObject[x].name, itemsObject[x].quantity));
        }
    }
    // CREATES TABLE HEADER
    function emailTableHeader(tableID){
        var tableName = $(tableID).parent().parent().parent().parent().children('.card-header').children('.float-left').children('a').children().text();
        return `
                <tr>
                <th> </th>
                <th style="text-align: left; padding-left: 15px; padding-top: 10px;">${tableName}</th>
                </tr>
        `;
    }
    // CONCATENATES ALL HTML TABLE SECTIONS INTO COMPLETE TABLE
    var concatHTML = [];
    for (var i in tables){
        if (tables[i].length >= 1) {
            var populatedTableId = `#table-${i}`;
            var populatedTableData = tables[i].join(' ');
            concatHTML.push(emailTableHeader(populatedTableId));
            concatHTML.push(populatedTableData);
        }
    }
    var result = "<table style='font-size: 18px; font-family: sans-serif;'>" + concatHTML.join(' ') + "</table>";
    return result;
}

// SENDS REQUEST TO EMAILJS TO SEND USER EMAIL CONTAINING HTML TABLE AND BASE64 ENCODED ATTACHMENT
$("#sendEmail").on("click", function() {
    var userEmail = $("#emailInput").val();
    if (userEmail == ""){
        $("#emailInput").effect("shake");
        return;
    }
    var csvContent = convertToCsvFormat(sListArray);
    var enc = window.btoa(csvContent);
    $("#sendEmail").css('background-color','#FFF3CD');
    $("#sendEmail").text("Sending...");
    var tableHTML = emailTable(sListArray);
    var csvDownloadURL = "https://rbsam176.github.io/ms2-Shoppr#" + encodeDataURL(csvContent);
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
                    <a style="font-size: 14px;" href="${csvDownloadURL}">Click here to download your shopping list CSV instead.</a>
                </p>
                <h2 style="font-family: sans-serif; font-weight: 400; font-size: 16px;">Your shopping list:</h2>
                <div style="display: inline-block;">${tableHTML}</div>
            </div>
        `,
        variable_sazymqs: enc
    })
    .then(
        function(response) {
            $("#sendEmail").css('background-color','#D4EDDA');
            $("#sendEmail").text("Sent!");
        },
        function(error){
            $("#sendEmail").css('background-color','#E26E5C');
            $("#sendEmail").text("Try again");
        }
    );
});

// CLICKING ON EMAIL BUTTON SETS FOCUS ON INPUT
// SOURCE: https://getbootstrap.com/docs/4.0/components/collapse/
$("#emailDropdown.collapse").on("shown.bs.collapse", function() {
    $("#emailInput").focus();
});

// RUN ON PAGE LOAD
window.onload = function() {
    // DETECTS IF CURRENT URL IS A REQUEST TO DOWNLOAD CSV FROM EMAIL
    if (location.hash.includes("data:application/octet-stream")){
        var fileURLsplit = location.hash.split("data:application")[1];
        var fileURL = "data:application" + fileURLsplit;
        $(`<a href="${fileURL}" download="shoppr-export.csv">`)[0].click();
        $("#downloadModal").modal('show');
        $("#modalDownloadBtn").attr("href", fileURL);
        $("#modalDownloadClose").on('click', function() {
            window.location.hash = "#";
            defaultHeroBanner();
        });
    }

    // SET DEFAULT STATE FOR AUTO-SUGGEST FEATURE AS ON IF NO STATE IS IN LOCALSTORAGE
    if (localStorage.getItem('autoSuggestToggleState') === null) {
        localStorage.setItem('autoSuggestToggleState', 'toggle-on');
    }
    // CHECKS ON PAGE LOAD OF LOCALSTORAGE AUTO-SUGGEST STATE IS ON AND SETS STATE TO ON
    if (localStorage.getItem('autoSuggestToggleState') === "toggle-on") {
        $("#autoSuggestToggle").html('<i></i> Auto-suggest on');
        $("#autoSuggestToggle").children('i').addClass('fas fa-toggle-on');
        $("#item-name").autocomplete('enable');
    }
    // CHECKS ON PAGE LOAD OF LOCALSTORAGE AUTO-SUGGEST STATE IS OFF AND SETS STATE TO OFF
    if (localStorage.getItem('autoSuggestToggleState') === "toggle-off") {
        $("#autoSuggestToggle").html('<i></i> Auto-suggest off');
        $("#autoSuggestToggle").children('i').addClass('fas fa-toggle-off');
        $("#item-name").autocomplete('disable');
    }

    // UPDATES LOCATION NAMES WITH LOCATIONS ARRAY DATA
    updateAllLocations();

    // LINKS LOCATION BUTTON TO CORRESPONDING TABLE FOR INPUT DATA INSERTION
    captureInput(".location-btn-0", "#table-0");
    captureInput(".location-btn-1", "#table-1");
    captureInput(".location-btn-2", "#table-2");
    captureInput(".location-btn-3", "#table-3");
    captureInput(".location-btn-4", "#table-4");
    captureInput(".location-btn-5", "#table-5");
};