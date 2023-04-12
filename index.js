
////////////////////////////////// Global Variables ///////////////////////////////////

// Game level
var level = 1;
var goalDelay = 500;            // Delay between each button in the goal sequence (in ms)
var afterResponseDelay = 1250;   // Delay after user's response (in ms)

// Get all buttons (div.col's) in this order: maroon, turquoise, seagreen, gold
var buttons = [];
buttons.push($('.col')[0], $('.col')[1], $('.col')[2], $('.col')[3]);

// Array to store the goal sequence
var goalSequence = [];

// Index to check the user's response: incremented on each call of checkResponse()
var checkIndex = -1;

///////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////// Utility Functions ///////////////////////////////////

function game() {
    // Remove the rules class
    $('.rules').hide();

    // Remove the Start-Game listener and user-response listener
    $(document).off('keypress');
    $('.col').off('click');

    // Dislay the level
    $('h1').text(`Level ${level}`);

    // Update the goal sequence
    updateGoalSequence();

    // Start playing the buttons in goal sequence
    for(let i = 0; i < goalSequence.length; i++) {
        setTimeout(function () { playButton(goalSequence[i].id); }, goalDelay*i);
    }

    increaseDifficultyByTime();

    // Start listening for user's response
    setTimeout(function () { 
        $('.col').on('click', function () { checkResponse(this) });
        $(document).on('keypress', function (event) { wesdButtonsPressed(event) });
    }, goalDelay*goalSequence.length);
}

function increaseDifficultyByTime() {
    if (goalDelay > 100) {
        goalDelay -= 20;
        afterResponseDelay -= 20;
    }
}

function updateGoalSequence() {
    var randomIndex = Math.floor(Math.random() * 4);
    goalSequence.push(buttons[randomIndex]);
}

function playButton(elementId) {
    $(`#${elementId}`).addClass('pressed');
    window.setTimeout(function () { $(`#${elementId}`).removeClass('pressed'); }, 150);
    playSound(elementId);
}

function gameOver() {
    playSound('gameOver');
    $('h1').text('Game Over, Press Any Key to Restart');
    $('.level').text(`Level Reached: ${level}`);
    level = 1;
    $(document).on('keypress', function () { location.reload();} ); // Reload the page
}

function playSound(fileName) {
    var audio = new Audio(`sounds/${fileName}.wav`);
    audio.play();
}

function checkResponse(htmlElement) {

    checkIndex++;

    if (htmlElement == goalSequence[checkIndex]) {
        playButton(htmlElement.id);
    } else {
        $('.col').off('click');
        $(document).off('keypress');
        goalSequence = [];
        gameOver();
    }

    if (checkIndex == goalSequence.length - 1) {
        checkIndex = -1;
        level++;
        $('.col').off('click');
        $(document).off('keypress');
        setTimeout(function () { game(); }, afterResponseDelay);
    }
}

function wesdButtonsPressed(event) {
    switch (event.key) {
        case 'w':
            checkResponse(buttons[0]);
            break;
        case 'e':
            checkResponse(buttons[1]);
            break;
        case 's':
            checkResponse(buttons[2]);
            break;
        case 'd':
            checkResponse(buttons[3]);
            break;
        default:
            alert('Invalid key pressed! Press only w, e, s, d keys.');
            break;
    }
}

//////////////////////////////////////////////////////////////////////////////////////


// Executable code begins here (like main())
/*************************************** MAIN ***************************************/

// Press any key to start Listener
$(document).on('keypress', game); // Call game() on keypress

// Drop-down menu listener
$('#drop-down-btn').click(function () { $('.drop-down-menu').slideToggle(); });

/************************************************************************************/