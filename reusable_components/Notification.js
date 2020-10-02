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
const showTimedNotification = ({ text, timeoutMsec }) => new Promise((resolve) => {
    console.info(`NOTIFICATION: ${text}`)
    setTimeout(() => resolve(), timeoutMsec)
})

module.exports = {
    showNotification,
    showTimedNotification,
}
