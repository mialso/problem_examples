const {
    NotReusableNotificationButton,
    BetterReusableNotificationButton,
    ReusableButtonOne, BUTTON_CLICK,
} = require('./button.js')
const {
    showTimedNotificationPromise,
    showTimedNotification, NOTIFICATION_START, NOTIFICATION_COMPLETE,
} = require('./Notification.js')

/*
 * application requirement: show notification on button click
 * 1) User is unable to show second notification once first is still in progresss
 */

/*
 * DOMAIN MODEL:
 * BUTTON -> CLICKable 
 * NOTIFICATION -> SHOWable
 * someone how can SHOW
 * 
 * something is absent.. the glue?
 */

// BAD: HOW TO TEST???
function bad() {
    const button = NotReusableNotificationButton()
    button.onClick() // was it shown? run the app and check
    button.onClick() // was it NOT shown? run the app and check
    button.onClick() // was it NOT shown? run the app and check
    // HOW to STOP? CLEAN_UP?
}

/*
 * application requirement: show custom notification on button click
 * 2) User is unable to show second notification once first is still in progresss
 */
// I WANT to show next one, and clean up prev? HOW???
function better() {
    const betterButton = BetterReusableNotificationButton('BETTER_BUTTON')
    betterButton.onClick() // was it shown? run the app and check
    betterButton.onClick() // was it NOT shown? run the app and check
}







// HOW to fix??
/*
 * REQUIREMENTs!!!!
 * EVENT FLOW: RENDER_BUTTON -> CLICK -> MESSAGE -> DISABLE -> RENDER_NOTIFICATION -> WAIT RESULT -> ENABLE BUTTON
 * + REMOVE BUTTON at some point --- CLEAN_UP
 * the question: should we crete THE MESSAGE after CLICK? before CLICK?
 * if before - should we be able to RENDER_BUTTON the button while MESSAGE is not ready?
 * if after - what if the MESSAGE is not available?
 */

function storeManagerVersionOne() {
    const NOTIFICATION_BUTTON = 'notification'

    function createStateManager() {
        const state = {
            button: {
                [NOTIFICATION_BUTTON]: { isDisabled: false },
            },
        }
        return {
            getState() { return state },
            dispatch(message) {
                switch (message.type) {
                    case BUTTON_CLICK: {
                        state.button[message.meta.id].isDisabled = true
                        showTimedNotificationPromise({ text: 'STATE MANAGER here', timeoutMsec: 2000 })
                            // HEY, the whole STATE possibly a HUGE memory leak
                            .then(() => state.button[message.meta.id].isDisabled = false)
                    }
                    default: break
                }
            },
        }
    }

    const stateManager = createStateManager()
    const NotificationButton = ReusableButtonOne(NOTIFICATION_BUTTON)
    const notificationButton = NotificationButton(stateManager)
    notificationButton.onClick()
    notificationButton.onClick()
}

/*
 * LATEST, without memory leaks
 */

function storeManagerVersionTwo() {
    const NOTIFICATION_BUTTON = 'notification'
    const NotificationMessage = showTimedNotification({ text: 'STATE MANAGER 2', timeoutMsec: 2000 })
    const NotificationButton = ReusableButtonOne(NOTIFICATION_BUTTON)

    function createStateManager() {
        const state = {
            button: {
                [NOTIFICATION_BUTTON]: { isDisabled: false },
            },
            notification: { inProgress: false },
        }
        function dispatch(message) {
            switch (message.type) {
                case BUTTON_CLICK: {
                    state.button[message.meta.id].isDisabled = true
                    NotificationMessage({ getState: () => state, dispatch })
                    break
                }
                case NOTIFICATION_START: {
                    state.notification.inProgress = true
                    break
                }
                case NOTIFICATION_COMPLETE: {
                    state.notification.inProgress = true
                    break
                }
                default: break
            }
        }
        return {
            getState() { return state },
            dispatch,
        }
    }

    const stateManager = createStateManager()
    const notificationButton = NotificationButton(stateManager)
    notificationButton.onClick()
    notificationButton.onClick()
}

storeManagerVersionTwo()
