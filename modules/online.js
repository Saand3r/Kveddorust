const Gamedig = require('gamedig');
async function onlinePlay() {
  Gamedig.query({
    type: 'rust',
    host: 'oslo14.spillvert.no',
    port: 28216,
    requestRules: true
}).then((state) => {
    const response = state;
    //const data = await response.json();
    //const { numplayers, max}
    console.log(response);
    //document.getElementById('online').textContent = "da";
    return response.numplayers;
}).catch((error) => {
    console.log("Sumthing went wrong" + error);
})};
module.exports = onlinePlay();