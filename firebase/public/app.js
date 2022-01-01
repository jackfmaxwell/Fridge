
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function dayOfWeekAsInteger(day) {
    
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday", "Saturday"];
    console.log("arg: " + day + " result: " + days[day-1]);
    return days[day-1];
}
  
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
}

//wait until login is complete
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
  


  //----------------------------------------------------- various functions
//buttons
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


groceryBtn.onclick = () => viewGrocery();
function viewGrocery(){
    groceryPage.hidden=false;
    fridgePage.hidden=true;
    recipesPage.hidden=true;
    trackerPage.hidden=true;
    expensesPage.hidden=true;

    window.scrollTo(0,document.body.scrollHeight);

    //clear then populate repeat item table
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

var fridgeUpdatePending = false;
fridgeBtn.onclick = () => viewFridge();
function viewFridge(){
    groceryPage.hidden=true;
    fridgePage.hidden=false;
    recipesPage.hidden=true;
    trackerPage.hidden=true;
    expensesPage.hidden=true;
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
    console.log("triggered");
    groceryPage.hidden=true;
    fridgePage.hidden=true;
    recipesPage.hidden=false;
    trackerPage.hidden=true;
    expensesPage.hidden=true;

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

    groceryPage.className="w3-animate-left";
    fridgePage.className="w3-animate-left";
    recipesPage.className="w3-animate-left";
    trackerPage.className="w3-animate-left";
}






//-------------------------------GROCERY PAGE-----------------------
//-----------------------------------------------------
//Update the quantity and lifespan texts
const manualInput_Quantity = document.getElementById("manualInput_quantity");
const quantityRangeInput = document.getElementById("quantityRangeInput");

quantityRangeInput.oninput=()=>updateQuantityText();
function updateQuantityText(){
    manualInput_Quantity.textContent = quantityRangeInput.value;
}
const manualInput_lifespan = document.getElementById("manualInput_lifespan");
const lifespanRangeInput  = document.getElementById("lifespanRangeInput");
lifespanRangeInput.oninput=() =>updateLifespanText();
function updateLifespanText(){
    manualInput_lifespan.textContent = lifespanRangeInput.value + " days";
}

//The two buttons for adding grocery items, manual and `repeat`
const groceryPage_repeatBtn = document.getElementById("groceryPageAddRepeatBtn");
const groceryPage_manualBtn = document.getElementById("groceryPageAddManualBtn");

//The repeat add item form
const repeatForum = document.getElementById("groceryPageRepeatForm");
groceryPage_repeatBtn.onclick = () => showRepeatForm();
function showRepeatForm(){
    repeatForum.hidden=false;
    groceryPage_manualBtn.hidden=true;
    groceryPage_repeatBtn.hidden=true;
    window.scrollTo(0,document.body.scrollHeight);
}
const repeatForumCancelBtn = document.getElementById('repeatForm_Cancel');
repeatForumCancelBtn.onclick=()=> cancelRepeatForm();
function cancelRepeatForm(){
    repeatForum.hidden=true;
    groceryPage_manualBtn.hidden=false;
    groceryPage_repeatBtn.hidden=false;
    window.scrollTo(0,document.body.scrollHeight);
}
const repeatTable = document.getElementById("repeatItemsTable");
function addItemFromRepeat() {
    // Here, `this` refers to the element the event was hooked on
    var name = this.cells[0].innerHTML; //get the name from the row we click on

    //get the doc from food collection and add to user fridge
   
    const foodlist = firebase.firestore().collection('food').get()
    .then((snapshot)=>{
        var foodlifespan=-1;
        snapshot.forEach(item=>{
            var data = item.data();
            if(data.name==name){
                //found the item
                foodlifespan = data.lifespan;
            }
        });
        if(foodlifespan!=-1){
            //we found it
            console.log(name);
            cancelRepeatForm();
            showManualForm();
            foodNameInput.value=name;
            lifespanRangeInput.value = foodlifespan;
            updateLifespanText();
        }
    });
    

   
    
}

function populateRepeatTable(){
    
    const foodlist = firebase.firestore().collection('food').get()
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
        document.querySelectorAll('#repeatItemsTable tr')
        .forEach(e => e.addEventListener("click", addItemFromRepeat));
    });

    
}



//the manual add item forum
const manualForm = document.getElementById("groceryPageManualForm");

groceryPage_manualBtn.onclick = () => showManualForm(); //toggle
function showManualForm(){
    manualForm.hidden=false;
    groceryPage_manualBtn.hidden=true;
    groceryPage_repeatBtn.hidden=true;
    window.scrollTo(0,document.body.scrollHeight);
}

//the inputs for the forum
const manualFormCancelBtn = document.getElementById("manualForm_Cancel");
const manualFormSubmitBtn = document.getElementById("manualForm_Submit");
const foodNameInput = document.getElementsByName("food name")[0];
const foodtypeInput = document.getElementsByName("food type")[0];
const foodCategoryInput = document.getElementsByName("food category")[0];
const foodQuantityInput = document.getElementById("quantityRangeInput");
const lifespanInput = document.getElementById("lifespanRangeInput");
const priceInput = document.getElementById("priceInput");

//the popup that asks if youd like to replace the item in the general pool
const groceryPopup = document.getElementById("groceryPagePopup");

manualFormCancelBtn.onclick=()=> cancelManualForm();
function cancelManualForm(){
    manualForm.hidden=true;
    groceryPage_manualBtn.hidden=false;
    groceryPage_repeatBtn.hidden=false;
    window.scrollTo(0,document.body.scrollHeight);
}

//the grocery table that shows recently added items
const groceryTable = document.getElementById("groceryItemsTable");
manualFormSubmitBtn.onclick = () => submitManualForm();
function submitManualForm(){
    //grab info from inputs
    if(foodNameInput.value == "" || foodtypeInput.value  =="" || foodCategoryInput.value =="" || foodQuantityInput.value ==""){
        //there is an missing input
        manualForm.style.backgroundColor="Red";
        setTimeout(function(){ manualForm.style.backgroundColor="Grey"}, 250);
        return;
    }
    console.log(foodNameInput.value + " " + foodtypeInput.value + " " + foodCategoryInput.value + " " + foodQuantityInput.value);

    
    //check if firebase already has this food item
    const foodQuery = firebase.firestore().collection('food').where('name', '==', foodNameInput.value).get()
    .then((snapshot)=>{
        if(snapshot.docs[0]!=undefined){
            //item already exists
            //ask user if they would like to replace the current doc
            console.log("exists");
            groceryPopup.hidden=false;
            manualForm.hidden=true;
        }
        else{
            //item doesnt exist yet
            //send to firebase 
            
            firebase.firestore().collection('food').doc(capitalizeFirstLetter(foodNameInput.value)).set({
                name: foodNameInput.value,
                lifespan: parseInt(lifespanInput.value)
            });
            
            addToGroceryTable();
        }
    });

    //add the item to the users fridge
    addFoodItemToFridge(foodNameInput.value, foodtypeInput.value, foodCategoryInput.value, foodQuantityInput.value, lifespanInput.value, priceInput.value);
    fridgeUpdatePending = true;
   
    manualForm.hidden=true;

}
//add the data to the grocery table for display of information for user to see
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

    foodQuantityInput.value=1;
    manualInput_Quantity.textContent = 1;
    groceryPage_manualBtn.hidden=false;
    groceryPage_repeatBtn.hidden=false;
    window.scrollTo(0,document.body.scrollHeight);
}

//grocery popup replace button
const groceryPopupReplace = document.getElementById("groceryPopUpReplaceBtn");
groceryPopupReplace.onclick = () => groceryPopupReplaceFnc();
function groceryPopupReplaceFnc(){
    groceryPopup.hidden=true;
    //NEED TO CHANGE THIS TO UPDATE NOT ADD
    //send to firebase 
    firebase.firestore().collection('food').doc(capitalizeFirstLetter(foodtypeInput.value)).set({
        name: foodNameInput.value,
        lifespan: parseInt(lifespanInput.value)
    });
    addToGroceryTable();
}
//grocery popup cancel button
const groceryPopupCancel = document.getElementById("groceryPopupCancelBtn");
groceryPopupCancel.onclick= () => groceryPopupCancelFnc();
function groceryPopupCancelFnc(){
    //dont replace the item, keep it in general pool, just add it to user fridge
    groceryPopup.hidden=true;
    addToGroceryTable();
}
//gets user profile from login file
var userProfile=null;
function getUserProfile(doc){

    userProfile=doc; //so we can use the userprofile later on
}

//add the item to the users fridge
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


//-----------------------------------------------------
//-------------------------------END OF GROCERY PAGE------------------------





//------------------------------FRIDGE PAGE-------------------------------------
//-----------------------------------------------------------------------------------

const fridgeTable = document.getElementById("fridgeItemsTable");
const fridgeTableBody = document.getElementById("fridgeTableBody");
function populateFridgeTable(){
    fridgeTableBody.innerHTML='';
    console.log("populating fridge");
    var fridgeItems = userProfile.ref.collection('fridge').get();
    fridgeItems.then((snapshot)=>{
        snapshot.forEach(item=>{
            let data = item.data();
            console.log("populating fridge with: ");
            console.log(data);
            
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
                swipeableElement.appendChild(quantitySpan);
                swipeableElement.appendChild(nameSpan);
                swipeableElement.appendChild(categorySpan);
                swipeableElement.appendChild(expirySpan);
                swipeContainer.appendChild(swipeableElement);
                var rightAction = document.createElement('div');
                rightAction.className = "action right";
                
                var rightAction_i = document.createElement('i');
                rightAction_i.className = "material-icons";
                rightAction_i.textContent="remove_circle";
                rightAction.appendChild(rightAction_i);
                swipeContainer.appendChild(rightAction);

                fridgeTableBody.appendChild(swipeContainer);
    
            });
           
          
        });
    });
    
}
//handle swipes for deleting fridge items
function handleSwipe() {
    // define the minimum distance to trigger the action
    const minDistance = 80;
    document.querySelectorAll('.swipe-container').forEach(e => {
        const swipeDistance = e.scrollLeft;
        console.log(swipeDistance);
        console.log(e);
        if (swipeDistance < minDistance * -1) {
            console.log("left");
        } else if (swipeDistance > minDistance) {
        console.log("swiped right");
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
       
       
        //delete the item
        
        } else {
            console.log("else");
        }
    });
    
}

  function removeItem(name){
    var foundItem = false;
    var fridgeItems = userProfile.ref.collection('fridge').get();
    fridgeItems.then((snapshot)=>{
        snapshot.forEach(item=>{
            let data = item.data();
            if(data.name == name){
                //found the item
                console.log("found it!");
                foundItem=true;
                //need to check if the item has mutliple quantities, if so, delete the closest to expiring one
                var quantities = item.ref.collection('quantities').get();
                    quantities.then((quantitiesSnapshot)=>{
                        var number_nonExpired_Quantities = 0;
                        quantitiesSnapshot.forEach(quantityItem=>{
                            number_nonExpired_Quantities+=1;
                            let quantityData = quantityItem.data();
                            var date = quantityData.expiryDate.toDate();
                            var today = new Date();
                            if(date<today){
                                //item is Expired
                                number_nonExpired_Quantities-=1;
                                quantityItem.ref.delete();
                                console.log("there is a expiry date that we can delete");
                            }
                    });
                    if(number_nonExpired_Quantities==0){
                        //we need to delete the item
                        item.ref.delete();
                        console.log("we need to delete the item");
                        populateFridgeTable();

                    }
                    else{
                      //this item hasnt expired, do you want to delete it?
                        //meal tracker should be used to take care of the case where you ate it or used in recipe
                      alert("This item hasnt expired.");
                    }
                });
                
            }
            
        });
      
    });

    
    
  }

//-----------------------------------------------------
//-------------------------------END OF FRIDGE PAGE------------------------





//------------------------------RECIPE PAGE-------------------------------------
//-----------------------------------------------------------------------------------
const myRecipes = document.getElementById("myrecipeItemsTable");
const sharedRecipesTable = document.getElementById("sharedrecipeItemsTable");

const myRecipeBtn = document.getElementById("myRecipesBtn");
myRecipeBtn.onclick = () => showMyRecipeTable();
function showMyRecipeTable(){
    sharedRecipesTable.hidden=true;
    myRecipes.hidden=false;
}
const sharedRecipeBtn = document.getElementById("sharedRecipesBtn");
sharedRecipeBtn.onclick = () => showSharedRecipesBtn();
function showSharedRecipesBtn(){
    sharedRecipesTable.hidden=false;
    myRecipes.hidden=true;
    populateRecipes();
}

const addRecipesBtn = document.getElementById('recipePageAddRecipeBtn');
addRecipesBtn.onclick = () => showAddRecipePage();
function showAddRecipePage(){
    sharedRecipesTable.hidden=true;
    myRecipes.hidden=true;
    addRecipesBtn.innerHTML = "Confirm?";
}

function populateRecipes(){
    sharedRecipesTable.innerHTML='';

    var recipes = firebase.firestore().collection('recipes').get();
    recipes.then((snapshot)=>{
        snapshot.forEach(item=>{
            let data = item.data();
            console.log(data);

            var newRow = sharedRecipesTable.insertRow();
                newRow.className = "w3-animate-bottom";
                var name = newRow.insertCell(0);
                name.innerHTML = data['recipe-name'];

            var canCreateRecipe=true;
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


const recipeHighlight_IngredientSect = document.getElementById('recipeHighlight_IngredientSect');
const recipeHighlight_InstructionSect = document.getElementById('recipeHighlight_InstructionSect');
const recipeHighlightIngredientBtn = document.getElementById('recipeHighlightIngredientBtn');
recipeHighlightIngredientBtn.onclick =() => {
    recipeHighlight_IngredientSect.hidden=false;
    recipeHighlight_InstructionSect.hidden=true;
}
const recipeHighlightInstructionBtn = document.getElementById('recipeHighlightInstructionBtn');
recipeHighlightInstructionBtn.onclick =() => {
    recipeHighlight_IngredientSect.hidden=true;
    recipeHighlight_InstructionSect.hidden=false;
}
const recipesSection = document.getElementById('recipesSection');
const recipesHighlight = document.getElementById('recipeHighlights');
function inspectRecipe(){
    var recipeName = this.cells[0].innerHTML; //get the name from the row we click on
    recipesHighlight.hidden=false;
    recipesSection.hidden=true;
    console.log(recipeName);
}
const recipeHighlight_CloseBtn = document.getElementById('recipeHighlight_CloseBtn');
recipeHighlight_CloseBtn.onclick=()=>{
    recipesHighlight.hidden=true;
    recipesSection.hidden=false;
}

  
//-----------------------------------------------------
//-------------------------------END OF RECIPE PAGE------------------------





//------------------------------CALENDER PAGE-------------------------------------
//-----------------------------------------------------------------------------------
const monthtitle = document.getElementById("monthName");
const calendar = document.getElementById("calendarBody");
function setMonthTitle(m){
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
        monthName.innerHTML = monthNames[m];
}
populateCalanderWithDays();
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

    
}
const dayHeader = document.getElementById("dayHeader");
const dayHighlight =  document.getElementById("dayHighlightPopup");
var previousClickedDayInt;
function clickHandler() {
    // Here, `this` refers to the element the event was hooked on
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    if(this.innerHTML==''){
        return;
    }

    var clickedDay = firstDay.addDays(parseInt(this.innerHTML)-1);
    var clickedDayInt = this.innerHTML;
    console.log("clicked on day " + clickedDayInt + " previous click was " + previousClickedDayInt);
    if(clickedDayInt==previousClickedDayInt){
        dayHighlightPopup.hidden=true;
        previousClickedDayInt=-1;
        return;
    }
    previousClickedDayInt = clickedDayInt;
    
    dayHeader.innerHTML = dayOfWeekAsInteger(clickedDay.getDay()+1) + " " + (clickedDay.getUTCDate());
    dayHighlightPopup.hidden=false;
}
document.querySelectorAll('#calendarBody td')
.forEach(e => e.addEventListener("click", clickHandler));

const calendarWrapper = document.getElementById("calendarSection");
const schedulePage = document.getElementById("schedulePage");
const editScheduleBtn = document.getElementById("editScheduleBtn");
editScheduleBtn.onclick = () => editScheduleButton();
function editScheduleButton(){
    var sched = schedulePage.hidden;
    sched = !sched
    schedulePage.hidden=sched;
    calendarWrapper.hidden=!sched;
    dayHighlightPopup.hidden=true;
}

