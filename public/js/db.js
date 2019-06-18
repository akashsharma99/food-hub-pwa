//offline data behaviour
db.enablePersistence()
    .catch(err=>{
        if(err.code == 'failed-precondition'){
            //when multiple tabs opened
            console.log('persistence failed');
        }else if(err.code == 'unimplemented'){
            //lack of browser support
            console.log('persistence is not available');
        }
    })


//realtime listener
db.collection('recipes').onSnapshot((snapshot)=>{
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(change=>{
        //console.log(change,change.doc.data(),change.doc.id);
        if(change.type==='added'){
            //add document data to page
            renderRecipe(change.doc.data(),change.doc.id);
        }
        if(change.type=='removed'){
            //remove document data from webpage
            removeRecipe(change.doc.id);
        }
    })
})

//add new recipe
const form = document.querySelector('form');
form.addEventListener('submit',evt=>{
    evt.preventDefault();
    const newRecipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    };

    db.collection('recipes').add(newRecipe)
        .catch(err=>console.log(err));
    form.title.value='';
    form.ingredients.value='';
});

//delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click',evt=>{
    //console.log(evt.target.tagName);
    if(evt.target.tagName === 'I'){
        const id=evt.target.getAttribute('data-id');
        db.collection('recipes').doc(id).delete();
    }
})