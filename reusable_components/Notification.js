/*
 * GOOD:
 * 1) simple, small, do one job, no sideeffect(?)
 * 2) clear interface
 * BAD:
 * 1) not clear what it does actually - bad name
 * 2) not that useful :)
 */
const showNotification = (text) => new Promise((resolve) => {
    console.info(`NOTIFICATION: ${text}`)
    setTimeout(() => resolve(), 1000)
})
/*
 * BETTER:
 * 1) name
 * 2) robust interface
 */
const showTimedNotificationPromise = ({ text, timeoutMsec }) => new Promise((resolve) => {
    console.info(`NOTIFICATION: ${text}`)
    setTimeout(() => resolve(), timeoutMsec)
})

const NOTIFICATION_START = 'NOTIFICATION_START'
const NOTIFICATION_COMPLETE = 'NOTIFICATION_COMPLETE'
const showTimedNotification = ({text, timeoutMsec}) => ({ getState, dispatch }) => {
    if (getState().notification.inProgress) {
        return
    }
    dispatch({ type: NOTIFICATION_START })
    console.info(`NOTIFICATION: ${text}`)
    setTimeout(() => {
        dispatch({ type: NOTIFICATION_COMPLETE })
    }, timeoutMsec)
}

module.exports = {
    showNotification,
    showTimedNotificationPromise,
    showTimedNotification,
    NOTIFICATION_START,
    NOTIFICATION_COMPLETE,
}
