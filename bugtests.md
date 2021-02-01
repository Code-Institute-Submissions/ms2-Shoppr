# Bug test suites
#### [Click to go back to readme](/readme.md)

| Feature (& Device) | Action | Expected Behaviour | Achieved Behaviour |
|-|-|-|-|
| Automatic opening/collapsing of shopping list tables and table header quantity text updating (all devices) | Check an item in a table (other unchecked items remain in the same table) | The header quantity text should reduce by 1 when you check an item | Yes |
|  | Adding an item | The header quantity text should increase by 1 | Yes |
|  | Check the last unchecked item in a table | This should collapse the table, change the header quantity text to say “Completed” and fade green | Yes |
|  |  | The next table below that has unchecked items within it should open | Yes |
|  |  | If on the last table, or all tables below have no items or are “Completed” then it should open the first table starting from the top that has unchecked items | Yes |
|  | Uncheck or add an item in a “Completed” table | The header quantity text should return to 1, the green should revert back to the neutral colour and the table should remain open | Yes |
|  | Removing an item from a table | The item should disappear, the header quantity text should reflect the number of items remaining in the table that are unchecked and if it is now empty the table should close | Yes |
|  | Remove the last unchecked item from a table containing checked items | The item should disappear, the header quantity text should show “Completed” and fade green and the table should collapse | Yes |
|  | Removing the last item from a table that is already “Completed” | The item should disappear, the header quantity text should show “0” and should revert back to the neutral colour | Yes |
| Dynamic shopping list banner image and text | Click on table header title or table header quantity | The banner image and text should change to match what was clicked | Yes |
|  | Insert new item to shopping list | The banner image and text should change to match what was clicked | Yes |
|  | Check the last unchecked item in a table | If another table has unchecked contents, it should open automatically, and the banner image and text should change to match | Yes |
| Editing location name | Edit location name while table is open | The location button, table header text and hero image text should all change to reflect the new location name | Yes |
|  | Edit location name while table is closed | The location button and table header text should all change to reflect the new location name | Yes |
|  | Location name alignment | Text should be aligned centre relative to header (“Select item location”) | Yes |
|  | Clicking the pencil icon | The pencil icon should change to be a tick icon and a text input field should appear | Yes |
|  | Clicking the tick icon | The tick icon should change to be a pencil icon, the text input field should disappear and the button text value should be the text that the user input | Yes |
|  | Pressing Enter key while in edit mode | Performs the same task and clicking tick icon |  |
|  | Editing a location name and refreshing the page | Refreshing the page should retain the edited location names | Yes |
|  | Resetting location names | All location names should return to their default values and this is remembered when refreshing too | Yes |
|  | Resetting location names while a table is open | The location name button, table header, and banner text should all update to reflect the change made. Banner image should already be set to the table that is open. | Yes |
|  | Typing in new location name and hitting Enter | Hitting Enter should perform the same action as clicking the tick icon to save changes | Yes |
|  | Location name and input text alignment | Location name and edit field should be centre to the parent header | No, known bug due to having to offset width of edit icon |
| Open all / Close all toggle button | Clicking the button | All tables open/close and button text/icon toggles | Yes |
|  | Importing CSV | All tables open and button toggles to show ‘Close all’ | Yes |
|  | Manually closing all tables | If open all button is clicked and user manually closes each table, the button should reflect that all tables are closed and toggle to be ‘open all’ | No - for future release |
| Email | Clicking email button | Input field and submit button are collapsed and email input field is focused | Yes |
|  | Typing in email and hitting Enter key | Hitting Enter should perform the same action as clicking Submit | Yes |
|  | Clicking Submit | Button should immediately go yellow, change text to ‘Sending’ and then turn green/red with Success/Failed text depending on whether email was successfully sent or not. | Yes |
|  | Received email | The email should be formatted to match the design of the website | Yes |
|  |  | Icons appear as images | Yes |
|  |  | Attachment of CSV is included | Yes, but not on iPhone Mail app due to restrictions |
|  |  | Email displays simplified table of shopping list items | Yes |
|  | Email provides link for those who have missing attachment | Link takes user to website, downloads file and triggers modal popup provides an option to download again or close | Yes |
|  |  | Download again button triggers redownload | Yes |
| Add new item button | Viewing Shoppr on mobile device | Add new item button should only be visible on mobile | Yes |
|  |  | Clicking button should take user to the top of the site so the item input field is visible | Yes |
| Help button | Clicking the button | Triggers a modal popup with a text guide on how Shoppr works | Yes |
|  | Clicking close | Dismisses the modal popup | Yes |
| Settings button | Clicking the button | The icon within the button changes to a down arrow and the background colour turns grey, this toggles back to the normal cog icon when the panel is clicking a second time | Yes |
|  | Clicking ‘Auto-suggest on’ | The toggle icon changes to be off, the text changes to ‘auto-suggest off’ | Yes |
|  |  | Typing in an item name will no longer be suggested | Yes |
|  |  | Selection is remembered next time you visit the site, or refresh | Yes |
|  | Clear auto-suggestions | Clicking button will reset auto-suggestions so no items are remembered until the next item is added | Yes |
|  |  | Modal popup appears indicating the suggestions have been cleared successfully | Yes |
|  |  | Settings panel is dismissed | Yes |
|  | Empty shopping list | Removes all items from shopping list | Yes |
|  |  | Changes banner/text back to default | Yes |
|  |  | Modal popup appears indicating the list has been successfully reset | Yes |
|  |  | Settings panel is dismissed | Yes |
|  | Reset item locations to default | Modal popup appears indicating the location names have been successfully reset | Yes |
|  |  | Settings panel is dismissed | Yes |
| Quantity +/- buttons | Clicking + | Quantity text increases | Yes |
|  |  | Adding item where the quantity has been increased shows the correct quantity in the table | Yes |
|  | Clicking - | Quantity text decreases | Yes |
|  |  | Adding item where the quantity has been decreased shows the correct quantity in the table | Yes |
| Clicking location buttons | Click location button with no item text inputted | Item input field shakes to indicate to user that item name is missing | Yes |
|  | Click location button with item text inputted | Adds item to the correct table | Yes |
|  |  | All tables except for the table matching the button clicked closes | Yes |
| Importing CSV | Clicking Import button | Shows file browser | Yes |
|  |  | Only accepts .csv filetype | Yes |
|  | After selecting CSV file (on mobile) | Modal popup appears indicating import was successful | Yes |
| Opens in all browsers | Launch Shoppr | Shoppr should load and operate the same in all browsers | Yes except IE11 as the JavaScript makes use of ES6, for example template literals (global usage of IE11 is 1.1%) |

#### [Click to go back to readme](/readme.md)