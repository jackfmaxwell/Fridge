   
    //fridge table
const fridgeTable = document.getElementById('tbody'); //so i can add rows when querying db
const fridgeTableItemLookup = document.getElementById('foodLookUp');
const ItemLookupQuantityTable = document.getElementById('foodLookUp_quantities');
const ItemLookupPriceHistoryTable = document.getElementById('foodLookUp_priceHistory');

const closeFoodPopup = document.getElementById('closeFoodLookUp');
closeFoodPopup.onclick = () => closeFoodLookupFunction();
function closeFoodLookupFunction(){
    fridgeTableItemLookup.hidden=true;
}

// The fridge page food group dropdown
var fridgeSortingActive = false;
//fruit
const fruitFoodGroupButton = document.getElementById('fridgeFoodGroupDropDownFruit');
fruitFoodGroupButton.onclick = () => sortFridgeByFoodGroup("fruit");
//vegetable
const vegetableFoodGroupButton = document.getElementById('fridgeFoodGroupDropDownVegetable');
vegetableFoodGroupButton.onclick = () => sortFridgeByFoodGroup("vegetable");
//grain
const grainFoodGroupButton = document.getElementById('fridgeFoodGroupDropDownGrain');
grainFoodGroupButton.onclick = () => sortFridgeByFoodGroup("grain");
//dairy
const dairyFoodGroupButton = document.getElementById('fridgeFoodGroupDropDownDairy');
dairyFoodGroupButton.onclick = () => sortFridgeByFoodGroup("dairy");
//meat
const meatFoodGroupButton = document.getElementById('fridgeFoodGroupDropDownMeat');
meatFoodGroupButton.onclick = () => sortFridgeByFoodGroup("meat");
//nuts
const nutsFoodGroupButton = document.getElementById('fridgeFoodGroupDropDownNuts');
nutsFoodGroupButton.onclick = () => sortFridgeByFoodGroup("nuts");
//sweets 
const sweetsFoodGroupButton = document.getElementById('fridgeFoodGroupDropDownSweets');
sweetsFoodGroupButton.onclick = () => sortFridgeByFoodGroup("sweets");


function sortFridgeByFoodGroup(foodGroup){
    fridgeSortingActive=true;
    if(!userProfile.exists){
        console.log("CRITICAL ERROR COULDNT FIND USER PROFILE");
    }
    else{
        fridgeTable.innerHTML = '';
        const fridge = userProfile.ref.collection('fridge').where('foodType', '==', foodGroup).get()
        .then((fridgeItems)=>{
            fridgeItems.forEach(item=>{
                let data = item.data();
                let table = fridgeTable;
                
                //create the row
                let row = `<tr>
                                <td>${data.name}</td>
                                <td>${data.totalQuantity}</td>
                            </tr>`;
                table.innerHTML += (row); //add the row to the table
                addRowHandlers(); //re add the click handler (innerHTML+= erases all existing DOM elements)
            })
        });
        //add event listener to table
        addRowHandlers();
    }

}
const resetFridgeSortButton = document.getElementById('resetFridgeSort');
resetFridgeSortButton.onclick = () => resetFridgeSort(userProfile);
function resetFridgeSort(doc){
    if(fridgeSortingActive){
        fridgeTable.innerHTML = '';
        displayUserFridge(doc);
        fridgeSortingActive=false;
    }
   
    
}

const fridgeCategoryButton = document.getElementById('fridgeCategoryDropDownFridge');
fridgeCategoryButton.onclick = () => sortFridgeByCategory("fridge");
const freezerCategoryButton = document.getElementById('fridgeCategoryDropDownFreezer');
freezerCategoryButton.onclick = () => sortFridgeByCategory("freezer");
const pantryCategoryButton = document.getElementById('fridgeCategoryDropDownPantry');
pantryCategoryButton.onclick = () => sortFridgeByCategory("pantry");
function sortFridgeByCategory(category){
    fridgeSortingActive=true;
    if(!userProfile.exists){
        console.log("CRITICAL ERROR COULDNT FIND USER PROFILE");
    }
    else{
        fridgeTable.innerHTML = '';
        const fridge = userProfile.ref.collection('fridge').where('category', '==', category).get()
        .then((fridgeItems)=>{
            fridgeItems.forEach(item=>{
                let data = item.data();
                let table = fridgeTable;
                
                //create the row
                let row = `<tr>
                                <td>${data.name}</td>
                                <td>${data.totalQuantity}</td>
                            </tr>`;
                table.innerHTML += (row); //add the row to the table
                addRowHandlers(); //re add the click handler (innerHTML+= erases all existing DOM elements)
            })
        });
        //add event listener to table
        addRowHandlers();
    }
}

const leftoversMealsButton = document.getElementById('fridgeMealsDropDownLeftovers');
leftoversMealsButton.onclick = () => sortFridgeByMeal("meal");
const fastFoodMealsButton = document.getElementById('fridgeMealsDropDownFastFood');
fastFoodMealsButton.onclick = () => sortFridgeByMeal("fast food");
const frozenMealsButton = document.getElementById('fridgeMealsDropDownFrozenMeal');
frozenMealsButton.onclick = () => sortFridgeByMeal("frozen meal");

function sortFridgeByMeal(mealType){
    fridgeSortingActive=true;
    if(!userProfile.exists){
        console.log("CRITICAL ERROR COULDNT FIND USER PROFILE");
    }
    else{
        fridgeTable.innerHTML = '';
        const fridge = userProfile.ref.collection('fridge').where('foodType', '==', mealType).get()
        .then((fridgeItems)=>{
            fridgeItems.forEach(item=>{
                let data = item.data();
                let table = fridgeTable;
                
                //create the row
                let row = `<tr>
                                <td>${data.name}</td>
                                <td>${data.totalQuantity}</td>
                            </tr>`;
                table.innerHTML += (row); //add the row to the table
                addRowHandlers(); //re add the click handler (innerHTML+= erases all existing DOM elements)
            })
        });
        //add event listener to table
        addRowHandlers();
    }
}

const expiredExpiringButton = document.getElementById('fridgeExpiringDropDownExpired');
expiredExpiringButton.onclick = () => sortByExpiring();
function sortByExpiring(){
    fridgeSortingActive=true;
    if(!userProfile.exists){
        console.log("CRITICAL ERROR COULDNT FIND USER PROFILE");
    }
    else{
        fridgeTable.innerHTML = '';
        
        var includedItem = false;
        const fridge = userProfile.ref.collection('fridge').get()
        .then((fridgeItems)=>{
            fridgeItems.forEach(item=>{
                //for each item find the smallest expiry date
                // and then check if its less than the current date
                includedItem = false;
                item.ref.collection('quantities').where('expiryDate','<', new Date()).get() //if the epiry date is less than the current date
                    .then((quantitiesObject)=>{
                        if(quantitiesObject.docs[0] != undefined){
                            console.log(quantitiesObject.docs[0].data());
                            //there will be no for each if the quantities object has no objects
                            let data = item.data();
                            let table = fridgeTable;
                            
                            //create the row
                            let row = `<tr>
                                            <td>${data.name}</td>
                                            <td>${quantitiesObject.docs[0].data().quantity}</td>
                                        </tr>`;
                            table.innerHTML += (row); //add the row to the table
                            addRowHandlers(); //re add the click handler (innerHTML+= erases all existing DOM elements)
                            includedItem=true;
                        
                        }
                        
                    })
            })
        });
        //add event listener to table
        addRowHandlers();
    }
}
//-----------------------------------------------------------------
var userProfile = null;
function displayUserFridge(doc){
    userProfile = doc;

    const fridge = doc.ref.collection('fridge').get()
        .then((fridgeItems)=>{
            fridgeItems.forEach(item=>{
                let data = item.data();
                let table = fridgeTable;
                
                //create the row
                let row = `<tr>
                                <td>${data.name}</td>
                                <td>${data.totalQuantity}</td>
                            </tr>`;
                table.innerHTML += (row); //add the row to the table
                addRowHandlers(); //re add the click handler (innerHTML+= erases all existing DOM elements)
            })
        });
    //add event listener to table
    addRowHandlers();
}

//add row handler for table
function addRowHandlers() {
    var table = document.getElementById("tableId"); //get table element
    var rows = table.getElementsByTagName("tr"); //get row element
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i]; //get the current row
        //create the click handler
        var createClickHandler = 
            function(row) 
            {
                return function() { 
                                        var cell = row.getElementsByTagName("td")[0]; //get data element (get first element (name))
                                        var foodname = cell.innerHTML; //get the name from the cell
                                        //when we click on the row with food name = name
                                        queryUserFridge_forItem(foodname)
                                 };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}

google.charts.load('current', {'packages':['scatter']});

function drawPriceChart(priceHistoryObject, foodItemName){
    
    var data = new google.visualization.DataTable();

    //get the columns
    var initPriceObject = priceHistoryObject.docs[0].data();
      
    data.addColumn('number', 'Date')
    data.addColumn('number', initPriceObject.store)
    
    let stores = [initPriceObject.store];
    priceHistoryObject.forEach(priceObj=>{
        var priceData = priceObj.data();
        if(!stores.includes(priceData.store)){ //if we arent already tracking this store
            //add it to the graph and to the array
            data.addColumn('number', priceData.store);
            stores.push(priceData.store);
        }
    });

    //the number of columns is size of stores

    //build the multi dimensional data array
    priceHistoryObject.forEach(priceObj=>{
        let dataArray = [];
        var priceData = priceObj.data();

        dataArray.push(priceData.purchaseDate.toDate().getDay());
        //then need to push as many nulls onto the array until we get to the correct store position
        var storeIndex = stores.indexOf(priceData.store);
        var totalColumns = stores.length;
        for(var i=0; i<totalColumns; i++){
            if(i==storeIndex){
                dataArray.push(priceData.price);
            }
            else{
                dataArray.push(null);
            }
        }
        data.addRows([
            dataArray
        ]);
    });

    var options={
        chart:{
            title: '' + foodItemName + ' Price over Time',
            subtitle: 'in dollars (CAD)'
        },
        width:750,
        height:450
    };

    var chart = new google.charts.Scatter(document.getElementById('priceHistoryChart'));

    chart.draw(data, google.charts.Scatter.convertOptions(options));

}

function queryUserFridge_forItem(foodItemName){
    //clear the tables
    
    ItemLookupQuantityTable.innerHTML = '';
    ItemLookupPriceHistoryTable.innerHTML = '';
    
    var user = auth.currentUser;

    //look for foodItemName in user fridge
    fridgeTableItemLookup.hidden=false;

    //get user profile
    firebase.firestore().collection('users').doc(user.uid).get() 
        .then((userProfile)=>{

            //get fridge item
            userProfile.ref.collection('fridge').where('name', '==', foodItemName).get() //get item from fridge within user profile
                .then((foodItemObj)=>{
                    foodItemObj.forEach(fridgeItemIterator=>{ //there should only be one be we still need to iterate
                        
                        //get quantities
                        fridgeItemIterator.ref.collection('quantities').get() //get quantity object from item
                            .then((quantitiesObject)=>{
                                quantitiesObject.forEach(quantity=>{
                                    let quantityData = quantity.data();
                                    let quantityTable = ItemLookupQuantityTable;
                                    //create the row
                                    let row = `<tr>
                                        <td>${quantityData.quantity}</td>
                                        <td>${quantityData.expiryDate.toDate().toDateString()}</td>
                                    </tr>`;

                                    quantityTable.innerHTML += (row); //add the row to the table
                                });
                            });

                       
                        fridgeItemIterator.ref.collection('priceHistory').orderBy("purchaseDate").get() //get price history object from item
                        .then((priceHistoryObject)=>{
                            drawPriceChart(priceHistoryObject, foodItemName);
                            /* Table display of price
                            priceHistoryObject.forEach(priceObj=>{
                                let priceData = priceObj.data();
                                let priceTable = ItemLookupPriceHistoryTable;
                                
                                //create the row
                                let row = `<tr>
                                    <td>${priceData.price}</td>
                                    <td>${priceData.store}</td>
                                    <td>${priceData.purchaseDate.toDate().toDateString()}</td>
                                </tr>`;

                                priceTable.innerHTML += (row); //add the row to the table
                            });
                            */
                        });
                        
    
                            
                    });
                   
                });
        });


}
