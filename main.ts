radio.setGroup(1)  // Set group for communication
basic.pause(500)  // Allow time for radio setup
let selectedMessage = 0  // Tracks current message selection (1-5)
let lastReceivedMessage = 0  // Stores last received message
let deviceID = control.deviceSerialNumber()  // Unique ID for each Micro:bit

// Show a tick icon to indicate successful initialization
basic.showIcon(IconNames.Yes)

// Press A to toggle message selection (1-5)
input.onButtonPressed(Button.A, function () {
    selectedMessage++
    if (selectedMessage > 5) {
        selectedMessage = 1  // Reset back to message 1
    }
    showMessagePattern(selectedMessage)  // Display the selected message
})

// Press A+B to clear selection
input.onButtonPressed(Button.AB, function () {
    selectedMessage = 0
    basic.showIcon(IconNames.No)  // Show "No" icon to indicate cleared selection
})

// Press B to send the selected message
input.onButtonPressed(Button.B, function () {
    if (selectedMessage == 0) {
        basic.showIcon(IconNames.Sad)  // Show sad face if no message selected
        basic.pause(3000)
        basic.showIcon(IconNames.No)  // Return to "No" icon
    } else {
        radio.sendValue("msg", selectedMessage)  // Broadcast the selected message
        radio.sendValue("id", deviceID)  // Send sender's ID to prevent self-reception
        basic.showIcon(IconNames.Happy)  // Indicate message sent
        basic.pause(3000)
        showMessagePattern(selectedMessage)  // Restore the last selected message
    }
})

// Receive and process incoming messages
radio.onReceivedValue(function (name, value) {
    if (name == "id" && value == deviceID) {
        return  // Ignore own messages
    }
    if (name == "msg") {
        lastReceivedMessage = value
        showReceivedPattern()  // Show that a new message was received
        basic.pause(3000)
        showMessagePattern(lastReceivedMessage)  // Display received message or "No" icon
    }
})

// Function to display predefined LED patterns for messages
function showMessagePattern(msg: number) {
    if (msg == 1) {
        basic.showLeds(`
            # . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
        `)
    } else if (msg == 2) {
        basic.showLeds(`
            # . . . .
            # # . . .
            . . . . .
            . . . . .
            . . . . .
        `)
    } else if (msg == 3) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            . . . . .
            . . . . .
        `)
    } else if (msg == 4) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            # # # # .
            . . . . .
        `)
    } else if (msg == 5) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            # # # # .
            # # # # #
        `)
    } else {
        basic.showIcon(IconNames.No)  // Show "No" if invalid message
    }
}

// Function to show "new message received" pattern
function showReceivedPattern() {
    basic.showLeds(`
        # # # # #
        # . . . #
        # . # . #
        # . . . #
        # # # # #
    `)
}