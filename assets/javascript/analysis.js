let count = 0;
let over = [];

function getAnalysis(){
    let m = getExpenseMap();
    let item = getMax(m);
    over = checkBudget(); //update
    count = over.length; //update
    displayChart();

    updateLine("It seems like you're spending mostly on " + item);
}

function myFunction() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

function test(){
    if(count > 0){
        updateLine("You're spending too much on " + over[count-1][0] + ". You went over " + currency + over[count-1][1] + " of your budget.");
        count--;
    } else{
        updateLine("That's all I can say for now.");
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

when user asks, create an array of booleans to check if a given analysis function should be called
user can keep asking till the list is empty
*/ 

//This function returns a map[budget,total expense] for the user's expense
function getExpenseMap(){
    // key = budget name, value = budget total
    let expense_by_budget = new Map();

    //[item, amount, date, budget]
    for (const item of user_expense){
        const budget_name = item[3];
        const amount = item[1];
        if (expense_by_budget.has(item[3])){ //map contains budget
            let new_total = expense_by_budget.get(budget_name) + amount; 
            expense_by_budget.set(budget_name, new_total);
        }
        else{ //if not add budget to map
            expense_by_budget.set(budget_name, amount);
        }
    }

    return expense_by_budget;
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
function checkBudget(){
    let over_budget = [];
    let m = getExpenseMap();
    for(const budget of all_budgets.budgets){
        let b = m.get(budget.name); //returns the total amount spent on budget
        if(budget.amount < b){
            over_budget.push([budget.name, (b - budget.amount)]);
        }
    } 
    return over_budget;
}


//Chart functions
function displayChart(){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      var options = {
        title: 'Total Spendings',
        pieHole: 0.4,
        backgroundColor: { fill:'transparent' },
        pieSliceTextStyle: {
            color: 'black'
        },
        is3D: true,
        colors: ["797d62","9b9b7a","d9ae94","f1dca7","ffcb69","d08c60","997b66"]

      };

      var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
      chart.draw(createDataTable(getExpenseMap()), options);
    }
}

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

//Helper functions
function mapToArray(m){
    let arr = [];
    for(const [key, value] of m){
        arr.push([key, value]);
    }  
    return arr;
}