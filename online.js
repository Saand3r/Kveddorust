const Gamedig = require('gamedig');
async function onlinePlay() {
  Gamedig.query({
    type: 'rust',
    host: 'oslo14.spillvert.no',
    port: 28215,
    requestRules: true
}).then((state) => {
    var numplayers = state.raw.numplayers;
    var maxplayers = state.maxplayers;
    console.log("There are currently " + numplayers + " of " + maxplayers + " players online");
    //document.getElementById('online').textContent = "da";
    return;
}).catch((error) => {
    console.log("Sumthing went wrong" + error);
})};
/* module.exports = onlinePlay(); */