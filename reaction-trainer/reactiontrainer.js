//////////////////////////////////////////////////////////////////////////////
// reactiontrainer.js
//////////////////////////////////////////////////////////////////////////////
// Functions for the reaction trainer.
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// ENUMS
//////////////////////////////////////////////////////////////////////////////

STATES = 
{
    NOT_STARTED : 0,
    RED : 1,
    GREEN : 2
};

BUTTONCOLORS = 
{
    RED : "#FF0000",
    GREEN : "#00FF00",
    NOT_STARTED : "#C04848"
}

//////////////////////////////////////////////////////////////////////////////
// CONSTANTS
//////////////////////////////////////////////////////////////////////////////

//Minimum time in milliseconds for the button to be red
var MIN_WAIT = 750;

//Maximum time in milliseonds for the button to be red
var MAX_WAIT = 3000;

//////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
//////////////////////////////////////////////////////////////////////////////

//The current state if the program see STATES enum
var state;

//The time that the button turned green
var greenTime;

//The timeout that is used to change the button green
var makeGreenTimeout;

//The total time it has taken the user to react.  Used for average time.
var totalTime = 0;

//The number of green clicks the user has made.  Used for average time.
var totalGreenClicks = 0;

//////////////////////////////////////////////////////////////////////////////
// PAGE LOADED FUNCTION
//////////////////////////////////////////////////////////////////////////////

function pageLoaded()
{
    changeState(STATES.NOT_STARTED);
}

//////////////////////////////////////////////////////////////////////////////
// BUTTON CLICKED FUNCTION
//////////////////////////////////////////////////////////////////////////////

function buttonClicked()
{
    switch(state)
    {
        case STATES.NOT_STARTED:
            start();
            break;
            
        case STATES.RED:
            redClick();
            break;
            
        case STATES.GREEN:
            greenClick();
            break;
    }
}

//////////////////////////////////////////////////////////////////////////////
// CHANGE STATE FUNCTION
//////////////////////////////////////////////////////////////////////////////

function changeState(newState)
{
    state = newState;
    
    updateButton();
}

//////////////////////////////////////////////////////////////////////////////
// UPDATE BUTTON FUNCTION
//////////////////////////////////////////////////////////////////////////////

function updateButton()
{
    var button = document.getElementById("thebutton");

    switch(state)
    {
        case STATES.NOT_STARTED:
            button.innerHTML = "Click Here To Start";
            button.style.backgroundColor = BUTTONCOLORS.NOT_STARTED;
            break;
            
        case STATES.RED:
            button.innerHTML = "Wait for it...";
            button.style.backgroundColor = BUTTONCOLORS.RED;
            break;
            
        case STATES.GREEN:
            button.innerHTML = "CLICK!!!";
            button.style.backgroundColor = BUTTONCOLORS.GREEN;
            break;
    }
}

//////////////////////////////////////////////////////////////////////////////
// START FUNCTION
//////////////////////////////////////////////////////////////////////////////

/**
 * This function is called when the user clicks the button to begin the
 * game.  It changes the colour of the button to red and begins the
 * timer to change the button green.
 */
function start()
{
    changeState(STATES.RED);
    
    //calcualte a random wait time
    var waitTime = MIN_WAIT+(Math.random() * (MAX_WAIT-MIN_WAIT));
    
    makeGreenTimeout = window.setTimeout(function(){makeGreen();},waitTime);
}

//////////////////////////////////////////////////////////////////////////////
// MAKE GREEN FUNCTION
//////////////////////////////////////////////////////////////////////////////

/**
 * This function changes the button to green and records the time at 
 * which it was executed.  It is called after a random delay by start()
 */
function makeGreen()
{
    changeState(STATES.GREEN);
    
    //record the time
    var d = new Date();
    
    greenTime = d.getTime();
}
 
 /////////////////////////////////////////////////////////////////////////////
 // GREEN CLICK
 /////////////////////////////////////////////////////////////////////////////
 
 /**
  * This function is called when the user clicks on the button while it is
  * green.  It displays the user's time, their average and resets the game.
  */
function greenClick()
{
    changeState(STATES.NOT_STARTED);
    
    //work out the current time
    var d = new Date();
    
    var timeNow = d.getTime();

    //calculate difference in current time and green time
    var diff = timeNow-greenTime;
    
    //convert diff to seconds
    var displayTime = diff/1000;
    
    //record the green click
    totalGreenClicks += 1;
    
    //add the time to total
    totalTime += diff;
    
    //calculate the average time
    var averageTime = totalTime/totalGreenClicks;
    
    //convert average time to seconds for display
    var displayAvgTime = averageTime/1000;
    
    //Build the string for display
    var displayStr = "Time: "+displayTime+"\nAttempts: "+totalGreenClicks+
                     "\nAverage Time: "+displayAvgTime;
    
    //alert the user to their time
    alert(displayStr);
}

//////////////////////////////////////////////////////////////////////////////
// RED CLICK
//////////////////////////////////////////////////////////////////////////////

/**
 * This function is called when the user clicks on the button while it is
 * red.  It alerts the user that they have clicked too early and resets
 * the game.
 */
 
function redClick()
{
    changeState(STATES.NOT_STARTED);
    
    //remove the make green timeout
    window.clearTimeout(makeGreenTimeout);
    
    //alert the user that they're crap
    alert("You clicked too early.  Click the button when it turns green.");
}