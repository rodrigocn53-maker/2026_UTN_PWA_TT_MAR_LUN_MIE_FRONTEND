import { useEffect } from "react"
import useRequest from "./useRequest"
import { getWorkspaceById } from "../services/workspaceService"

function useWorkspace(workspace_id) {
    const { sendRequest, response, loading, error } = useRequest()

    useEffect(
        () => {
            if (workspace_id) {
                sendRequest({
                    requestCb: getWorkspaceById,
                    params: workspace_id
                })
            }
        },
        [workspace_id]
    )

    return {
        response,
        loading,
        error,
        workspace: response?.data?.workspace,
        members: response?.data?.members
    }
}

export default useWorkspace
