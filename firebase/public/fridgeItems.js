

//-----------------------------------------------------------------
var userProfile = null;
function displayUserFridge(doc){
    userProfile = doc;
    const fridge = doc.ref.collection('fridge').get()
        .then((fridgeItems)=>{
            fridgeItems.forEach(item=>{
                let data = item.data();
                console.log(data);
                //let table = fridgeTable;
               /* 
                //create the row
                let row = `<tr>
                                <td>${data.name}</td>
                                <td>${data.totalQuantity}</td>
                            </tr>`;
                table.innerHTML += (row); //add the row to the table
                addRowHandlers(); //re add the click handler (innerHTML+= erases all existing DOM elements)
                */
            })
        });
    //add event listener to table
   // addRowHandlers();
}
