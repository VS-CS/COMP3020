let user_income = []; //2D array: each element is an array [item, amount, date]
let user_expense = []; //2D array: each element is an array [item, amount, date, budget]
let total_balance = 1570; //total balance of user (set to match config)
let item_index = -1; //item to edit 
let tolerance = 0;

//Just for fun
function resetTolerance(){
    tolerance = 0;
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

    if(item && amount && date){
        resetTolerance();
        total_balance += amount;
        user_income.push([item, amount, date]);
        
        //go back to home page
        updateStatus(3);
        changePageTo('home');
        updateTotalBalance();

    } else{
        if(tolerance == detectiveLines[9].length-1){
            updateLine(detectiveLines[9][detectiveLines[9].length-1]);
        } else{
            updateLine(detectiveLines[9][tolerance]);
            tolerance++;
        }
    }
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
    let select_index = document.getElementById('budget').selectedIndex;
    let budget = "(no-budget)";

    if(item && amount && date){
        if(select_index){
            all_budgets.budgets[select_index-1].amount_used += amount;
            budget = all_budgets.budgets[select_index-1].name;
        }
        resetTolerance();
        total_balance -= amount;
        user_expense.push([item, amount, date, budget]);
        
        //go back to home page
        updateStatus(3);
        changePageTo('home');
        updateTotalBalance();
    } else{
        if(tolerance == detectiveLines[9].length-1){
            updateLine(detectiveLines[9][detectiveLines[9].length-1]);
        } else{
            updateLine(detectiveLines[9][tolerance]);
            tolerance++;
        }
    }
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

function displayTableButton(tableName){
    let table = document.querySelector("table");
    generateTableButton(table, tableName);
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

function generateTableButton(table, data) {
    let i = 0;

    for (let element of data) {
        let row = table.insertRow();
        for (let entry in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[entry]);
            cell.appendChild(text);
        }
        let edit = document.createElement("BUTTON");
        edit.innerHTML = 'edit';
        edit.id = i;
        row.appendChild(edit);
        edit.onclick = function(){
            if(data == user_income){
                changePageTo('modify_income');
                loadModifyIncome(parseInt(edit.id), data);
            }
            else if(data == user_expense){
                changePageTo('modify_expense');
                generateOptions();
                loadModifyExpense(parseInt(edit.id), data);
            }
        }
        i++;
    }
}

function loadModifyIncome(index, data){
    item_index = index;
    document.getElementById("item").setAttribute('value', data[index][0]);
    document.getElementById("amount").setAttribute('value', data[index][1]);
    document.getElementById("date").setAttribute('value', data[index][2]);
}

function loadModifyExpense(index, data){
    item_index = index;
    document.getElementById("item").setAttribute('value', data[index][0]);
    document.getElementById("amount").setAttribute('value', data[index][1]);
    document.getElementById("date").setAttribute('value', data[index][2]);
    document.getElementById("budget").setAttribute('value', data[index][3]);
}

function modifyIncome(){
    //get data from each element
    let item = getVal("#item")
    let original_amt = user_income[item_index][1];
    let new_amt = parseInt(document.getElementById('amount').value);
    let date = document.getElementById('date').value;

    if(item && amount && date){
        //modify item at given index
        total_balance += (-original_amt + new_amt);
        user_income[item_index][0] = item;
        user_income[item_index][1] = new_amt + 0; 
        user_income[item_index][2] = date;
        
        //go back to home page
        updateStatus(3);
        changePageTo('home');
        updateTotalBalance();
    }
}

function modifyExpense(){
    //get data from each element
    let item = getVal("#item")
    let original_amt = user_expense[item_index][1];
    let new_amt = parseInt(document.getElementById('amount').value);
    let date = document.getElementById('date').value;
    let select_index = document.getElementById('budget').selectedIndex;
    let budget = "(no-budget)";

    if(item && amount && date){
        if(select_index){
            all_budgets.budgets[select_index-1].amount_used += amount;
            budget = all_budgets.budgets[select_index-1].name;
        }
        //modify item at given index
        total_balance += (original_amt - new_amt);
        user_expense[item_index][0] = item;
        user_expense[item_index][1] = new_amt + 0; 
        user_expense[item_index][2] = date;
        user_expense[item_index][3] = budget;
        
        //go back to home page
        updateStatus(3);
        changePageTo('home');
        updateTotalBalance();
    }
}

function removeIncome(){
    total_balance -= user_income[item_index][1];
    user_income.splice(item_index, 1);
    updateTotalBalance();
    updateStatus(3);
    changePageTo('home');    
}

function removeExpense(){
    total_balance += user_expense[item_index][1];
    user_expense.splice(item_index, 1);
    updateTotalBalance();
    updateStatus(3);
    changePageTo('home');
}

function confirmMsg(){

}