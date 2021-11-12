let user_income = []; //2D array: each element is an array [item, amount, date]
let user_expense = []; //2D array: each element is an array [item, amount, date, budget]
let user_budget = new Map(); //key,value pair where (key = budget name), (value = budget amount)
let total_balance = 0; //total balance of user

/*  
    This returns the text value of an input tag with the element selector.
    e.g. <input type="text" id="item" placeholder="Enter Item description">
    getVal("#item") -> returns the input text of user
*/
function getVal(element) {
    return document.querySelector(element).value;
}

/*
    This will read and add an income to the user_income array based on the add income form.
    Adds the amount to user total balance.
    Returns to the homepage when done.
 */
function addIncome(){
    //get data from each element
    let item = getVal("#item")
    let amount = parseInt(document.getElementById('amount').value);
    let date = document.getElementById('date').value;

    total_balance += amount;
    user_income.push([item, amount, date]);
    
    //go back to home page
    changePageTo('home'); 
}

/*
    This will read and add an expense to the user_income array based on the add expense form.
    Subtracts the amount from user total balance.
    Returns to the homepage when done.
 */
function addExpense(){
    //get data from each element
    let item = getVal("#item");
    let amount = parseInt(document.getElementById('amount').value);
    let date = document.getElementById('date').value;
    let budget = document.getElementById('budget').value;

    total_balance -= amount;
    user_expense.push([item, amount, date, budget]);
    
    //go back to home page
    changePageTo('home'); 
}

/*
    This will display the corresponding table on an HTML page.
    tableName is the name of the 2D array we want to display as an HTML table.
    Needs a predefined table & table header for use. (Check history subpage for referrence)
*/
function displayTable(tableName){
    let table = document.querySelector("table");
    generateTable(table, tableName);
}

/* 
    A helper function for displayTable().
    Generates an HTML table from a 2D array.
    source: https://www.valentinog.com/blog/html-table/
 */
function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (let entry in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[entry]);
        cell.appendChild(text);
        }
    }
}

/*
    This function generates an option list for the budget dropdown.
    It iterates through the user_budget Map, and will create the options.
*/
function generateOptions(){
    let select = document.getElementById("budget");
    for(const [key, value] of user_budget){
        var option = key;
        var el = document.createElement("option");
        el.text = option;
        el.value = option;
        select.add(el);
    }
}

/*
    This will read and add a budget to the user_budget Map based on the new budget form.
    Returns to the homepage when done.
    INCOMPLETE: need to add recurring option
 */
function addBudget(){
    let name = getVal("#budget_name");
    let amount = parseInt(document.getElementById('budget_amount').value);
    user_budget.set(name,amount);

    //go back to home page
    changePageTo('home');
}

/*
    Jumps to page based on pageID.
    Also updates the total_balance.
*/
function changePageTo(pageID){
    document.getElementById('main').innerHTML = document.getElementById(pageID).innerHTML;
    document.getElementById("total_balance").innerHTML = total_balance; // I just didn't know where to put this ;-; -dani
}

