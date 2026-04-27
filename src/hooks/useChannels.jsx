import { useEffect } from "react"
import useRequest from "./useRequest"
import { getChannels } from "../services/channelService"

function useChannels(workspace_id) {
    const { sendRequest, response, loading, error } = useRequest()

    const fetchChannels = () => {
        if (workspace_id) {
            sendRequest({
                requestCb: () => getChannels(workspace_id)
            })
        }
    }

    useEffect(
        () => {
            fetchChannels()
        },
        [workspace_id]
    )

    return {
        response,
        loading,
        error,
        channels: response?.data?.channels || [],
        refetchChannels: fetchChannels
    }
}

export default useChannels
