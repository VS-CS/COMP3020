let currency = '$';
let detective_img = 'normal'; //detective appearance
let user_income = []; //2D array: each element is an array [item, amount, date]
let user_expense = []; //2D array: each element is an array [item, amount, date, budget]
let total_balance = 1570; //total balance of user (set to match config)
let item_index = -1; //item to edit 
let tolerance = 0;


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
        return this.name + ' | Amount: '+ currency + this.amount + ', Amount Left: '+ currency + this.amountLeft() + ', Reoccurs every ' + this.occurs + ' day(s)';
    }
}

class Budgets {
    constructor(){
        this.budgets = [];
    }

    newBudget(name, amount, occurs){
        this.budgets.push(new Budget(name, amount, occurs));
        this.updateBudgetList();
    }

    removeBudgetAt(index_pos){
        var c = confirm("Are you sure you wish to delete this budget?");

        if(c == true){
            this.budgets.splice(index_pos, 1);
            this.updateBudgetList();
        }

        return false
    }

    //finds budget index with name
    getBudgetIndex(name){
        let i = 0;
        let found = false;
        while(!found){
            if(this.budgets[i].name == name){
                found = true;
            }
            else{
                i++;
            }
        }
        return i;
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
                a.innerHTML = currency + budget.amount;
                item_wrapper.appendChild(a);
                if(parent_class == 'budget-list-modify'){
                    let m = document.createElement("img");
                    m.setAttribute('src','assets/images/Edit.svg');
                    m.setAttribute('class', 'image');
                    m.setAttribute('onClick', 'all_budgets.loadModifyBudgetPage(' + index + '); changePageTo("modify-budget"); updateStatus(6)');
                    item_wrapper.appendChild(m);
                }else if(parent_class == 'budget-list-remove'){
                    let m = document.createElement("img");
                    m.setAttribute('src','assets/images/TrashCan.svg');
                    m.setAttribute('class', 'image');
                    m.setAttribute('onClick', 'return all_budgets.removeBudgetAt(' + index + ')');
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
    This will read and add a budget to the user_budget Map based on the new budget form.
    Returns to the homepage when done.
 */
    function addBudget(){
        let name = getVal("#budget_name");
        let amount = parseInt(document.getElementById('budget_amount').value);
        let occurs = getVal('#mod-budget-occurs');
        
        all_budgets.newBudget(name, amount, occurs);
    
        //go back to home page
        changePageTo('budgets');
    }

/*  
    This returns the text value of an input tag with the element selector.
    e.g. <input type="text" id="item" placeholder="Enter Item description">
    getVal("#item") -> returns the input text of user
*/
function getVal(element) {
    return document.querySelector(element).value;
}

/*
    This function generates an option list for the budget dropdown.
    It iterates through the user_budget Map, and will create the options.
*/
function generateOptions(){
    let select = document.getElementById("budget");
    select.innerHTML = "";
    var d = document.createElement("option");
    d.setAttribute('selected', 'sekected');
    d.innerText = "(budgets)";
    select.add(d);
    all_budgets.budgets.forEach(budget => {
        var el = document.createElement("option");
        el.text = budget.name;
        el.value = budget.ammount;
        select.add(el);
    });
}


/*
    Jumps to page based on pageID.
    Also updates the total_balance.
*/
function changePageTo(pageID){
    document.getElementById('main').innerHTML = document.getElementById(pageID).innerHTML;
}

function addTopBar(){
    let locations = document.getElementsByClassName('top-bar');
    for(let i = 0; i<locations.length; i++){
        locations[i].innerHTML = document.getElementById('top-bar').innerHTML;
    }
}

//add color on total balance text 
function updateTotalBalance(){
    let locations = document.getElementsByClassName('total-balance');
    
    let output;
    let balance_color;
    if(total_balance < 0){
        output = '-' + currency + Math.abs(total_balance);
        balance_color = "#DC3220";  //red
    }
    else{
        output = currency + total_balance;
        balance_color = "black";  //blue -yep we should change this
    }

    for(let i = 0; i<locations.length; i++){
        locations[i].innerHTML = output;
        locations[i].style.color = balance_color;
    }
}


// -------------------Detective Dialog-------------------
//[0] - greetings
//[1] - fill form
//[2] - "I didn't mean that."
//[3] - form submit
//[4] - budget general
//[5] - budget modify-list
//[6] - budget modify-item
//[7] - budget remove
//[8] - back to main screen
//[9] - incomplete forms
//[10] - that's all

let detectiveLines = [
    ['So, what brings you here?', 'Hi there. What would you like to do today?'], //0
    ['Sure thing. Fill in this form.', 'Sure. Just complete this form.'], //1
    ['I see. What would you like to do then?', 'Hmm. I thought you meant that.'], //2
    ['Looks great. It\'s been taken care of.', 'Perfect. I\'ll take care of that.'], //3
    ['What would you like to do with your budgets?'], //4
    ['Which one would you like to modify?', 'Which budget would you like to make change?'], //5
    ['Here\'s a record of it. What do you want to change?', 'Just fill out the blanks...'], //6
    ['Which one would you like to remove?', 'Just click on the trash can to remove it.'], //7
    ['What else would you like to do?', 'Are there other things that I can do for you?', 'What would you like to do?'], //8
    ['Sorry, you have to complete the form.','Sorry. I can\'t work with incomplete forms.', 'I really can\'t do that.', 'NO.'], //9
    ['That\'s all I can say for now', 'There\'s nothing much other than that.'] //10
];

function updateStatus(statusNum){
    let line = document.getElementsByClassName('typing');

    //generates random number within range
    let randomElement = Math.floor(Math.random() * detectiveLines[statusNum].length);
    for(let i = 0; i<line.length; i++){
        line[i].innerHTML = detectiveLines[statusNum][randomElement];
    }
}

function updateLine(new_line){
    let line = document.getElementsByClassName('typing');

    for(let i = 0; i<line.length; i++){
        line[i].innerHTML = new_line;
    }
}


//-------------------Settings-------------------
function changeCurrency(){
    document.getElementById("id_applied").innerHTML = "saved changes."
    let e = document.getElementById("currency");
    currency = e.options[e.selectedIndex].text;
    updateTotalBalance();
}

function changeApperance(){
    let e = document.getElementById("detective_apperance");
    let main = document.getElementById('main');
    detective_img = e.options[e.selectedIndex].text;
    if(detective_img == 'normal'){
        main.style.backgroundImage ="url('assets/images/Detective.svg'), linear-gradient(rgb(96,78,66), rgb(94,76,64), rgb(96,78,66))";
        main.style.backgroundPositionY = "30%, 100%";
    }
    else if(detective_img == 'turkey'){
        main.style.backgroundImage ="url('assets/images/Detective_chicken_hat.svg'), linear-gradient(rgb(96,78,66), rgb(94,76,64), rgb(96,78,66))";
        main.style.backgroundPositionY = "-10%, 100%";
    }
    else if(detective_img == 'mask'){
        main.style.backgroundImage ="url('assets/images/Detective_mask.svg'), linear-gradient(rgb(96,78,66), rgb(94,76,64), rgb(96,78,66))";
        main.style.backgroundPositionY = "30%, 100%";
    }
    else if(detective_img == 'shades'){
        main.style.backgroundImage ="url('assets/images/Detective_shades.svg'), linear-gradient(rgb(96,78,66), rgb(94,76,64), rgb(96,78,66))";
        main.style.backgroundPositionY = "30%, 100%";
    }

    document.getElementById("appearance_applied").innerHTML = "saved changes."
}


//Configuration
all_budgets.newBudget("Groceries", 500, "monthly");
all_budgets.newBudget("Fixed Costs", 1500, "monthly");
all_budgets.newBudget("Coffee", 50, "weekly");
all_budgets.newBudget("Travel", 3000, "yearly");
all_budgets.newBudget("Misc", 100, "monthly");

user_income.push(['November Paycheck', 4500, "2021-11-10"]);
user_income.push(['Lottery Prize', 20, "2021-11-19"]);

user_expense.push(['Trip to Banff', 1100, "2021-08-24", "Travel"])
user_expense.push(['Rent', 1200, "2021-11-01", "Fixed Costs"]);
user_expense.push(['Utilities', 190, "2021-11-01", "Fixed Costs"]);
user_expense.push(['Starbucks', 15, "2021-11-02", "Coffee"]);
user_expense.push(['Tim Hortons', 15, "2021-11-03", "Coffee"]);
user_expense.push(['Subscription', 25, "2021-11-08", "Fixed Costs"]);
user_expense.push(['Starbucks', 15, "2021-11-09", "Coffee"]);
user_expense.push(['Tim Hortons', 20, "2021-11-11", "Coffee"]);
user_expense.push(['Costco', 200, "2021-11-16", "Groceries"]);
user_expense.push(['Lotto Max', 5, "2021-11-18", "Misc"]);
user_expense.push(['Starbucks', 15, "2021-11-20", "Coffee"]);
user_expense.push(['Walmart', 150, "2021-11-21", "Groceries"]);
