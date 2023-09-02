const punchInImg = "http://www.clker.com/cliparts/B/K/L/P/e/5/play-button-hi.png";
const punchOutImg= "https://cdn2.iconfinder.com/data/icons/iconslandplayer/PNG/256x256/CircleBordered/Stop1NormalRed.png";
const mealStartImg ="https://thumbs.dreamstime.com/b/menu-food-dish-icon-isolated-elegant-green-round-button-abstract-illustration-menu-food-dish-icon-elegant-green-round-button-104812375.jpg";
const mealEndImg = "https://thumbs.dreamstime.com/b/menu-food-dish-icon-isolated-red-round-button-abstract-illustration-menu-food-dish-icon-red-round-button-104753605.jpg";
const breakStartImg = "https://image.shutterstock.com/image-illustration/coffee-cup-icon-isolated-on-260nw-585542504.jpg";
const breakEndImg = "https://thumbs.dreamstime.com/z/white-fragile-broken-glass-symbol-delivery-boxes-icon-isolated-long-shadow-red-circle-button-vector-illustration-187789853.jpg";

var tcDate ="";
var tcShift ="";
var tcTimeIn = "";
var tcTimeOut ="";
var lastPunchIn="";
var lastMealStart="";
var lastBreakStart="";
var uniqueid=parseInt(localStorage.getItem('counter'));
var globalid=0;

var punchButton = document.getElementById("punch");
var mealButton = document.getElementById("meal");
var breakButton = document.getElementById("break");
var timeCard = document.getElementById("timecard");
var timeCardHistory = document.getElementById("timecard-history");
var punchError = document.getElementById("punch-error-msg-holder");
var punchErrorMsg = document.getElementById("punch-error-msg");
var logoutButton = document.getElementById("logout");
var welcomeUsername = document.getElementById("welcome").innerText = "Welcome, Admin";

var punchStatus = punchButton.src;
var mealStatus = mealButton.src;
var breakStatus = breakButton.src;

// Function to display the TimeCard table when the user logs in
function displayTable() {
var counter = parseInt(window.localStorage.getItem('counter'));
console.log(counter);
    for(var j = 0;j < counter;j++) {
        var adminID = 'admin'+j;
        var tcreturn = JSON.parse(window.localStorage.getItem(adminID));
        var row = timeCardHistory.insertRow(1);
        var tcDate = row.insertCell(0);
        var tcShift = row.insertCell(1);
        var tcTimeIn = row.insertCell(2);
        var tcTimeOut = row.insertCell(3);

        tcDate.innerHTML = tcreturn.tcDateObj;
        tcShift.innerHTML = tcreturn.tcShiftObj;
        tcTimeIn.innerHTML = tcreturn.tcTimeInObj;
        tcTimeOut.innerHTML = tcreturn.tcTimeOutObj;
        }
    }

    // Punch button event listener to add punch history to the table
    punchButton.addEventListener("click", function changeImage(e) {
    e.preventDefault();
    
    mealStatus = mealButton.src;
    breakStatus = breakButton.src;
    punchStatus = punchButton.src;
        if(punchStatus == punchInImg)
        {
            punchButton.src = punchOutImg;
            AddTimeCard("PunchIn");
            punchErrorMsg.innerText = "";
            punchErrorMsg.style.opacity = 0;
        }
        else if(punchStatus == punchOutImg && mealStatus != mealEndImg && breakStatus != breakEndImg)
        {
            punchButton.src = punchInImg;
            AddTimeCard("PunchOut");
            punchErrorMsg.innerText = "";
            punchErrorMsg.style.opacity = 0;
        }
        else {
            punchErrorMsg.style.opacity = 1;
            punchErrorMsg.innerText = "Cannot end a shift if meal or break is active!";
            
        }
    });

    // Meal button event listener to add punch history to the table
    mealButton.addEventListener("click", function changeImage(e) {
    e.preventDefault();
    mealStatus = mealButton.src;
    breakStatus = breakButton.src;
    punchStatus = punchButton.src;
        if(mealStatus == mealStartImg && punchStatus == punchOutImg && breakStatus == breakStartImg)
        {
            mealButton.src = mealEndImg;
            AddTimeCard("Meal Start");
            punchErrorMsg.innerText = "";
            punchErrorMsg.style.opacity = 0;
        }
        else if(mealStatus == mealEndImg) {
            mealButton.src = mealStartImg;
            AddTimeCard("Meal End");
            punchErrorMsg.innerText = "";
            punchErrorMsg.style.opacity = 0;
        }
        else {
            mealButton.src = mealStartImg;
            punchErrorMsg.style.opacity = 1;
            punchErrorMsg.innerText = "Cannot Start the meal unless you are on a work shift or already on a break!";
            }
    });

    // Break button event listener to add punch history to the table
    breakButton.addEventListener("click", function changeImage(e) {
    e.preventDefault();
    mealStatus = mealButton.src;
    breakStatus = breakButton.src;
    punchStatus = punchButton.src;
        if(breakButton.src == breakStartImg && punchStatus == punchOutImg && mealStatus == mealStartImg)
        {
            breakButton.src = breakEndImg;
            AddTimeCard("Break Start");
            punchErrorMsg.innerText = "";
            punchErrorMsg.style.opacity = 0;
        }
        else if(breakStatus == breakEndImg) {
            breakButton.src = breakStartImg;
            AddTimeCard("Break End");
            punchErrorMsg.innerText = "";
            punchErrorMsg.style.opacity = 0;
        }
        else {
            breakButton.src = breakStartImg;
            punchErrorMsg.innerText = "Cannot Start the break unless you are on a work shift or already on a meal!";
            punchErrorMsg.style.opacity = 1;
        }
    });

    logoutButton.addEventListener("click", function logoutWindow(e) {
        e.preventDefault();
        var counter = parseInt(window.localStorage.getItem('counter'));
        console.log('Before'+counter)
        counter += window.globalid;
        console.log('After'+counter);
        window.localStorage.setItem('counter',counter);
        window.globalid=0;
        window.location.href="Logout.html";
    });

// Function to insert actual values for TimeIn and TimeOut into the table and localStorage
function AddTimeCard(shift) {
    
    var date = new Date();
    var hour = date.getHours();
    var min = date.getMinutes();
    var day = date.getUTCDay();
    var month = date.getMonth();
    var year = date.getFullYear();

    if(shift == "PunchIn") {
        insertTimeCardtoTable("-",shift);
        lastPunchIn = hour+":"+min;
        }
    else if(shift == "PunchOut") {
        insertTimeCardtoTable(window.lastPunchIn,shift);
    }
    else if(shift == "Meal Start") {
        insertTimeCardtoTable("-",shift);
        lastMealStart = hour+":"+min;
        }
    else if(shift == "Meal End") {
        insertTimeCardtoTable(window.lastMealStart,shift);
    }
    else if(shift == "Break Start") {
        insertTimeCardtoTable("-",shift);
        lastBreakStart = hour+":"+min;
        }
    else if(shift == "Break End") {
        insertTimeCardtoTable(window.lastBreakStart,shift);
    }
}

// Function to insert current timestamp to localStorage and in timeCard table at run-time
function insertTimeCardtoTable(timeout,shifts) {
    var date = new Date(); /* creating object of Date class */
    var hour = date.getHours();
    var min = date.getMinutes();
    var day = date.getUTCDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    var tcStorage = {
        tcDateObj: "",
        tcShiftObj: "",
        tcTimeInObj: "",
        tcTimeOutObj: ""
    }
    
    if(shifts=="Meal End"||shifts=="Break End") {
        var row = timeCard.deleteRow(1);
        var row = timeCard.insertRow(1);
        var tcDate = row.insertCell(0);
        var tcShift = row.insertCell(1);
        var tcTimeIn = row.insertCell(2);
        var tcTimeOut = row.insertCell(3);

        tcDate.innerHTML = month+"/"+day+"/"+year;
        tcShift.innerHTML = shifts;
        tcTimeIn.innerHTML = timeout;
        tcTimeOut.innerHTML = hour+":"+min;

        tcStorage.tcDateObj = month+"/"+day+"/"+year;
        tcStorage.tcShiftObj = shifts;
        tcStorage.tcTimeInObj = timeout;
        tcStorage.tcTimeOutObj = hour+":"+min;

        var updatedID = 'admin'+ window.uniqueid;
        window.localStorage.setItem(updatedID,JSON.stringify(tcStorage));
        window.uniqueid += 1;
        window.globalid += 1;
    }
    else if( shifts=="PunchOut") {
    var rowLength = timeCard.rows.length;
   
    for (i = 0; i < rowLength; i++){
        var tCells = timeCard.rows.item(i).cells;
            for(var j = 0; j < tCells.length; j++){
                    var cellVal = tCells.item(j).innerHTML;
                    if(cellVal=='-') {
                        timeCard.deleteRow(i);
                        tCells.item(j).innerText=timeout;

                        timeCard.style.textAlign = "center";
                        var row = timeCard.insertRow(1);
                        var tcDate = row.insertCell(0);
                        var tcShift = row.insertCell(1);
                        var tcTimeIn = row.insertCell(2);
                        var tcTimeOut = row.insertCell(3);
                    
                        tcDate.innerHTML = month+"/"+day+"/"+year;
                        tcShift.innerHTML = shifts;
                        tcTimeIn.innerHTML = timeout;
                        tcTimeOut.innerHTML = hour+":"+min;

                        tcStorage.tcDateObj = month+"/"+day+"/"+year;
                        tcStorage.tcShiftObj = shifts;
                        tcStorage.tcTimeInObj = timeout;
                        tcStorage.tcTimeOutObj = hour+":"+min;

                        var updatedID = 'admin'+ window.uniqueid;
                        window.localStorage.setItem(updatedID,JSON.stringify(tcStorage));
                        window.uniqueid += 1;
                        window.globalid += 1;
                    }
                }
            }
    }
    else {
        timeCard.style.textAlign = "center";
        var row = timeCard.insertRow(1);
        var tcDate = row.insertCell(0);
        var tcShift = row.insertCell(1);
        var tcTimeIn = row.insertCell(2);
        var tcTimeOut = row.insertCell(3);
    
        tcDate.innerHTML = month+"/"+day+"/"+year;
        tcShift.innerHTML = shifts;
        tcTimeIn.innerHTML = hour+":"+min;
        tcTimeOut.innerHTML = timeout;

        tcStorage.tcDateObj = month+"/"+day+"/"+year;
        tcStorage.tcShiftObj = shifts;
        tcStorage.tcTimeInObj = hour+":"+min;
        tcStorage.tcTimeOutObj = timeout;

        var updatedID = 'admin'+ window.uniqueid;
        window.localStorage.setItem(updatedID,JSON.stringify(tcStorage));
        window.uniqueid += 1;
        window.globalid += 1;
    }    
}

// Function to display and update current time
function currentTime() {
  var date = new Date(); 
  var hour = date.getHours();
  var min = date.getMinutes();
  hour = updateTime(hour);
  min = updateTime(min);
  midday = (hour >= 12) ? "PM" : "AM";
  hour = (hour == 0) ? 12 : ((hour > 12) ? (hour - 12): hour);
  document.getElementById("clock").innerText = hour + ":" + min + " " + midday; 
  var t = setTimeout(function(){ currentTime() }, 1000); 
  var midday = "";
  midday = (hour >= 12) ? "PM" : "AM";
  hour = (hour == 0) ? 12 : ((hour > 12) ? (hour - 12): hour);
}
function updateTime(s) {
  if (s < 10) {
    return "0" + s;
  }
  else {
    return s;
  }
}

//Function to clear localStorage (if required)
function clearStorage() {
    localStorage.clear();
    window.localStorage.setItem('counter',0);
}

currentTime(); 
//clearStorage();
displayTable();

