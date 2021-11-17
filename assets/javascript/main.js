let user_income = []; //2D array: each element is an array [item, amount, date]
let user_expense = []; //2D array: each element is an array [item, amount, date, budget]
let user_budget = new Map(); //key,value pair where (key = budget name), (value = budget amount)
let total_balance = 0; //total balance of user

class Budget {
    constructor(name, amount, occurs){
        this.name = "(no-name)";
        this.amount = 0;
        this.occurs = 0;

        if(name)
            this.name = name;
        if(amount)
            this.amount = amount;
        if(occurs)
            this.occurs = occurs;
        this.amount_used = 0;
    }

    amountLeft(){
        return this.amount-this.amount_used;
    }

    toString(){
        return this.name + ' | Amount: $' + this.amount + ', Amount Left: $' + this.amountLeft() + ', Reoccurs every ' + this.occurs + ' day(s)';
    }
}

class Budgets {
    constructor(){
        this.budgets = [];

        //<TEMP>
        for(let i = 0; i < 5; i++){this.newBudget('Test_' + i, i*i, 0);}
        //<TEMP>
    }

    newBudget(name, amount, occurs){
        this.budgets.push(new Budget(name, amount, occurs));
        this.updateBudgetList();
    }

    removeBudgetAt(index_pos){
        this.budgets.splice(index_pos, 1);
        this.updateBudgetList();
    }

    printBudgetList(parent_class){
        let parents = document.getElementsByClassName(parent_class);
        for(let i = 0; i < parents.length; i++){
            parents[i].innerText = "";
            this.budgets.forEach((budget, index) => {
                let item_wrapper = document.createElement("div");
                item_wrapper.setAttribute('class', 'budget-item-wrapper');
                let n = document.createElement("div");
                n.innerHTML = budget.name;
                item_wrapper.appendChild(n);
                let a = document.createElement("div");
                a.innerHTML = "$" + budget.amount;
                item_wrapper.appendChild(a);
                if(parent_class == 'budget-list-modify'){
                    let m = document.createElement("img");
                    m.setAttribute('src','assets/images/Settings.svg');
                    m.setAttribute('class', 'image');
                    m.setAttribute('onClick', 'all_budgets.loadModifyBudgetPage(' + index + '); changePageTo("modify-budget")');
                    item_wrapper.appendChild(m);
                }else if(parent_class == 'budget-list-remove'){
                    let m = document.createElement("img");
                    m.setAttribute('src','assets/images/TrashCan.png');
                    m.setAttribute('class', 'image');
                    m.setAttribute('onClick', 'all_budgets.removeBudgetAt(' + index + ')');
                    item_wrapper.appendChild(m);
                }
                parents[i].appendChild(item_wrapper);
            });
        }
    }

    updateBudgetList(){
        this.printBudgetList('budget-list-modify');
        this.printBudgetList('budget-list-remove');
    }

    loadModifyBudgetPage(index_pos){
        cur_index_pos = index_pos;
        document.getElementById("mod-budget-name").setAttribute('value', this.budgets[index_pos].name);
        document.getElementById("mod-budget-amount").setAttribute('value', this.budgets[index_pos].amount);
        document.getElementById("mod-budget-occurs").setAttribute('value', this.budgets[index_pos].occurs);
    }

    updateModifiedBudgetItem(index_pos){
        this.budgets[index_pos].name = document.getElementById("mod-budget-name").value;
        this.budgets[index_pos].amount = document.getElementById("mod-budget-amount").value;
        this.budgets[index_pos].occurs = document.getElementById("mod-budget-occurs").value;
        this.updateBudgetList();
    }
}

let all_budgets = new Budgets();
let cur_index_pos = 0;

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

    if(!item)
        item = "(no-name)";
    if(!amount)
        amount = 0;
    if(!date)
        date = "(no-date)";

    total_balance += amount;
    user_income.push([item, amount, date]);
    
    //go back to home page
    changePageTo('home'); 
    updateTotalBalance();
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
    //let budget = document.getElementById('budget').value;
    let select_index = document.getElementById('budget').selectedIndex;
    let budget = "(no-budget)";

    if(!item)
        item = "(no-name)";
    if(!amount)
        amount = 0;
    if(!date)
        date = "(no-date)";

    if(select_index){
        all_budgets.budgets[select_index].amount_used += amount;
        budget = all_budgets.budgets[select_index].name;
    }

    total_balance -= amount;
    user_expense.push([item, amount, date, budget]);
    updateTotalBalance();

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
    //for(const [key, value] of user_budget){
    select.innerHTML = "";
    var d = document.createElement("option");
    d.setAttribute('selected', 'sekected');
    d.innerText = "(budgets)";
    select.add(d);
    all_budgets.budgets.forEach(budget => {
        //var option = key;
        var el = document.createElement("option");
        //el.text = option;
        //el.value = option;
        el.text = budget.name;
        el.value = budget.ammount;
        select.add(el);
    });
}

/*
    This will read and add a budget to the user_budget Map based on the new budget form.
    Returns to the homepage when done.
    INCOMPLETE: need to add recurring option
 */
function addBudget(){
    let name = getVal("#budget_name");
    let amount = parseInt(document.getElementById('budget_amount').value);
    let occurs = parseInt(document.getElementById('budget_occurs').value);
    all_budgets.newBudget(name, amount, occurs);

    //go back to home page
    changePageTo('home');
}

/*
    Jumps to page based on pageID.
    Also updates the total_balance.
*/
function changePageTo(pageID){
    document.getElementById('main').innerHTML = document.getElementById(pageID).innerHTML;
    //document.getElementById("total_balance").innerHTML = total_balance; // I just didn't know where to put this ;-; -dani
}


function addTopBar(){
    let locations = document.getElementsByClassName('top-bar');
    for(let i = 0; i<locations.length; i++){
        locations[i].innerHTML = document.getElementById('top-bar').innerHTML;
    }
}

function updateTotalBalance(){
    let locations = document.getElementsByClassName('total-balance');
    for(let i = 0; i<locations.length; i++){
        locations[i].innerHTML = total_balance;
    }
}
