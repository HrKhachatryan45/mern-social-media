export const getFullTime =  (date) => {
    const realData = new Date(date)

    const hours = padZero(realData.getHours())
    const minutes = padZero(realData.getMinutes())


    return `${hours}:${minutes}`
}


function padZero(number) {
    return number.toString().padStart(2, "0");
}