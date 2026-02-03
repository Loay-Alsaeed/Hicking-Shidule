import { MdOutlineNotificationsActive } from "react-icons/md";
import { useNotificatin } from "../Context/NotificationContext";
import { useEffect, useRef, useState } from "react";

const NotificationDisplay = () => {
const {notification, setNotification} = useNotificatin();
const [showNotification, setshowNotification] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);
const prevLenRef = useRef(notification?.length ?? 0);

const formatDateTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

useEffect(() => {
    const currentLen = Array.isArray(notification) ? notification.length : 0;
    const prevLen = prevLenRef.current;
    if (!showNotification && currentLen > prevLen) {
        setUnreadCount((c) => c + (currentLen - prevLen));
    }
    prevLenRef.current = currentLen;
}, [notification, showNotification]);

const handleToggle = () => {
    const next = !showNotification;
    setshowNotification(next);
    if (next) setUnreadCount(0);
};

    return (
        <>
        <div className="">

            <div className="fixed bottom-2.5 right-2.5 z-50">
                <div className="relative">
                    <div className="p-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors text-white shadow-lg cursor-pointer"
                        onClick={handleToggle}>
                        <MdOutlineNotificationsActive size={24} />
                    </div>
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </div>
            </div>

            {showNotification === true && (
                <div className="w-[320px] max-h-[440px] bg-white fixed bottom-14 right-3 z-50 rounded-2xl p-4 shadow-2xl overflow-auto border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                        <button
                            className="text-xs text-indigo-600 hover:text-indigo-700 cursor-pointer"
                            onClick={() => setNotification([])}
                        >
                            Clear all
                        </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {notification && notification.length > 0 ? (
                            notification.map((n, idx) => {
                                const title = n?.Title ?? n?.title ?? "Notification";
                                const message = n?.Message ?? n?.message ?? "";
                                const createdRaw = n?.CreatedDate ?? n?.Created ?? n?.createdDate;
                                const created = formatDateTime(createdRaw);
                                return (
                                    <div key={idx} className="py-2 group flex items-start gap-2">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-indigo-400 shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[14px] text-gray-900 font-medium truncate">{title}</h4>
                                            {!!message && (
                                                <p className="text-[12px] text-gray-600 break-wrap-break-word">{message}</p>
                                            )}
                                            <p className="text-[10px] text-gray-400 mt-0.5">{created}</p>
                                        </div>
                                        <button
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity text-xs px-1 cursor-pointer"
                                            onClick={() => {
                                                setNotification((prev) => (Array.isArray(prev) ? prev.filter((_, i) => i !== idx) : prev));
                                            }}
                                            aria-label="Remove notification"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-6 text-center text-sm text-gray-400">No notifications</div>
                        )}
                    </div>
                </div>
            )}
            
        </div>
        </>
    );

}
export default NotificationDisplay;