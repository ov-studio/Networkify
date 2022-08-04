/*----------------------------------------------------------------
     Resource: vNetworkify
     Script: importer.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: Module Importer
----------------------------------------------------------------*/


//////////////
// Imports //
//////////////

const CUtility = require("./utilities")
const CServer = require("./managers/server")
require("./managers/rest")
require("./managers/socket/")
require("./managers/socket/client")
require("./managers/socket/network")
/*
require("./managers/socket/room")
*/


//////////////
// Exports //
//////////////

const vNetworkify = CUtility.createAPIs(CServer)
vNetworkify.util = CUtility
CUtility.global.vNetworkify = vNetworkify
module.exports = vNetworkify