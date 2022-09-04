/*----------------------------------------------------------------
     Resource: vNetworkify
     Script: managers: socket: client.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: Client Manager
----------------------------------------------------------------*/


//////////////
// Imports //
//////////////

const CUtility = require("../../utilities")
const CNetwork = require("../../utilities/network")


////////////////////
// Class: Client //
////////////////////

CNetwork.fetch("vNetworkify:Socket:onCreate").on((socket) => {
    if (!CUtility.isServer) return false
    const CClient = CUtility.Class()
    socket.public.client = CClient.public
    CClient.private.buffer = {}

    const onSocketDestroy = function(__socket) {
        if ((socket.public != __socket.public) || (socket.private != __socket.private)) return
        CNetwork.fetch("vNetworkify:Socket:onDestroy").off(onSocketDestroy)
        for (const i in CClient.private.buffer) {
            CClient.private.buffer[i].destroy()
        }
        CClient.private.isUnloaded = true
        delete socket.public.client
    }
    CNetwork.fetch("vNetworkify:Socket:onDestroy").on(onSocketDestroy)


    /////////////////////
    // Static Members //
    /////////////////////

    // @Desc: Fetches client instance by VID or socket
    CClient.public.addMethod("fetch", (vid, socket, isFetchSocket) => {
        if (CClient.private.isUnloaded) return false
        vid = vid || CUtility.vid.fetch(socket, null, true)
        return (vid && CClient.private.buffer[vid] && ((isFetchSocket && CClient.private.buffer[vid].socket) || CClient.private.buffer[vid])) || false
    })

    // @Desc: Creates a fresh client w/ specified socket
    CClient.public.addMethod("create", (socket) => {
        if (CClient.private.isUnloaded) return false
        if (!CUtility.isObject(socket) || CClient.public.fetch(null, socket)) return false
        const cInstance = CClient.public.createInstance(socket)
        const vid = CUtility.vid.fetch(cInstance, null, true)
        CClient.private.buffer[vid] = cInstance
        return cInstance
    })

    // @Desc: Destroys an existing client by specified VID or socket
    CClient.public.addMethod("destroy", (vid, socket) => {
        if (CClient.private.isUnloaded) return false
        vid = vid || CUtility.vid.fetch(socket, null, true)
        if (!CClient.public.fetch(vid)) return false
        return CClient.private.buffer[vid].destroy()
    })


    ///////////////////////
    // Instance Members //
    ///////////////////////

    // @Desc: Instance constructor
    CClient.public.addMethod("constructor", (self, socket) => {
        if (CClient.private.isUnloaded) return false
        CUtility.vid.fetch(self, CUtility.vid.fetch(socket))
        self.socket = socket
        self.timer = {}
    })

    // @Desc: Destroys the instance
    CClient.public.addInstanceMethod("destroy", (self) => {
        if (CClient.private.isUnloaded) return false
        const vid = CUtility.vid.fetch(self, null, true)
        if (CClient.private.buffer[vid].queue) {
            for (const i in CClient.private.buffer[vid].queue) {
                CClient.private.buffer[vid].queue[i].reject()
            }
        }
        CClient.private.buffer[vid].socket.send(CUtility.toBase64(JSON.stringify({disconnect: (socket.private["@disconnect"] && socket.private["@disconnect"].reason) || (self["@disconnect"] && self["@disconnect"].reason)})))
        CClient.private.buffer[vid].socket.close()
        for (const i in CClient.private.buffer[vid].timer) {
            clearTimeout(CClient.private.buffer[vid].timer[i])
        }
        delete CClient.private.buffer[vid]
        delete socket.private.client[vid]
        self.destroyInstance()
        return true
    })
})