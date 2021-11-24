//load google charts
google.charts.load("current", {packages:["corechart"]});

let count = 0;
let over = []; // 2d array that contains all the budgets that the user has spend over [[budgetName, amountSpentOver]...]
let under = []; 

function getAnalysis(){
    let m = getExpenseMap();
    let item = getMax(m); //get budget that the user spent the most on
    over = shuffleArray(checkBudgetOver());//update
    under = shuffleArray(checkBudgetUnder());
    count = over.length + under.length; //update
    
    //display the chart first
    displayChart('Total Spendings', createDataTable(m));
    updateLine("It seems like you're spending mostly on [" + item + "].");
}

//checks all budgets that have more expense than 
function getBudgetAnalysis(){
    changePageTo("analysis-over-budget");
    if(count > 0){
        let item = [];
        let budget_name = "";
        let list;
        if(over.length){
            item = over.pop();
            budget_name = item[0];
            updateLine("You're spending too much on [" + budget_name + "]. You went over " + currency + item[1] + " of your budget.");
        } else if (under.length){
            item = under.pop();
            budget_name = item[0];
            updateLine("You have some extra for [" + budget_name + "]. You still have " + currency + item[1] + " left.");
        }

        list = getAllExpense(budget_name);
        document.getElementById("overbudget-name").innerHTML = budget_name;
        displayTable(list);
        count--;
    } else{
        updateStatus(10);
        changePageTo("analysis");
        document.getElementById("else").style.display= "none";
    }
}


/*
 List of things to create
 - expense: show graph
 - expense: check if overspent on a budget
 - expense: check if budget has more than 50%
 - expense: most spent budget
 - expense: most expensive item of the month
*/ 

//This functuon returns all the expenses from a user's budget by a given name
function getAllExpense(budget){
    let expenses = [];

    for (let i = 0; i < user_expense.length; i++){
        const budget_name = user_expense[i][3];
        if (budget_name == budget){
            let item = [];
            for(let j = 0; j < user_expense[i].length-1; j++){
                item.push(user_expense[i][j]);
            }
            expenses.push(item);
        }
    }
    return expenses;
}

//This function returns a map[budget,total expense] for the user's expense
function getExpenseMap(){
    // key = budget name, value = budget total
    let expense_by_budget = new Map();

    //[item, amount, date, budget]
    for (const item of user_expense){
        const budget_name = item[3];
        const amount = item[1];
        addToMap(expense_by_budget, budget_name, amount);
    }

    return expense_by_budget;
}

//helper
function addToMap(map, name, amount){
    if (map.has(name)){ //map contains budget
        let new_total = map.get(name) + amount; 
        map.set(name, new_total);
    }
    else{ //if not add budget to map
        map.set(name, amount);
    }
}

//check by interval
function getExpenseMapInterval(){
    let expense_by_budget = new Map();
    // key = budget name, value = budget total

    //this implementation might take super long if we have a long list of expenses
    for (const item of user_expense){
        const budget_name = item[3];
        const amount = item[1];
        let i = all_budgets.getBudgetIndex(budget_name);
        let interval = all_budgets.budgets[i].occurs;
    }

    return expense_by_budget;
}

//checks if a given date is within the interval from today
// function checkInInterval(interval, date){
//     let today = getToday();
//     let inInterval = false;

//     if(today.getFullYear() == date.getFullYear()){
//         if(interval == "yearly"){
//             inInterval = true;
//         }
//         else{
//             if(today.getMonth() == date.getMonth()){ 
//                 if(interval == "monthly"){
//                     inInterval = true;
//                 }
//             }
//         }
//     } else {
//         if(today.getDay() - )    
//     }

//     return inInterval;
// }

//gets today with no time
function getToday(){
    let d = new Date();
    return new Date(d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ (d.getDate()+1));
}

//source: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
function getDiffDays(date1, date2){
    let Difference_In_Time = Math.abs((date1.getTime() - date2.getTime()));
    return Difference_In_Time / (1000 * 3600 * 24); 
}

//This function returns the key with the maximum value in a Map
function getMax(aMap) {
    let maxKey;
    let maxValue = 0;
    for (let [key, value] of aMap) {
       if(value > maxValue){
           maxValue = value;
           maxKey = key;
       }
    }
    return maxKey;
}

//check over budget: returns 2D array [budget, amout spent over]
function checkBudgetOver(){
    let over_budget = [];
    let m = getExpenseMap();
    for(const budget of all_budgets.budgets){ //go through all budgets
        let b = m.get(budget.name); //returns the total amount spent on budget
        if(budget.amount < b){
            over_budget.push([budget.name, (b - budget.amount)]);
        }
    } 
    return over_budget;
}

//check under budget: returns 2D array [budget, amout spent under]
function checkBudgetUnder(){
    let under_budget = [];
    let m = getExpenseMap();
    for(const budget of all_budgets.budgets){ //go through all budgets
        let b = m.get(budget.name); //b == total amount spent on budget
        if(budget.amount > b){
            under_budget.push([budget.name, (budget.amount - b)]);
        }
    } 
    return under_budget;
}


//Chart functions
function displayChart(chartTitle, dataTable){
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var options = {
        title: chartTitle,
        pieHole: 0.4,
        backgroundColor: { fill:'transparent' },
        pieSliceTextStyle: {
            color: 'black'
        },
        is3D: true,
        colors: ["797d62","9b9b7a","d9ae94","f1dca7","ffcb69","d08c60","997b66"],
        //<TEST>=========================================================================================================<TEST>
        //<TEST>=========================================================================================================<TEST>
      };
      //<TEST>=========================================================================================================<TEST>
      options.chartArea = {left:'2%', top:'15%', 'width': '100%', 'height': '80%'}
      //<TEST>=========================================================================================================<TEST>

      var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
      chart.draw(dataTable, options);
    }
}

//creates a data table from a given Map
function createDataTable(m){
    var data = new google.visualization.DataTable();
    data.addColumn('string','Budget');
    data.addColumn('number', 'Amount');
    data.addRows(m.size);
    
    let i = 0;
    for(const [key, value] of m){
      data.setValue(i, 0, key);
      data.setValue(i, 1, value);
      i++;
    }
    return data;
}

//-------------------Helper functions-------------------

//Creates a 2D array from a given Map
function mapToArray(m){
    let arr = [];
    for(const [key, value] of m){
        arr.push([key, value]);
    }  
    return arr;
}

//Randomize array: Durstenfeld shuffle algorithm
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}