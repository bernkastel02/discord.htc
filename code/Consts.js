module.exports = {
    API_URL: "https://discordapp.com/api",
    CDN_URL: "https://cdn.discordapp.com/",
    RESTPoints: {
        Gateway: "/gateway?v=6",
        Channel: (cid) => `/channels/${cid}`,
        Messages: (mid) => `/channels/${mid}/messages`,
        Message: (cid, mid) => `/channels/${cid}/messages/${mid}`,
        BulkDeleteMessages: (cid) => `/channels/${cid}/message/bulk_delete`,
        PermissionsOverwrite: (cid, oid) => `/channels/${cid}/permissions/${oid}`,
        Invites: (cid) => `/channels/${cid}/invites`,
        Invite: (iid) => `/invites/${iid}`,
        Typing: (cid) => `/channels/${cid}/typing`,
        Pins: (cid) => `/channels/${cid}/pins`,
        Pinned: (cid, mid) => `/channels/${cid}/pins/${mid}`,
        GroupDMMember: (cid, uid) => `/channels/${cid}/recipients/${uid}`
    }
}