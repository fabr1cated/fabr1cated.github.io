var terminal;
var block = "&#9608;";
var lines = [];
var currentCommand = 0;
$(document).ready(function () {
    terminal = $("#terminal");
    startCursorFlash();
    lines.push(["cd Fabricated", "Welcome to the underworld..."]);
    lines.push(["name", "Fabricated or Classic"]);
    lines.push(["location", "Your root directory"]);
    lines.push(["skills", "Java, Javascript, Bash, Python, Go, Git, Docker, TypeScript"]);
    lines.push(["git pull", "<a href='https://github.com/fabr1cated/Website' style='color: #00FF00' target='_blank'>https://github.com/fabr1cated/Website</a>"]);
    var commandList = "command list:<br/>&nbsp;&nbsp;&nbsp;&nbsp;";
    for (i = 0; i < lines.length; i++) {
        commandList += lines[i][0];
        if (i < lines.length - 1) commandList += ",&nbsp;";
    }
    lines.push(["help", commandList]);
    printNextCmd();
});
var keyboardEnabled = false;
function outputFinished() {
    if (!keyboardEnabled) {
        keyboardEnabled = true;
        enableKeyboardEntry();
    }
}
function enableKeyboardEntry() {
    $(document).keydown(function (event) {
        if (event.which == 8) { // backspace
            event.preventDefault(); // don't navigate back
            keyEvent(event.which);
        }
    });
    $(document).keypress(function (event) {
        keyEvent(event.which);
    });
}
var userCommand = "";
function keyEvent(keyCode) {
    switch (keyCode) {
    case 8: // backspace
        userCommand = userCommand.slice(0, -1);
        removeLastChar();
        break;
    case 13: // enter
        executeUserCommand();
        break;
    default:
        var newChar = String.fromCharCode(event.which);
        userCommand += newChar;
        appendChar(newChar);
        break;
    }
}
function executeUserCommand() {
    nextResponse = userCommand + ": command not found, type 'help' for command list";
    for (i = 0; i < lines.length; i++) {
        if (userCommand == lines[i][0]) {
            nextResponse = lines[i][1];
        }
    }
    userCommand = "";
    onCmdFinished();
}
var nextCmd, nextResponse;
function printNextCmd() {
    if (currentCommand < lines.length - 1) {
        var pair = lines[currentCommand];
        nextCmd = pair[0];
        nextResponse = pair[1];
        currentCommand++;
        setTimeout(printLn, 1000);
    } else {
        outputFinished();
    }
}
var cursorFlashID = -1;
function startCursorFlash() {
    if (cursorFlashID == -1) {
        addBlock();
        cursorFlashID = setInterval(flashCursor, 500);
    }
}
function pauseCursorFlash() {
    clearInterval(cursorFlashID);
    addBlock();
    cursorFlashID = -1;
}
var hasBlock = false;
function flashCursor() {
    if (hasBlock) {
        removeBlock();
    } else {
        addBlock();
    }
}
function addBlock() {
    if (!hasBlock) {
        var newText = terminal.html();
        newText += block;
        terminal.html(newText);
        hasBlock = true;
    }
}
function removeBlock() {
    if (hasBlock) {
        var newText = terminal.html();
        newText = newText.slice(0, -1);
        terminal.html(newText);
        hasBlock = removeBlock;
        hasBlock = false;
    }
}
function printLn() {
    pauseCursorFlash();
    var text = nextCmd;
    var delay = 0;
    for (i = 0; i < text.length; i++) {
        delay += randomIntFromInterval(1, 250);
        var char = text.charAt(i);
        var isLastChar = (i == text.length - 1);
        printCharWithDelay(delay, char, isLastChar);
    }
}
function printCharWithDelay(delay, char, isLastChar) {
    setTimeout(function () {
        appendChar(char);
        if (isLastChar) {
            setTimeout(onCmdFinished, 500);
        }
    }, delay);
}
function appendChar(newChar) {
    removeBlock();
    var newText = terminal.html();
    terminal.html(newText + newChar);
    addBlock();
}
function removeLastChar() {
    removeBlock();
    var newText = terminal.html();
    newText = newText.slice(0, -1);
    terminal.html(newText);
    addBlock();
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function onCmdFinished() {
    removeBlock();
    addNewLine();
    addBlock();
    setTimeout(printNextResponse, 100);
}
function printNextResponse() {
    printResponse(nextResponse);
    onResponseFinished();
}
function printResponse(line) {
    removeBlock();
    var newText = terminal.html();
    terminal.html(newText + "-bash:&nbsp;" + line);
    addBlock();
}
function onResponseFinished() {
    removeBlock();
    addNewLine();
    var newText = terminal.html();
    terminal.html(newText + "$&nbsp;");
    startCursorFlash();
    printNextCmd();
}
function addNewLine() {
    var oldText = terminal.html();
    terminal.html(oldText + "<br/>");
    window.scrollTo(0, document.body.scrollHeight);
}
