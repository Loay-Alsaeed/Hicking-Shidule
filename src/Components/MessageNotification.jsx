import { useEffect, useState } from "react";
import { createConnection } from "../signalrConnection";
import { useAuth } from "../Context/AuthContext";


const MessageNotificatin = () => {
    const { user } = useAuth();
    const userId = useMemo(() => user?.user?.id ?? user?.id ?? null, [user]);

    useEffect(() => {

    }, [userId]);




    return (
        <>
        </>
    );
}
export default MessageNotificatin;