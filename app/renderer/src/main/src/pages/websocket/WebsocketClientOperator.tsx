import React, {useEffect, useState} from "react";
import {ResizeBox} from "@/components/ResizeBox";
import {AutoCard} from "@/components/AutoCard";
import {useGetState, useMemoizedFn} from "ahooks";
import {Button, Space} from "antd";
import {YakEditor} from "@/utils/editors";
import {StringToUint8Array} from "@/utils/str";
import {randomString} from "@/utils/randomUtil";
import {failed, info} from "@/utils/notification";

export interface WebsocketClientOperatorProp {
    request?: Uint8Array
}

const {ipcRenderer} = window.require("electron");

export const WebsocketClientOperator: React.FC<WebsocketClientOperatorProp> = (props) => {
    const [_executing, setExecuting, getExecuting] = useGetState(false);
    const [_request, setRequest, getRequest] = useGetState(props.request ? props.request : new Uint8Array);
    const [_toServer, setToServer, getToServer] = useGetState("");

    // 设置随机字符串
    //    这个要通过 finished 的时候来搞
    const [_token, setToken, getToken] = useGetState(randomString(30));

    // 数据通道
    useEffect(() => {
        const token = getToken()
        ipcRenderer.on(`${token}-data`, async (e, data: any) => {
            console.info(data)
        })
        ipcRenderer.on(`${token}-error`, (e, error) => {
            failed(`[CreateWebsocketFuzzer] error:  ${error}`)
        })
        ipcRenderer.on(`${token}-end`, (e, data) => {
            info("[CreateWebsocketFuzzer] finished")
            setToken(randomString(30))
        })
        return () => {
            ipcRenderer.invoke("cancel-CreateWebsocketFuzzer", token)
            ipcRenderer.removeAllListeners(`${token}-data`)
            ipcRenderer.removeAllListeners(`${token}-error`)
            ipcRenderer.removeAllListeners(`${token}-end`)
        }
    }, [_token])

    const submit = useMemoizedFn(() => {
        ipcRenderer.invoke("CreateWebsocketFuzzer", {
            UpgradeRequest: getRequest(),
            IsTLS: false,
            ToServer: StringToUint8Array(getToServer()),
        }, getToken()).then(() => {
        })
    })

    return <ResizeBox
        isVer={true}
        firstNode={() => {
            return <AutoCard
                size={"small"} bordered={true} title={"创建 Websocket 请求"}
                bodyStyle={{padding: 0}}
                extra={(
                    <Space>
                        <Button
                            size={"small"}
                            type={"primary"}
                            onClick={() => {
                                submit()
                            }}
                        >
                            启动连接
                        </Button>
                    </Space>
                )}
            >
                <YakEditor
                    readOnly={getExecuting()}
                    noLineNumber={true}
                    type={"http"}
                    valueBytes={getRequest()}
                    setValue={s => {
                        setRequest(StringToUint8Array(s, "utf8"))
                    }}
                />
            </AutoCard>
        }}
        firstRatio={"300px"}
        firstMinSize={"300px"}
        secondNode={() => {
            return <AutoCard
                size={"small"} bordered={false}
                extra={<Space>
                    <Button size={"small"} type={"primary"}>发送</Button>
                </Space>}
                bodyStyle={{padding: 0}}
                title={"发送数据"}
            >
                <YakEditor
                    // readOnly={!getExecuting()}
                    lineNumbersMinChars={3}
                    type={"html"}
                    value={getToServer()}
                    setValue={setToServer}
                />
            </AutoCard>
        }}
    />
};