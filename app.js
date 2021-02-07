const searchButton = document.getElementById('search-btn');
const mealName = document.getElementById('input');
const mealContainer = document.getElementById('meal-container');
const infoContainer = document.getElementById('ingredients');
const errorMsg = document.getElementById('error-msg');
//search event listener

searchButton.addEventListener('click', () => {
    if (mealName.value == "") {
        errorMessage("please enter a food name")
    }
    else {
        mealContainer.style.display = "grid";
        infoContainer.style.display = "none";
        mealContainer.innerHTML = "";
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName.value}`)
            .then(response => response.json())
            .then(data => searchFood(data));
        mealName.value = "";
    }

})
//function for searching meal

const searchFood = foods => {
    if (foods.meals != null) {
        foods.meals.forEach((food) => {
            const singleMeal = `
        <div onclick ="foodInfo(${food.idMeal})" class="grid-item">
            <img src="${food.strMealThumb}">
            <p class="food-title">${food.strMeal}</p>
         </div>
        `;
            mealContainer.innerHTML = mealContainer.innerHTML + singleMeal;
        })
    }
    else {
        errorMessage("No matching food found")
    }

}
//function for food info fetch
const foodInfo = foodId => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`)
        .then(response => response.json())
        .then(data => foodInfoUI(data));
}
//sho food info on ui
const foodInfoUI = data => {
    mealContainer.style.display = "none";
    infoContainer.style.display = "block";
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        let ingTitle = "strIngredient" + i;
        if (data.meals[0][ingTitle] != "" && data.meals[0][ingTitle] != null) {
            ingredients = ingredients + `<li><i class="fas fa-check-square"></i> ${data.meals[0][ingTitle]}</li>`
        }
    }

    const infoContent = `
        <div class="meal-image-wrapper">
        <img src="${data.meals[0].strMealThumb}" class="meal-img">
        </div>
        <div>
            <h1>${data.meals[0].strMeal} </h1>
            <h4>Ingredients</h4>
            <ul class="meal-details">
               ${ingredients}
            
            </ul>
            <button class="btn btn-back " onclick="goBack()"><i class="fas fa-chevron-left"></i>  Back</button>
        </div>
    `;
    infoContainer.innerHTML = infoContent;
}
//function for back button
const goBack = () => {
    mealContainer.style.display = "grid";
    infoContainer.style.display = "none";
}
//function for showing a error message
const errorMessage = msg => {
    errorMsg.style.display = "block";
    document.querySelector('.msg-body').innerText = msg;
    document.querySelector('.btn-ok').addEventListener('click', () => {
        errorMsg.style.display = "none";
    })
    return false;
}