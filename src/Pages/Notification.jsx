import React, { useEffect, useMemo, useRef, useState } from "react";
import { createConnection } from "../signalrConnection";
import { useAuth } from "../Context/AuthContext";

function Notifications() {
    const { user } = useAuth();
    const userId = useMemo(() => user?.user?.id ?? user?.id ?? null, [user]);
    const connectionRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [toasts, setToasts] = useState([]);
    const [status, setStatus] = useState("idle");

    useEffect(() => {
        if (!userId) return;

        // Avoid duplicate connections if GlobalNotifications is mounted
        if (connectionRef.current) return;
        const connection = createConnection(userId);
        connectionRef.current = connection;

        const handleReceive = (message) => {
            const text = typeof message === "string" ? message : JSON.stringify(message);
            setMessages((prev) => [...prev, text]);
            const id = Date.now() + Math.random();
            setToasts((prev) => [...prev, { id, message: text }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 4000);
        };

        connection.on("ReceiveNotification", handleReceive);

        connection
            .start()
            .then(() => {
                setStatus("connected");
                console.info("SignalR connected as", userId);
            })
            .catch((err) => {
                setStatus("failed");
                console.error("SignalR start failed:", err);
            });

        connection.onreconnecting((err) => {
            setStatus("reconnecting");
            console.warn("SignalR reconnecting:", err?.message);
        });
        connection.onreconnected((cid) => {
            setStatus("connected");
            console.info("SignalR reconnected, connectionId:", cid);
        });
        connection.onclose((err) => {
            setStatus("closed");
            if (err) console.warn("SignalR closed:", err?.message);
        });

        return () => {
            try {
                connection.off("ReceiveNotification", handleReceive);
            } catch {}
            try {
                connection.stop().catch(() => {});
            } finally {
                connectionRef.current = null;
            }
        };
    }, [userId]);

    return (
        <div style={{ padding: 16 }}>
            <h4>Notifications:</h4>
            {!userId && (
                <div style={{ color: "#b91c1c", marginBottom: 12 }}>
                    No user detected. Please login to receive notifications.
                </div>
            )}
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
                Status: {status} {userId ? `(userId: ${userId})` : ""}
            </div>
            {messages.map((m, i) => (
                <div key={i}>{m}</div>
            ))}

            <button
                type="button"
                onClick={() => {
                    const id = Date.now() + Math.random();
                    const message = "Test notification";
                    setToasts((prev) => [...prev, { id, message }]);
                    setTimeout(() => {
                        setToasts((prev) => prev.filter((t) => t.id !== id));
                    }, 2000);
                }}
                style={{
                    marginTop: 12,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: "#2563eb",
                    color: "#fff",
                    border: 0,
                    cursor: "pointer",
                }}
            >
                Test Toast
            </button>

            {/* Toast container */}
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
        </div>
    );
}

export default Notifications;
