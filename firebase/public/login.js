   //firebase
   const auth = firebase.auth(); 
   const provider = new firebase.auth.GoogleAuthProvider();
   
       //login field
   const signInSection = document.getElementById('signInSection');
   const signInBtn = document.getElementById('signInBtn');
   const welcomeSection = document.getElementById('welcomeSection');
   welcomeSection.style.animationPlayState = 'paused';
   const userDetails = document.getElementById('userDetails');
   const welcomeIcon = document.getElementById('welcomeIcon');
   const topBarElement = document.getElementById('topBar');
   const contentSection = document.getElementById('contentSection');


//-----------------------------------------------------------------
//authentication logic
signInBtn.onclick = () => auth.signInWithPopup(provider); //button onclick

auth.onAuthStateChanged(user=>{ //if auth change state
    //if the user has logged in
    if(user){
        //hide login fields, show fridge table
        signInBtn.hidden = true;
        signInSection.hidden = true;
        welcomeSection.style.animationPlayState = 'running';
        userDetails.innerHTML = `<h3> Hello ${user.displayName}.</h3>`;
        
        const userid = user.uid;
        const userRef = firebase.firestore().collection('users').doc(userid).get().then((doc)=>{
            if(doc.exists){ //if the document exists
                //dont need to create a new profile, continue login
                
                //get user data from doc for tables

                getUserProfile(doc); //call the functions in fridgeItems
                //addRowHandlers();
            }
            else{
                this.createUserProfile(user);
            }
            
        })

    }
    //user hanst logged in 
    else{
        //keep login fields shown
        signInBtn.hidden = false;
        signInSection.hidden = false;
        welcomeSection.style.animationPlayState = 'paused';
        userDetails.innerHTML = `Unable to authenticate, contact developer.`;

    }
})

//creates a user profile with a doc id of user.uid
function createUserProfile(user){
    const data = {
        name: user.displayName,
        admin: false
        //need to create a fridge sub collection
        
    } 
    const res = firebase.firestore().collection('users').doc(user.uid).set(data);
    
}
