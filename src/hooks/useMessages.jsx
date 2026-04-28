import { useEffect, useState, useCallback } from "react"
import { getMessages as getMessagesAPI } from "../services/messageService"

function useMessages(workspace_id, channel_id) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState(null);

    const fetchMessages = useCallback(async (isInitial = false) => {
        if (!workspace_id || !channel_id) return;
        if (isInitial) setLoading(true);
        setIsSyncing(true);
        try {
            const data = await getMessagesAPI(workspace_id, channel_id);
            setMessages(data?.data?.messages || []);
            setLoading(false);
            setIsSyncing(false);
        } catch (err) {
            setError(err);
            setLoading(false);
            setIsSyncing(false);
        }
    }, [workspace_id, channel_id]);

    useEffect(() => {
        setMessages([]);
        fetchMessages(true);
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchMessages(false);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const addOptimisticMessage = useCallback((newMessage) => {
        setMessages(prev => [...prev, newMessage]);
    }, []);

    return {
        messages,
        loading,
        isSyncing,
        error,
        refetchMessages: fetchMessages,
        addOptimisticMessage
    }
}

export default useMessages
