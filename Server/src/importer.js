
/*----------------------------------------------------------------
     Resource: vNetworkify
     Script: loader.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: Module Loader
----------------------------------------------------------------*/


//////////////
// Imports //
//////////////

const CNetworkify = require("./managers/server")
const CUtility = require("./utilities")
require("./managers/network")
require("./managers/rest")
require("./managers/socket")


//////////////
// Exports //
//////////////

const vNetworkify = CUtility.createAPIs(CNetworkify, {
    network: true
})
vNetworkify.utility = CUtility
CUtility.global.vNetworkify = vNetworkify
module.exports = vNetworkify