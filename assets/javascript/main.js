let user_income = [];
let user_expense = [];
let user_budget = new Map();
let total_balance = 0;

//gets text input
function getVal(element) {
    return document.querySelector(element).value;
}

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

function displayTable(tableName){
    let table = document.querySelector("table");
    generateTable(table, tableName);
}

// source: https://www.valentinog.com/blog/html-table/ 
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

function addBudget(){
    let name = getVal("#budget_name");
    let amount = parseInt(document.getElementById('budget_amount').value);
    user_budget.set(name,amount);

    //go back to home page
    changePageTo('home');
}

function changePageTo(pageID){
    document.getElementById('main').innerHTML = document.getElementById(pageID).innerHTML;
    document.getElementById("total_balance").innerHTML = total_balance;
}

