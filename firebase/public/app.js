//GENERAL FUNCTIONS
        //capitalizes the first letter of a given string
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
            //translates day of week from calendar into day string
        function dayOfWeekAsInteger(day) {
            
            var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday", "Saturday"];
            console.log("arg: " + day + " result: " + days[day-1]);
            return days[day-1];
        }
            //get date + int as a date
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
            //rounds to 2 digits (i think) TODO: check that is true
        function minTwoDigits(n) {
            return (n < 10 ? '0' : '') + n;
        }
            //designed for fridge
            //handle swipes for deleting fridge items (TODO: if we use swipe in multiple places this will not work)
        function handleSwipe() {
            const minDistance = 80; // the minimum distance to trigger the action
            //this querys all swipe containers looking at each element for a swipe interaction (TODO: make more efficent)
            document.querySelectorAll('.swipe-container').forEach(e => {
                const swipeDistance = e.scrollLeft; //get swipe distance (no right action so dont need width)
                if (swipeDistance < minDistance * -1) {
                    console.log("left");
                } 
                else if (swipeDistance > minDistance) {
                    console.log("swiped right");
                    //Try to get item name from swipe element container
                    try{
                        var itemName = e.childNodes[0].childNodes[1].textContent;
                        if(itemName!=""){
                            removeItem(itemName);
                            console.log(itemName);
                        }
                    }
                    catch(e){
                        console.log("ERROR GETTING ITEM DOC");
                    }
                
                    } 
                else {
                    console.log("not enough distance on swipe");
                }
            });
            
        }
            //designed for calendar
            //TODO: generalize this and allow multiple use cases
        function clickHandler() {
            // Here, `this` refers to the element the event was hooked on
            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            console.log("CLICKED: " + this.innerHTML);
            if(this.innerHTML==''){ 
                return; //didnt click on a day, return
            }
    
            //get a date object from the day number
            var clickedDay = firstDay.addDays(parseInt(this.innerHTML)-1);
            //the plain day number
            var clickedDayInt = this.innerHTML;
    
            /**DEBUG**/
            console.log("clicked on day " + clickedDayInt + " previous click was " + previousClickedDayInt);
            /**DEBUG**/
    
            //Clicked the same day twice so close day highlight
            if(clickedDayInt==previousClickedDayInt){
                dayHighlightPopup.hidden=true;
                previousClickedDayInt=-1;
                return;
            }
            previousClickedDayInt = clickedDayInt;
            
            //display day header and show highlight popup
            dayHeader.innerHTML = dayOfWeekAsInteger(clickedDay.getDay()+1) + " " + (clickedDay.getUTCDate());
            dayHighlightPopup.hidden=false;
        }
    
    
    //START FUNCTION
        //wait until login is complete then populate fridge table
        startFunction();
        function startFunction(){
            setTimeout(function(){
                var interval = setInterval(function() {
                    if (userProfile) {
                        contentSection.style.display="block"; topBarElement.style.display="block";
                        clearInterval(interval);
                        populateFridgeTable();
                    }
                }, 200); 
            }, 6000);
        }
        //gets user profile from login file
        var userProfile=null;
        function getUserProfile(doc){
    
            userProfile=doc; //so we can use the userprofile later on
        }
      
    
    
    //top bar buttons
        const groceryBtn = document.getElementById("grocery");
        const fridgeBtn = document.getElementById("fridge");
        const recipesBtn = document.getElementById("recipes");
        const trackerBtn = document.getElementById("tracker");
        const expensesBtn = document.getElementById("expenses");
    //pages
        const groceryPage = document.getElementById("groceryPage");
        const fridgePage = document.getElementById("fridgePage");
        const recipesPage = document.getElementById("recipesPage");
        const trackerPage = document.getElementById("trackerPage");
        const expensesPage = document.getElementById("expensesPage");
    
    //top bar functionality
    groceryBtn.onclick = () => viewGrocery();
    function viewGrocery(){
        //hide all pages except grocery
        groceryPage.hidden=false;
        fridgePage.hidden=true;
        recipesPage.hidden=true;
        trackerPage.hidden=true;
        expensesPage.hidden=true;
    
        window.scrollTo(0,0);
    
        //clear repeat table then populate repeat item table
        while(repeatItemsTable.hasChildNodes())
        {
            repeatItemsTable.removeChild(repeatItemsTable.firstChild);
        }
        populateRepeatTable();
        
        fridgePage.className="w3-animate-right";
        recipesPage.className="w3-animate-right";
        trackerPage.className="w3-animate-right";
        expensesPage.className="w3-animate-right";
    }
    fridgeBtn.onclick = () => viewFridge();
    function viewFridge(){
        groceryPage.hidden=true;
        fridgePage.hidden=false;
        recipesPage.hidden=true;
        trackerPage.hidden=true;
        expensesPage.hidden=true;
    
        window.scrollTo(0,0);
    
        if(fridgeUpdatePending){
            populateFridgeTable();
            fridgeUpdatePending=false;
        }
    
        groceryPage.className="w3-animate-left";
        recipesPage.className="w3-animate-right";
        trackerPage.className="w3-animate-right";
        expensesPage.className="w3-animate-right";
    }
    recipesBtn.onclick = () => viewRecipe();
    function viewRecipe(){
        groceryPage.hidden=true;
        fridgePage.hidden=true;
        recipesPage.hidden=false;
        trackerPage.hidden=true;
        expensesPage.hidden=true;
    
        window.scrollTo(0,0);
    
        if(sharedRecipesUpdatePending){
            populateSharedRecipes();
            sharedRecipesUpdatePending=false;
        }
    
        groceryPage.className="w3-animate-left";
        fridgePage.className="w3-animate-left";
        trackerPage.className="w3-animate-right";
        expensesPage.className="w3-animate-right";
    }
    trackerBtn.onclick = () => viewTracker();
    function viewTracker(){
        groceryPage.hidden=true;
        fridgePage.hidden=true;
        recipesPage.hidden=true;
        trackerPage.hidden=false;
        expensesPage.hidden=true;
    
        window.scrollTo(0,0);
    
        if(!loadedCalendar){
            populateCalanderWithDays();
            loadedCalendar=true;
        }
    
        groceryPage.className="w3-animate-left";
        fridgePage.className="w3-animate-left";
        recipesPage.className="w3-animate-left";
        expensesPage.className="w3-animate-right";
    }
    expensesBtn.onclick = () => viewExpenses();
    function viewExpenses(){
        groceryPage.hidden=true;
        fridgePage.hidden=true;
        recipesPage.hidden=true;
        trackerPage.hidden=true;
        expensesPage.hidden=false;
    
        window.scrollTo(0,0);
    
        groceryPage.className="w3-animate-left";
        fridgePage.className="w3-animate-left";
        recipesPage.className="w3-animate-left";
        trackerPage.className="w3-animate-left";
    }
    
    
    
    
    
    
    
    
    
    
    
    //-------------------------------GROCERY PAGE------------------------------
    //-------------------------------------------------------------------------
        //The two buttons for adding grocery items, manual and `repeat`
    const groceryPage_manualBtn = document.getElementById("groceryPageAddManualBtn");
    const groceryPage_repeatBtn = document.getElementById("groceryPageAddRepeatBtn");
        //the grocery table that shows recently added items
    const groceryTable = document.getElementById("groceryItemsTable");
        
        //GENERAL FUNCTIONALITY
            //(VISUAL) add the data to the grocery table for display of information for user to see
        function addToGroceryTable(){
            
            var newRow = groceryTable.insertRow();
            newRow.className = "w3-animate-bottom";
    
            var quantity = newRow.insertCell(0);
            quantity.innerHTML = "x" + foodQuantityInput.value;
    
            var nameValue = newRow.insertCell(1);
            nameValue.innerHTML = foodNameInput.value;
    
            var place = newRow.insertCell(2);
            place.innerHTML = capitalizeFirstLetter(foodtypeInput.value);
    
            var expiry = newRow.insertCell(3);
            var date = new Date();
            date = date.addDays(parseInt(lifespanInput.value));
            expiry.innerHTML = "Exp: " + minTwoDigits(date.getUTCMonth() + 1) + "/" + minTwoDigits(date.getUTCDate());
            
            var price = newRow.insertCell(4);
            price.innerHTML = "$" + priceInput.value;
    
            //reset input fields
            foodQuantityInput.value=1;
            manualInput_Quantity.textContent = 1;
    
            //close forms
            groceryPage_manualBtn.hidden=false;
            groceryPage_repeatBtn.hidden=false;
    
            window.scrollTo(0,0);
        }
            //(BACKEND) add the item to the users fridge database
        function addFoodItemToFridge(name, foodType, category, quantity, lifespan, price){
            //add to quantities and price history happens no matter what, and it either newly creates the collection or adds to it
            //also we can overwrite the item doc each time since the values should stay the same
            var fridgeItemDoc = userProfile.ref.collection('fridge').doc(capitalizeFirstLetter(name));
            fridgeItemDoc.set({
                name: name,
                foodType: foodType,
                category: category
            });
    
            var pricePerUnit = parseFloat(price / quantity).toFixed(2);
            var today = new Date();
            fridgeItemDoc.collection('priceHistory').add({
                price: pricePerUnit,
                purchaseDate: today,
                store: "Not specified"
            });
            var expiryDate = today.addDays(parseInt(lifespan));
            fridgeItemDoc.collection('quantities').add({
                quantity: parseInt(quantity),
                expiryDate: expiryDate
            });
        }
    
        //***********MANUAL FORM***************
        //MANUAL INPUT FIELDS
            //the inputs for the forum
        const manualFormCancelBtn = document.getElementById("manualForm_Cancel"); //cancel
        const manualFormSubmitBtn = document.getElementById("manualForm_Submit"); //submit
        const foodNameInput = document.getElementsByName("food name")[0];         //name
        const foodtypeInput = document.getElementsByName("food type")[0];         //type
        const foodCategoryInput = document.getElementsByName("food category")[0]; //category dropdown
        const foodQuantityInput = document.getElementById("quantityRangeInput");  //quantity slider
        const lifespanInput = document.getElementById("lifespanRangeInput");      //lifespan slider
        const priceInput = document.getElementById("priceInput");                 //price
            //manual input quantity text and slider
        const manualInput_Quantity = document.getElementById("manualInput_quantity");
        const quantityRangeInput = document.getElementById("quantityRangeInput");
            //manual input lifespan text and slider
        const manualInput_lifespan = document.getElementById("manualInput_lifespan");
        const lifespanRangeInput  = document.getElementById("lifespanRangeInput");
    
        //MANUAL FORM CONTAINER
        const manualForm = document.getElementById("groceryPageManualForm");
    
        //MANUAL FORM FUNCTIONALITY
            //show manual form
        groceryPage_manualBtn.onclick = () => showManualForm(); //toggle
        function showManualForm(){
            manualForm.hidden=false;
            groceryPage_manualBtn.hidden=true;
            groceryPage_repeatBtn.hidden=true;
            window.scrollTo(0,0);
        }  
            //cancel manual form
        manualFormCancelBtn.onclick=()=> cancelManualForm();
        function cancelManualForm(){
            manualForm.hidden=true;
            groceryPage_manualBtn.hidden=false;
            groceryPage_repeatBtn.hidden=false;
            window.scrollTo(0,0);
        }
            //quanity range slider
        quantityRangeInput.oninput=()=>updateQuantityText();
        function updateQuantityText(){
             manualInput_Quantity.textContent = quantityRangeInput.value;
        }
            //lifespan range slider
        lifespanRangeInput.oninput=() =>updateLifespanText();
        function updateLifespanText(){
             manualInput_lifespan.textContent = lifespanRangeInput.value + " days";
        }
            //manual form submit 
        manualFormSubmitBtn.onclick = () => submitManualForm();
        function submitManualForm(){
            //check if there is a missing input
            if(foodNameInput.value == "" || foodtypeInput.value  == "" || foodCategoryInput.value == "" || foodQuantityInput.value == ""){
                //there is an missing input, flash red 
                manualForm.style.backgroundColor="Red";
                setTimeout(function(){ manualForm.style.backgroundColor="Grey"}, 250);
                return;
            }
            
            //check if firebase general pool already has this food item (search by name)
            const foodQuery = firebase.firestore().collection('food').where('name', '==', foodNameInput.value).get()
            .then((snapshot)=>{
                if(snapshot.docs[0]!=undefined){
                    //item already exists in general pool
                    //ask user if they would like to replace the current doc
                    groceryPopup.hidden=false; //show prompt popup
                    manualForm.hidden=true;
                }
                else{
                    //item doesnt exist yet
                    //send to firebase general pool
                    
                    //create firebase doc
                    firebase.firestore().collection('food').doc(capitalizeFirstLetter(foodNameInput.value)).set({
                        name: foodNameInput.value,
                        lifespan: parseInt(lifespanInput.value)
                    });
                    
                    //add to grocery recently added table
                    addToGroceryTable();
                }
            });
    
            //add the item to the users fridge collection
            addFoodItemToFridge(foodNameInput.value, foodtypeInput.value, foodCategoryInput.value, foodQuantityInput.value, lifespanInput.value, priceInput.value);
            fridgeUpdatePending = true; //fridge page needs table updated
        
            manualForm.hidden=true; //hide manual form
    
           
    
        }
    
    
        //***********REPEAT FORM***************
        //REPEAT FORM INPUT FIELDS
        const repeatForumCancelBtn = document.getElementById('repeatForm_Cancel');
    
        //REPEAT FORM CONTAINER
        const repeatForum = document.getElementById("groceryPageRepeatForm");
        const repeatTable = document.getElementById("repeatItemsTable"); //contains the repeat items
    
        //REPEAT FORM FUNCTIONALITY
            //show repeat form
        groceryPage_repeatBtn.onclick = () => showRepeatForm();
        function showRepeatForm(){
            repeatForum.hidden=false;
            groceryPage_manualBtn.hidden=true;
            groceryPage_repeatBtn.hidden=true;
            window.scrollTo(0,0);
        }
            //cancel repeat form
        repeatForumCancelBtn.onclick = ()=> cancelRepeatForm();
        function cancelRepeatForm(){
            repeatForum.hidden=true;
            groceryPage_manualBtn.hidden=false;
            groceryPage_repeatBtn.hidden=false;
            window.scrollTo(0,0);
        }
            //select item from repeat table container and query its name then add to groceries
        function addItemFromRepeat() {
            // Here, `this` refers to the element the event was hooked on
            var name = this.cells[0].innerHTML; //get the name from the row we click on
        
            //get the doc from food collection and add to user fridge
            var foodlist = firebase.firestore().collection('food').get()
            .then((snapshot)=>{
                //find lifespan
                var foodlifespan=-1;
                snapshot.forEach(item=>{
                    var data = item.data();
                    if(data.name==name){ //found the item
                        foodlifespan = data.lifespan;
                    }
                });
                if(foodlifespan!=-1){   //we found it
                    cancelRepeatForm(); //close repeat form
                    showManualForm();   //open manual form
                    //add selected values
                    foodNameInput.value=name;
                    lifespanRangeInput.value = foodlifespan;
                    updateLifespanText(); 
                }
            });
        }
            //populate repeat table (happens on viewing page)
        function populateRepeatTable(){
            var foodlist = firebase.firestore().collection('food').get()
            .then((snapshot)=>{
                snapshot.forEach(item=>{
                    var data = item.data();
        
                    var newRow = repeatTable.insertRow();
                    newRow.className="w3-animate-bottom";
    
                    var name = newRow.insertCell();
                    name.innerHTML = data.name;
                    name.style = "width:30% !important;";
    
                    var lifespan = newRow.insertCell();
                    lifespan.innerHTML = data.lifespan;
    
                    var addButtton = newRow.insertCell();
                    addButtton.innerHTML = "Add"
                    addButtton.style="width:5%";
                });
                //add event handler to table
                document.querySelectorAll('#repeatItemsTable tr')
                .forEach(e => e.addEventListener("click", addItemFromRepeat));
            });
        
            
        }
    
    
        //***********POPUP***************
        //POPUP INPUT FIELDS
            //grocery popup replace button 
        const groceryPopupReplace = document.getElementById("groceryPopUpReplaceBtn");
            //grocery popup cancel button 
        const groceryPopupCancel = document.getElementById("groceryPopupCancelBtn");
    
        //POPUP CONTAINER
            //the popup that asks if youd like to replace the item in the general pool
        const groceryPopup = document.getElementById("groceryPagePopup");
    
        //POPUP FUNCTIONALITY
            //confirms that you want to replace the item in general pool with your values
        groceryPopupReplace.onclick = () => groceryPopupReplaceFnc();
        function groceryPopupReplaceFnc(){
            groceryPopup.hidden=true;
            //NEED TO CHANGE THIS TO UPDATE NOT ADD //TODO: CHECK IF THIS IS STILL AN ISSUE
            //send to firebase 
            firebase.firestore().collection('food').doc(capitalizeFirstLetter(foodtypeInput.value)).set({
                name: foodNameInput.value,
                lifespan: parseInt(lifespanInput.value)
            });
            addToGroceryTable();    //adds to grocery recently purchased food table
        }
            //dont replace item in general pool
        groceryPopupCancel.onclick = () => groceryPopupCancelFnc();
        function groceryPopupCancelFnc(){
            //dont replace the item, keep it in general pool
            groceryPopup.hidden=true;
            addToGroceryTable();    //adds to grocery recently purchased food table
        }
    
    //-------------------------------------------------------------------------
    //-------------------------------END OF GROCERY PAGE-----------------------
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //------------------------------FRIDGE PAGE--------------------------------
    //-------------------------------------------------------------------------
        //variable for cacheing updates (only update table if needed) 
    var fridgeUpdatePending = false; //referenced in the top navigation bar fridge button
    
        //FRIDGE INPUT FIELDS
            //TODO: this is where the sorting options will go
    
        //FRIDGE CONTAINERS
            //fridge table 
        const fridgeTable = document.getElementById("fridgeTableBody");
    
        //FRIDGE FUNCTIONALITY
            //populate fridge table (VISUAL) with user food database data (BACKEND)
        function populateFridgeTable(){
            fridgeTable.innerHTML=''; //reset the fridge table
            //query the database
            var fridgeItems = userProfile.ref.collection('fridge').get();
            fridgeItems.then((snapshot)=>{
                snapshot.forEach(item=>{
                    let data = item.data();
                    //**DEBUG**/
                    console.log("populating fridge with: ");
                    console.log(data);
                    /**DEBUG**/
                    
                    //Find the total quantity and the soonest expiry date (to display) at the same time
                    var totalQuantity = 0;
                    let today = new Date();
                    let soonestExpiryDate = new Date(today);
                    soonestExpiryDate.setDate(soonestExpiryDate.getDate()+99); //future dates are > past dates
                    
                    var quantities = item.ref.collection('quantities').get();
                    quantities.then((quantitiesSnapshot)=>{
                        quantitiesSnapshot.forEach(quantityItem=>{
                            let quantityData = quantityItem.data();
                            totalQuantity = totalQuantity + quantityData.quantity;
                            //compare the expiry Date
                            let expiryDate = quantityData.expiryDate.toDate();
                            if(expiryDate<soonestExpiryDate){
                                soonestExpiryDate = (expiryDate);
                            }
                        
                        });
                        
                        //create the table row as a swipe element 
                        var swipeContainer = document.createElement('div');
                        swipeContainer.className = "swipe-container w3-animate-bottom";
                        swipeContainer.ontouchend = handleSwipe;
    
                        var swipeableElement = document.createElement('div');
                        swipeableElement.className = "swipe-element";
    
                        var quantitySpan = document.createElement('span');
                        quantitySpan.className = "swipe-element-spans";
                        quantitySpan.style.left="0";
                        quantitySpan.style.paddingLeft="8px";
                        quantitySpan.style.fontSize="16px";
                        quantitySpan.textContent="x" + totalQuantity;
    
                        var nameSpan = document.createElement('span');
                        nameSpan.className ="swipe-element-spans";
                        nameSpan.style.fontSize="18px";
                        nameSpan.style.marginLeft="32px";
                        nameSpan.style.lineHeight="80%";
                        nameSpan.textContent = data.name;
    
                        var categorySpan = document.createElement('span');
                        categorySpan.className = "swipe-element-spans";
                        categorySpan.style.marginLeft="175px";
                        categorySpan.textContent = capitalizeFirstLetter(data.category);
                    
                        var expirySpan = document.createElement('span');
                        expirySpan.className="swipe-element-spans";
                        expirySpan.style.right="0";
                        expirySpan.style.marginRight = "22px";
                        expirySpan.textContent = "Exp: "+ minTwoDigits(soonestExpiryDate.getUTCMonth() + 1) + "/" + minTwoDigits(soonestExpiryDate.getUTCDate());
                        
                        //change colour and text of expiry date based on how soon the expiry is
                        if(soonestExpiryDate<today){
                            expirySpan.textContent="Expired!";
                            expirySpan.className="swipe-element-spans Exp_Red";
                            swipeContainer.style.backgroundColor="#eda6a6";
                        }
                        //if item expires today or tmr, color text red
                        else if(soonestExpiryDate<today.addDays(1)){
                            expirySpan.className="swipe-element-spans Exp_Red";
                        }
                        
                        //if item expires today, or next 3 days, color text orange/yellow
                        else if (soonestExpiryDate<today.addDays(2)){
                            expirySpan.className="swipe-element-spans Exp_Yellow";
                        }
                        else{
                            expirySpan.className="swipe-element-spans Exp_Green";
                        }
    
                        //add all the elements to the swipeable element
                        swipeableElement.appendChild(quantitySpan);
                        swipeableElement.appendChild(nameSpan);
                        swipeableElement.appendChild(categorySpan);
                        swipeableElement.appendChild(expirySpan);
    
                        swipeContainer.appendChild(swipeableElement);
    
                        //add right action to swipe element
                        var rightAction = document.createElement('div');
                        rightAction.className = "action right";
                        
                        var rightAction_i = document.createElement('i');
                        rightAction_i.className = "material-icons";
                        rightAction_i.textContent="remove_circle";
                        rightAction.appendChild(rightAction_i);
                        swipeContainer.appendChild(rightAction);
    
                        fridgeTable.appendChild(swipeContainer); //add the entire swipe element to the fridge table
            
                    });
                
                
                });
            });
            
        }
            //remove item from fridge database (BACKEND) Then update the (VISUAL) called by swipe event
        function removeItem(name){
            var foundItem = false; 
            //query the db
            var fridgeItems = userProfile.ref.collection('fridge').get();
            fridgeItems.then((snapshot)=>{
                snapshot.forEach(item=>{
                    let data = item.data();
    
                    if(data.name == name){
                        //found the item
                        foundItem=true;
                        var deletedQuan=false;
                        //need to check if the item has mutliple quantities, if so, delete any of the quantities that have expired
                        var quantities = item.ref.collection('quantities').get();
                            quantities.then((quantitiesSnapshot)=>{
    
                                var number_nonExpired_Quantities = 0;
                                quantitiesSnapshot.forEach(quantityItem=>{
                                    number_nonExpired_Quantities+=1; //possibly found a non expired quantity
    
                                    //check if its expired, if so, -=1 
                                    let quantityData = quantityItem.data();
                                    var date = quantityData.expiryDate.toDate();
                                    var today = new Date();
                                    if(date<today){
                                        //item is Expired
                                        number_nonExpired_Quantities-=1;
                                        quantityItem.ref.delete(); //delete the quantity doc
                                        deletedQuan=true;
                                    }
                                });
                            if(number_nonExpired_Quantities==0){
                                //all the quantities have expired we need to delete the entire item
                                item.ref.delete();      //TODO: check this is actually removing the doc on firebase (may need to delete collections first)
                                populateFridgeTable();  //update VISUAL table
    
                            }
                            //there is a non expired quantity left
                            else{
                            //this item hasnt expired, do you want to delete it?
                                //meal tracker should be used to take care of the case where you ate it or used in recipe
                                //TODO: check this is the behaviour we actually want 
                                if(deletedQuan){return;}
                                let numQuanDeleted=0;
                                let totalQuan=0;
                                quantitiesSnapshot.forEach(quantityItem=>{
                                        totalQuan+=1;
                                        if(numQuanDeleted==0){
                                            number_nonExpired_Quantities-=1;
                                            quantityItem.ref.delete(); //just delete a quantity doc
                                            numQuanDeleted=1;
                                        }   
                                });
                                if(totalQuan==numQuanDeleted){
                                    //non left
                                    item.ref.delete();      //TODO: check this is actually removing the doc on firebase (may need to delete collections first)
                                    
                                }
                                populateFridgeTable();  //update VISUAL table
                            }
                        });
                        
                    }
                    
                });
            
            });
    
            
            
        }
    
    //-------------------------------------------------------------------------
    //-------------------------------END OF FRIDGE PAGE------------------------
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //------------------------------RECIPE PAGE--------------------------------
    //-------------------------------------------------------------------------
        //variable for caching updates
    var sharedRecipesUpdatePending=true;
        //variable for the dual functionality of add recipe and confirm recipe button
    var confirmRecipeArmed=false;

    var addingNewInstruction=false;
    var addingNewIngredient=false;
    
        //my recipes button (shows the user recipes table)
    const myRecipeBtn = document.getElementById("myRecipesBtn");
        //shared recipes button (shows the shared recipes table)
    const sharedRecipeBtn = document.getElementById("sharedRecipesBtn");
        //add recipes button (at the bottom of the page)
    const addRecipesBtn = document.getElementById('recipePageAddRecipeBtn');
        //recipes container (holds my recipes shared recipes table and add recipe form)
    const recipesSection = document.getElementById('recipesSection');
    
        //GENERAL FUNCTIONALITY
            //populate shared recipes table
        function populateSharedRecipes(){
            sharedRecipesTable.innerHTML='';
        
            var recipes = firebase.firestore().collection('recipes').get();
            recipes.then((snapshot)=>{
                snapshot.forEach(item=>{
                    let data = item.data();
                    console.log(data);
                    let recipeName = (item.id).replaceAll("-", " ");
        
                    var newRow = sharedRecipesTable.insertRow();
                        newRow.className = "w3-animate-bottom";
                        var name = newRow.insertCell(0);
                        name.innerHTML = recipeName
        
                    var canCreateRecipe=true;
                    //look through the ingredients
                    var ingredients = item.ref.collection('ingredients').get();
                    ingredients.then((snapshot2)=>{
                        snapshot2.forEach(ingredient=>{
                            //ingredient is the individual ingredients of the recipe
                            var IngredientData = ingredient.data();
                            var foundThisIngredient = false;
                            var fridgeItems = userProfile.ref.collection('fridge').get();
                            fridgeItems.then((snapshot)=>{
                                snapshot.forEach(item=>{
                                    let data = item.data();
                                    if(IngredientData.name==data.name){
                                        foundThisIngredient=true;
                                    }
                                });
                            });
                            if(foundThisIngredient==false){
                                console.log("we are missing an indredient to make this recipe");
                                canCreateRecipe=false;
                            }
                            //console.log(ingredient.data().name);
                        });
                        if(canCreateRecipe==false){
                            newRow.style.backgroundColor="#eda6a6";
                            newRow.className="w3-animate-bottom Exp_Red";
                        }
                        else{
                            //we can make this!
                            newRow.style.backgroundColor="#bffabd";
                            newRow.className="w3-animate-bottom Exp_Green";
                        }
                    });
        
                   
                    
                });
                document.querySelectorAll('#sharedrecipeItemsTable tr')
                .forEach(e => e.addEventListener("click", inspectRecipe));
            });
            recipeHighlight_IngredientSect.hidden=true;
            recipeHighlight_InstructionSect.hidden=false;   
        }
            //get input on recipes table rows to show recipe details to show recipe highlight page
        function inspectRecipe(){
            var recipeName = this.cells[0].innerHTML; //get the name from the row we click on
            recipesHighlight.hidden=false;
            recipesSection.hidden=true;
            addRecipesBtn.hidden=true;

            recipeHighlight_NameText.innerHTML = recipeName;
            //search recipe
            let docName = recipeName.replaceAll(" ", "-");
            var recipe = firebase.firestore().collection('recipes').doc(docName).collection('ingredients').get().then((snapshot)=>{
                console.log(snapshot.data());
            });

            /**DEBUG**/
            console.log(recipeName);
             /**DEBUG**/
        }
    
    
        //******MY RECIPES**********
        //MY RECIPES INPUT FIELDS
    
        //MY RECIPES CONTAINERS
            //table for user recipes data
        const myRecipes = document.getElementById("myrecipeItemsTable");
    
        //MY RECIPES FUNCTIONALITY
            //shows the my recipe table
        myRecipeBtn.onclick = () => showMyRecipeTable();
        function showMyRecipeTable(){
            sharedRecipesTable.hidden=true;
            myRecipes.hidden=false;
        }
    
    
        //******SHARED RECIPES******
        //SHARED RECIPES INPUT FIELDS
    
        //SHARED RECIPES CONTAINERS
            //table for shared recipes data
        const sharedRecipesTable = document.getElementById("sharedrecipeItemsTable");
    
        //SHARED RECIPES FUNCTIONALITY
            //shows shared recipes table
        sharedRecipeBtn.onclick = () => showSharedRecipesBtn();
        function showSharedRecipesBtn(){
            sharedRecipesTable.hidden=false;
            myRecipes.hidden=true;
        }
    
    
        //******ADD RECIPE FORM*******
        //ADD RECIPE FORM INPUT FIELDS
        const editInstructionsBtn = document.getElementById("editInstructionsBtn");
        const editIngredientsBtn = document.getElementById("editIngredientsBtn");
        const addIngredientBtn = document.getElementById("addIngredientBtn");
        const addInstructionBtn = document.getElementById("addInstructionBtn");
        const newrecipename = document.getElementById("newrecipename");
        const closeAddRecipeBtn = document.getElementById("closeAddRecipeSection");
         
            //add ingredient input fields
        const newingredientamount = document.getElementsByName("newIngredient_amt")[0];
        const newingredientmeasurement = document.getElementsByName("newIngredient_measurement")[0];
        const newingredientname = document.getElementsByName("newIngredient_name")[0];
         
            //add instruction input fields
        const newinstruction_text = document.getElementsByName("newinstruction")[0];
       
       
        //ADD RECIPE FORM CONTAINERS
        const addReicpeSection = document.getElementById("addRecipeSection");
        const ingredientListContainer = document.getElementById("ingredientsList");
        const ingredientForm = document.getElementById("ingredientForm");
        const instructionsListContainer = document.getElementById("instructionsList");
        const instructionForm = document.getElementById("instructionForm");

        //ADD RECIPE FORM FUNCTIONALITY
            //show the add recipe form
        addRecipesBtn.onclick = () => addRecipeConfirmRecipe();
        function addRecipeConfirmRecipe(){
            if(confirmRecipeArmed){
                //CHECK IF ALL VARS ARE FILLED OUT THEN UPLOAD TO FIREBASE (BACKEND) AND UPDATE TABLE (VISUAl)
                //TODO: ^
                var recipeName = newrecipename.value;
                var fridgeItemDoc = userProfile.ref.collection('fridge').doc(capitalizeFirstLetter(recipeName));
                
                sharedRecipesTable.hidden=true;
                myRecipes.hidden=false;
                //show the shared recipes and my recipes buttons
                myRecipesBtn.hidden=false;
                sharedRecipeBtn.hidden=false;
                addRecipesBtn.innerHTML = "Add Recipe"; //change the add recipes button to confirm add the recipe
                confirmRecipeArmed=false;
                addReicpeSection.hidden=true;
            }
            else{
                confirmRecipeArmed=true;
                //hide the shared recipes and my recipes tables
                sharedRecipesTable.hidden=true;
                myRecipes.hidden=true;
                //hide the shared recipes and my recipes buttons
                myRecipesBtn.hidden=true;
                sharedRecipeBtn.hidden=true;

                addReicpeSection.hidden=false;
    
                addRecipesBtn.innerHTML = "Confirm?"; //change the add recipes button to confirm add the recipe
            }
            
        }
        editInstructionsBtn.onclick = () => {
            instructionsListContainer.hidden=false;
            ingredientListContainer.hidden=true;
            editIngredientsBtn.hidden=false;
            editInstructionsBtn.hidden=true;
            addInstructionBtn.hidden=false; //
            addIngredientBtn.hidden=true; //
        }
        editIngredientsBtn.onclick=()=>{
            instructionsListContainer.hidden=true;
            ingredientListContainer.hidden=false;
            editIngredientsBtn.hidden=true;
            editInstructionsBtn.hidden=false;
            addInstructionBtn.hidden=true;
            addIngredientBtn.hidden=false;
        }
        addIngredientBtn.onclick = () => addIngredientConfirmIngredient();
        function addIngredientConfirmIngredient(){
            if(addingNewIngredient){
                //confirm ingredient add
                var amount = newingredientamount.value;
                var measurement = newingredientmeasurement.value;
                var name = newingredientname.value;
                if(amount=="" || measurement=="" || name==""){
                    console.log("MISSING AN INPUT");
                    return;
                }
                //get the table
                const ingredientTable=ingredientListContainer.getElementsByClassName("items")[0];
                var swipeContainer = document.createElement('div');
                swipeContainer.className = "swipe-container w3-animate-bottom";
                swipeContainer.ontouchend = handleSwipe;

                var swipeableElement = document.createElement('div');
                swipeableElement.className = "swipe-element";

                var quantitySpan = document.createElement('span');
                quantitySpan.className = "swipe-element-spans";
                quantitySpan.style.left="0";
                quantitySpan.style.paddingLeft="8px";
                quantitySpan.style.fontSize="16px";
                quantitySpan.textContent= amount;

                var measurementSpan = document.createElement('span');
                measurementSpan.className ="swipe-element-spans";
                measurementSpan.style.fontSize="18px";
                measurementSpan.style.marginLeft="32px";
                measurementSpan.style.lineHeight="80%";
                measurementSpan.textContent = measurement;
            
                var nameSpan = document.createElement('span');
                nameSpan.className="swipe-element-spans";
                nameSpan.style.right="0";
                nameSpan.style.marginRight = "22px";
                nameSpan.textContent = name;
                

                //add all the elements to the swipeable element
                swipeableElement.appendChild(quantitySpan);
                swipeableElement.appendChild(measurementSpan);
                swipeableElement.appendChild(nameSpan);

                swipeContainer.appendChild(swipeableElement);

                //add right action to swipe element
                var rightAction = document.createElement('div');
                rightAction.className = "action right";
                
                var rightAction_i = document.createElement('i');
                rightAction_i.className = "material-icons";
                rightAction_i.textContent="remove_circle";
                rightAction.appendChild(rightAction_i);
                swipeContainer.appendChild(rightAction);

                ingredientTable.appendChild(swipeContainer); //add the entire swipe element to the fridge table
                
                addIngredientBtn.innerHTML = "Add Ingredient";
                ingredientForm.hidden=true;
                addingNewIngredient=false;

            }
            else{
                ingredientForm.hidden=false;
                addIngredientBtn.innerHTML = "Confirm Ingredient?"
                addingNewIngredient=true;
            }
        }
        addInstructionBtn.onclick = () => addInstructionConfirmInstruction();
        function addInstructionConfirmInstruction(){
            if(addingNewInstruction){
                //confirm ingredient add
                var instruction = newinstruction_text.value;
                if(instruction==""){
                    console.log("MISSING AN INPUT");
                    return;
                }
                //get the table
                const instructionTable=instructionsListContainer.getElementsByClassName("items")[0];
                var swipeContainer = document.createElement('div');
                swipeContainer.className = "swipe-container w3-animate-bottom";
                swipeContainer.ontouchend = handleSwipe;

                var swipeableElement = document.createElement('div');
                swipeableElement.className = "swipe-element";

                var instructionSpan = document.createElement('span');
                instructionSpan.className = "swipe-element-spans";
                instructionSpan.style.left="0";
                instructionSpan.style.paddingLeft="8px";
                instructionSpan.style.fontSize="16px";
                instructionSpan.textContent= instruction;

                //add all the elements to the swipeable element
                swipeableElement.appendChild(instructionSpan);

                swipeContainer.appendChild(swipeableElement);

                //add right action to swipe element
                var rightAction = document.createElement('div');
                rightAction.className = "action right";
                
                var rightAction_i = document.createElement('i');
                rightAction_i.className = "material-icons";
                rightAction_i.textContent="remove_circle";
                rightAction.appendChild(rightAction_i);
                swipeContainer.appendChild(rightAction);

                instructionTable.appendChild(swipeContainer); //add the entire swipe element to the fridge table
                
                addInstructionBtn.innerHTML = "Add Instruction";
                instructionForm.hidden=true;
                addingNewInstruction=false;

            }
            else{
                instructionForm.hidden=false;
                addInstructionBtn.innerHTML = "Confirm Instruction?"
                addingNewInstruction=true;
            }
        }
        closeAddRecipeBtn.onclick = () => {
            sharedRecipesTable.hidden=true;
                myRecipes.hidden=false;
                //show the shared recipes and my recipes buttons
                myRecipesBtn.hidden=false;
                sharedRecipeBtn.hidden=false;
                addRecipesBtn.innerHTML = "Add Recipe"; //change the add recipes button to confirm add the recipe
                confirmRecipeArmed=false;
                addReicpeSection.hidden=true;

        }
        

    
    
        //*****RECIPE HIGHLIGHT PAGE*****
        //RECIPE HIGHLIGHT INPUT FIELDS
            //recipe highlight close button
        const recipeHighlight_CloseBtn = document.getElementById('recipeHighlight_CloseBtn');
            //view ingredients table
        const recipeHighlightIngredientBtn = document.getElementById('recipeHighlightIngredientBtn');
            //view instructions table
        const recipeHighlightInstructionBtn = document.getElementById('recipeHighlightInstructionBtn');
        const recipeHighlight_NameText = document.getElementById('recipeHighlightName');
    
        //RECIPE HIGHLIGHT CONTAINERS
            //recipe highlight container
        const recipesHighlight = document.getElementById('recipeHighlights');
            //ingredients table
        const recipeHighlight_IngredientSect = document.getElementById('recipeHighlight_IngredientSect');
            //instructions table
        const recipeHighlight_InstructionSect = document.getElementById('recipeHighlight_InstructionSect');
    
        //RECIPE HIGHLIGHT FUNCTIONALITY
            //show ingredients table
        recipeHighlightIngredientBtn.onclick =() => {
            recipeHighlight_IngredientSect.hidden=false;
            recipeHighlight_InstructionSect.hidden=true;
        }
            //show instructions table
        recipeHighlightInstructionBtn.onclick =() => {
            recipeHighlight_IngredientSect.hidden=true;
            recipeHighlight_InstructionSect.hidden=false;
        }  
            //close recipe highlight page
        recipeHighlight_CloseBtn.onclick=()=>{
            recipesHighlight.hidden=true;  //highlight section
            recipesSection.hidden=false; //general section
            addRecipesBtn.hidden=false;
        }
      
    //-------------------------------------------------------------------------
    //-------------------------------END OF RECIPE PAGE------------------------
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //------------------------------CALENDER PAGE----------------------------------------
    //-----------------------------------------------------------------------------------
        //month name
    const monthtitle = document.getElementById("monthName");
        //have we loaded the calendar yet
    var loadedCalendar=false;
        //stores the previously clicked day to see if user pressed the same day twice (trigger close highlight)
    var previousClickedDayInt;
        //bool for if schedules page is open
    var schedulePageOpen=false;
    
        //CALENDAR INPUT FIELDS
        //CALENDAR CONTAINERS
                //calendar body 
        const calendar = document.getElementById("calendarBody");
            //calendar section including calendar body and highlight
        const calendarWrapper = document.getElementById("calendarSection");
    
        //CALENDAR FUNCTIONALITY
            //on loading calendar set the title
        function setMonthTitle(m){
            const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
                monthName.innerHTML = monthNames[m];
        }
        function populateCalanderWithDays(){
            //JS CALENDARS COUNT SUN,MON,TUE,WED,THU,FRI,SAT
            //                   0,1,2,3,4,5,6
            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y,m+1, 0);
        
            setMonthTitle(m);
        
            var currentRow = calendar.insertRow(0);
            var dayOfWeek = firstDay.getDay();
            for(let i = 0; i<dayOfWeek-1; i++){
                let blankCell = currentRow.insertCell();
                blankCell.innerHTML = "";
            }
            var firstCell = currentRow.insertCell();
            let numberOfMonth = 1;
            let weekIndex = dayOfWeek; //this counts up to 7 then tells the loop to go to a new row
            
            //Set the first day of the month
            firstCell.innerHTML = numberOfMonth;
            numberOfMonth = numberOfMonth+1;
            weekIndex = weekIndex+1;
        
            while(numberOfMonth<=parseInt(lastDay.getUTCDate())){
                let newCell = currentRow.insertCell();
                newCell.innerHTML = numberOfMonth;
                numberOfMonth = numberOfMonth+1;
                weekIndex = weekIndex+1;
        
                if(weekIndex==8){
                    weekIndex=1;
                    currentRow = calendar.insertRow();
                }
        
                
                
        
            }
            if(weekIndex!=7){
                //then there is missing spots at end of month
                while(weekIndex<8){
                    let newCell = currentRow.insertCell();
                    newCell.innerHTML = "";
                    weekIndex+=1;
                }
            }
        
             //add click handler event to all calendar days
            document.querySelectorAll('#calendarBody td')
            .forEach(e => e.addEventListener("click", clickHandler));
        }

       
    
    
        //******DAY HIGHLIGHT******
            //day header (day of week + day of month)
        const dayHeader = document.getElementById("dayHeader");
        //DAY HIGHLIGHT INPUT FIELDS
    
        //DAY HIGHLIGHT CONTAINERS
            //day highlight container
        const dayHighlight =  document.getElementById("dayHighlightPopup");
    
        //DAY HIGHLIGHT FUNCTIONALITY
    
        
        //******SCHEDULES PAGE*******
        //SCHEDULES PAGE INPUT FIELDS
        const editScheduleBtn = document.getElementById("editScheduleBtn");
        
        //SCHEDULES PAGE CONTAINERS
        const schedulePage = document.getElementById("schedulePage");
        
        //SCHEDULES PAGE FUNCTIONALITY
        editScheduleBtn.onclick = () => editScheduleButton();
        function editScheduleButton(){
            schedulePageOpen = !schedulePageOpen;
            schedulePage.hidden=schedulePageOpen;
            calendarWrapper.hidden=!schedulePageOpen;
            dayHighlightPopup.hidden=true;
        }
    
    //-------------------------------------------------------------------------
    //------------------------------END OF CALENDER PAGE-----------------------
    