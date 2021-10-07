module.exports.genRefreshToken = () => {
    return Math.floor(Math.random() * 281474976710656).toString(16);  // creates pseudo random 12 character hexadecimal token.
}