const utility = {
    validateMobileNumber,
    generateRandomNumber,
    isEmpty,
    isValidIP,
    generateRandomAlphaNumericString,
    validateEmail,
    isPasswordValid,
    getCleanString,
    convertCamelCaseToSentenceCase,
};

export default utility;

function validateMobileNumber(mobileNumber) {
    let pattern = /^[1-9]\d{9}$/;
    return pattern.test(mobileNumber);
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isPasswordValid(password) {
    let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return reg.test(password);
}

function isValidIP(IP) {
    let reg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return reg.test(IP);
}

function isEmpty(string) {
    return !string || string.trim().length === 0;
}

function generateRandomAlphaNumericString(length) {
    let randomAlphaNumericString = "";
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < length; i++)
        randomAlphaNumericString += charset.charAt(Math.floor(Math.random() * charset.length));
    return randomAlphaNumericString;
}

function generateRandomNumber(length) {
    let randomAlphaNumericString = "";
    let charset = "0123456789";
    for (let i = 0; i < length; i++)
        randomAlphaNumericString += charset.charAt(Math.floor(Math.random() * charset.length));
    return parseInt(randomAlphaNumericString);
}

function getCleanString(str) {
    return str.replace(/['"]+/g, '');
}
function convertCamelCaseToSentenceCase(str) {
    return str
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function (str) { return str.toUpperCase(); })
    //    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}