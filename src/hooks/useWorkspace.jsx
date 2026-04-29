import { useEffect } from "react"
import useRequest from "./useRequest"
import { getWorkspaceById } from "../services/workspaceService"

function useWorkspace(workspace_id) {
    const { sendRequest, response, loading, error } = useRequest()

    const fetchWorkspace = () => {
        if (workspace_id) {
            sendRequest({
                requestCb: getWorkspaceById,
                params: workspace_id
            })
        }
    }

    useEffect(
        () => {
            fetchWorkspace()
        },
        [workspace_id]
    )

    return {
        response,
        loading,
        error,
        workspace: response?.data?.workspace,
        members: response?.data?.members,
        refetchWorkspace: fetchWorkspace
    }
}

export default useWorkspace
