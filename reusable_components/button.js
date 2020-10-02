const { showNotification } = require('./Notification.js')

/*
 * to order to answer the question:
 * 1) what reuable component is
 * 2) how to distiguish between Reusable and Specific one
 */

/*
 * BAD:
 * 1) has no interface
 * 2) depend on smth large (sideeffect)
 * 3) not possible to unmount, even if the parent drops the reference, child has one
 * 4) HARD testable
 */
const NotReusableNotificationButton = () => {
    let isDisabled = false
    return {
        onClick() {
            if (isDisabled) {
                return
            }
            isDisabled = true
            showNotification('NOT REUSABLE BUTTON').then(() => isDisabled = false)
        },
    }
}

const BetterReusableNotificationButton = (message) => {
    let isDisabled = false
    return {
        onClick() {
            if (isDisabled) {
                return
            }
            isDisabled = true
            showNotification(message).then(() => isDisabled = false)
        },
    }
}

/*
 * BAD:
 * 1) still memory leaks
 * GOOD:
 * 1) TESTable
 */
const ReusableNotificationButton = ({ message, triggerNotification }) => {
    let isDisabled = false
    return {
        onClick() {
            if (isDisabled) {
                return
            }
            isDisabled = true
            triggerNotification(message).then(() => isDisabled = false)
        },
    }
}

/*
 * GOOD:
 * 1) possible to kill reference - no memory leaks
 */
const BUTTON_CLICK = 'BUTTON_CLICK'
const ReusableButtonOne = (id) => ({ getState, dispatch }) => {
    return {
        onClick() {
            if (getState().button[id].isDisabled) {
                return
            }
            dispatch({type: BUTTON_CLICK, meta: { id }})
        },
    }
}

module.exports = {
    NotReusableNotificationButton,
    BetterReusableNotificationButton,
    ReusableNotificationButton,
    ReusableButtonOne,
    BUTTON_CLICK,
}
