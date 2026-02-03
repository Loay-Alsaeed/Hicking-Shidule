import React, { useEffect, useMemo, useRef, useState } from "react";
import { createConnection } from "../signalrConnection";
import { useAuth } from "../Context/AuthContext";
import { useNotificatin } from "../Context/NotificationContext";

function GlobalNotifications() {
    const { user } = useAuth();
    const userId = useMemo(() => user?.user?.id ?? user?.id ?? null, [user]);
    const connectionRef = useRef(null);
    const [toasts, setToasts] = useState([]);
    const { setNotification } = useNotificatin() || {};

    useEffect(() => {
        if (!userId) return;

        const connection = createConnection(userId);
        connectionRef.current = connection;

        const handleReceive = (notificationDto) => {
            const title = notificationDto?.Title ?? "Notification";
            const message = notificationDto?.Message ?? "";
            const created = notificationDto?.CreatedDate ?? new Date().toISOString();


            // Append to NotificationContext list if available
            if (typeof setNotification === "function") {
                setNotification((prev) => {
                    const previous = Array.isArray(prev) ? prev : [];
                    // Keep original dto, but ensure Created exists for UI sorting
                    const normalized = { ...notificationDto, Created: created };
                    return [normalized, ...previous];
                });
            }
        };

        connection.on("ReceiveNotification", handleReceive);
        connection.start().catch(() => {});

        return () => {
            try { connection.off("ReceiveNotification", handleReceive); } catch {}
            connection.stop().catch(() => {});
            connectionRef.current = null;
        };
    }, [userId]);

    if (!toasts.length) return null;

    return (
        <div
            style={{
                position: "fixed",
                right: 16,
                bottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                zIndex: 9999,
            }}
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    style={{
                        background: "#1f2937",
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: 8,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                        minWidth: 240,
                        maxWidth: 360,
                    }}
                >
                    {t.message}
                </div>
            ))}
        </div>
    );
}

export default GlobalNotifications;



