import {UserInfoProps} from "@/store"
import {NetWorkApi} from "@/services/fetch"
import {API} from "@/services/swagger/resposeType"
import {getRemoteValue,setRemoteValue} from "./kv"
import {GetReleaseEdition, isCommunityEdition, globalUserLogout} from "@/utils/envfile"
import {RemoteGV} from "@/yakitGV";
const {ipcRenderer} = window.require("electron")

export const loginOut = (userInfo: UserInfoProps) => {
    if (!userInfo.isLogin) return
    NetWorkApi<null, API.ActionSucceeded>({
        method: "get",
        url: "logout/online"
    })
        .then((res) => {
            loginOutLocal(userInfo)
        })
        .catch((e) => {})
        .finally(globalUserLogout)
}

export const loginOutLocal = (userInfo: UserInfoProps) => {
    if (!userInfo.isLogin) return
    getRemoteValue("httpSetting").then((setting) => {
        if (!setting) return
        const values = JSON.parse(setting)
        const OnlineBaseUrl:string  = values.BaseUrl
        ipcRenderer
        .invoke("DeletePluginByUserID", {
            UserID: userInfo.user_id,
            OnlineBaseUrl
        })
        .finally(() => {
            ipcRenderer.send("user-sign-out")
        })
    })
    
}

export const refreshToken = (userInfo: UserInfoProps) => {
    if (!userInfo.isLogin) return
    NetWorkApi<null, API.ActionSucceeded>({
        method: "get",
        url: "refresh/token/online"
    })
        .then((res) => {})
        .catch((e) => {})
}
