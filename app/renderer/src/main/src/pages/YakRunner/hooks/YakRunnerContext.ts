import {Dispatch, SetStateAction, createContext} from "react"
import {FileNodeProps} from "../FileTree/FileTreeType"
import { AreaInfoProps } from "../YakRunnerType"
import { FileDetailInfo } from "../RunnerTabs/RunnerTabsType"

export interface YakRunnerContextStore {
    fileTree: FileNodeProps[]
    areaInfo: AreaInfoProps[]
    activeFile: FileDetailInfo | undefined
    runnerTabsId: string | undefined
}

export interface YakRunnerContextDispatcher {
    setFileTree?: Dispatch<SetStateAction<FileNodeProps[]>>
    handleFileLoadData?: (node: FileNodeProps) => Promise<any>
    setAreaInfo?: Dispatch<SetStateAction<AreaInfoProps[]>>
    setActiveFile?: Dispatch<SetStateAction<FileDetailInfo|undefined>>
    setRunnerTabsId?: Dispatch<SetStateAction<string|undefined>>
}

export interface YakRunnerContextValue {
    store: YakRunnerContextStore
    dispatcher: YakRunnerContextDispatcher
}

export default createContext<YakRunnerContextValue>({
    store: {
        fileTree: [],
        areaInfo: [],
        activeFile: undefined,
        runnerTabsId: undefined
    },
    dispatcher: {
        setFileTree: undefined,
        handleFileLoadData: undefined,
        setAreaInfo: undefined,
        setActiveFile: undefined,
        setRunnerTabsId: undefined
    }
})
