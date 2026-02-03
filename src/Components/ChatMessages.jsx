import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createConnection } from "../signalrConnection";
import { useAuth } from "../Context/AuthContext";


const ChatMessages = ({ chatmessage }) => {
  const { user } = useAuth();
  const [tripId, setTripId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatId, setChatId] = useState(null);
  
  const userId = useMemo(() => user?.user?.id ?? user?.id ?? null, [user]);
  // const currentChatId = useMemo(() => {
  //   if (messages.length > 0 && messages[0].chatId) {
  //     return messages[0].chatId;
  //   }
  //   return chatmessage?.chatId ?? null;
  // }, [messages, chatmessage]);


  useEffect(() => {
    console.log('messages updated: ', messages);
  }, [messages]);

  const getMessages = useCallback(async (tripIdToFetch) => {
    if (!tripIdToFetch) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${baseUrl}/api/message/tripid/${tripIdToFetch}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload?.message || `HTTP error! status: ${response.status}`
        );
      }

      console.log('messages: ', payload);
      setChatId(payload.chatId);
      // console.log('ChatID: ', payload.chatId);
      setMessages(Array.isArray(payload.messages) ? payload.messages : []);
      
    } catch (err) {
      console.error("Failed to load messages", err);
      setError(err instanceof Error ? err.message : "Failed to load messages.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);


  // const connectionRef = useRef(null);
  // const systemMessageKeysRef = useRef(new Map());

// useEffect(() => {
//   systemMessageKeysRef.current.clear();
// }, [chatId]);

useEffect(() => {
  if (!userId) return;

  const connection = createConnection(userId);
  // connectionRef.current = connection;


  connection.on("NewMessage", (newMessage) => {
    console.log("New message received:", newMessage);

    const messageChatId = newMessage?.chatId ?? newMessage?.ChatId;
    console.log('messageChatId: ', messageChatId);
    console.log(messageChatId === chatId);
    if (messageChatId && messageChatId === chatId) {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });

      console.log('messages', messages);
    }
  });

  connection.on("AddRemoveMemberToChat",(AddRemoveMessageResponce) => {
    console.log('AddRemoveMemberToChat => ', AddRemoveMessageResponce);

    const messageChatId = AddRemoveMessageResponce?.chatId ?? AddRemoveMessageResponce?.ChatId;
    if (messageChatId && messageChatId === chatId) {
      // const normalizedMessage = {
      //   ...AddRemoveMessageResponce,
      //   addRemoveMassage:
      //     AddRemoveMessageResponce?.addRemoveMassage ??
      //     AddRemoveMessageResponce?.AddRemoveMassage ??
      //     AddRemoveMessageResponce?.addRemoveMessage ??
      //     AddRemoveMessageResponce?.AddRemoveMessage ??
      //     true,
      // };

      setMessages((prev) => {
        // const dedupeKey = `${messageChatId ?? ""}::${(normalizedMessage?.message ?? "").trim()}`;
        // const now = Date.now();
        // const lastTs = systemMessageKeysRef.current.get(dedupeKey);
        // const dedupeWindowMs = 2000;

        // if (lastTs && now - lastTs < dedupeWindowMs) {
        //   return prev;
        // }

        // const normalizedId =
        //   normalizedMessage?.id ??
        //   normalizedMessage?.Id ??
        //   normalizedMessage?._id;

        // const exists = prev.some((msg) => {
        //   const existingId = msg?.id ?? msg?.Id ?? msg?._id;
        //   if (normalizedId && existingId) {
        //     return existingId === normalizedId;
        //   }

        //   const existingIsSystem =
        //     msg?.addRemoveMassage ??
        //     msg?.AddRemoveMassage ??
        //     msg?.addRemoveMessage ??
        //     msg?.AddRemoveMessage ??
        //     false;

        //   const normalizedIsSystem = normalizedMessage.addRemoveMassage;

        //   return (
        //     existingIsSystem === normalizedIsSystem &&
        //     (msg?.message ?? "").trim() ===
        //       (normalizedMessage?.message ?? "").trim() &&
        //     (msg?.chatId ?? msg?.ChatId) ===
        //       (normalizedMessage?.chatId ?? normalizedMessage?.ChatId)
        //   );
        // });

        // if (exists) {
        //   systemMessageKeysRef.current.set(dedupeKey, now);
        //   return prev;
        // }

        // systemMessageKeysRef.current.set(dedupeKey, now);
        // return [...prev, normalizedMessage];

        return [...prev, AddRemoveMessageResponce];
      });
    }
  })

  connection
    .start()
    .then(() => console.log("SignalR Connected"))
    .catch((err) => console.error("SignalR connection error:", err));

  return () => {
    connection.off("NewMessage");
    connection.off("AddRemoveMemberToChat");
    connection.stop();
    // connectionRef.current = null;
  };
}, [userId, chatId]);


  useEffect(() => {
    if (!chatmessage?.id) {
      setTripId(null);
      setMessages([]);
      return;
    }

    setTripId(chatmessage.id);
    getMessages(chatmessage.id);
  }, [chatmessage, getMessages]);


  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
    setError(null);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    // console.log('chatMessage: ', chatmessage);

    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage || !tripId || sending) {
      return;
    }

    const userId = user?.user?.id ?? user?.id ?? null;
    if (!userId) {
      setError("You need to be logged in to send messages.");
      return;
    }

    // console.log('ChatId: ', chatmessage.id);

    // const chatId = currentChatId;
    // console.log('ChatID: ', chatId);

    // const tripId = chatmessage.id;

    if (!chatId) {
      setError("Chat is not available for this trip.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/Message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain",
        },
        body: JSON.stringify({
          chatId,
          userId,
          message: trimmedMessage,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      let responseBody = null;

      if (contentType.includes("application/json")) {
        responseBody = await response.json();
      } else {
        const text = await response.text();
        responseBody = text ? { message: text } : null;
      }

      if (!response.ok) {
        throw new Error(
          (responseBody && (responseBody.message || responseBody.error)) ||
            `HTTP error! status: ${response.status}`
        );
      }

      setMessageInput("");

      if (responseBody && !Array.isArray(responseBody)) {
        console.log('responseBody: ', responseBody);
        setMessages((prev) => [...prev, responseBody]);
      } else {
        // If response is not a single message, refresh the list
        // await getMessages(tripId);
      }
    } catch (err) {
      console.error("Failed to send message", err);
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  let content = null;

  if (!tripId) {
    content = (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-500">Select a trip to view the chat.</p>
      </div>
    );
  } else if (loading) {
    content = (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <p className="text-red-500">Unable to load messages.</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  } else if (messages.length === 0) {
    content = (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-500">No messages yet.</p>
      </div>
    );
  } else {
    content = (
      <div className="grid gap-2 ">
        {messages.map((message) => {
          const isSystemMessage =
            message?.addRemoveMassage ??
            message?.AddRemoveMassage ??
            message?.addRemoveMessage ??
            message?.AddRemoveMessage ??
            false;

          return !isSystemMessage ? (
            <div
              key={message.id ?? message._id ?? `${message.message}-${tripId}`}
              className={`flex  ${message.userId === userId? "justify-start" : "justify-end"}`}
            >
              <div>
                <p className="text-[10px]">{message.userName}</p>
                <div className={`flex justify-between rounded-2xl shadow align-bottom items-end px-3 py-2 gap-2
                  ${message.userId === userId? "bg-indigo-200" : "bg-white"}`}>
                  <p className={`w-fit max-w-[80%] rounded-2xl  text-sm 
                      `}>
                    {message.message}
                  </p>
                  <p className="text-[9px]">{new Date(message.createdAt).getHours()} : {new Date(message.createdAt).getMinutes()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={message.message ?? `${message.message}-${new Date().getMilliseconds()}-${tripId}-${message.id}`}
              className="flex justify-center"
            >
              <div className="flex justify-between rounded-2xl shadow align-bottom items-end px-3 py-2 gap-2">
                <p className={`w-[80%] rounded-2xl text-[12px] text-center text-nowrap text-gray-500`}>
                  {message.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div
        className=" min-h-[150px] flex-1 overflow-y-auto rounded-2xl bg-gray-100 px-4 py-3"
      >
        <div className="flex flex-col justify-end h-full min-h-[150px]">
          {content}
          {/* {console.log('content: ', content)} */}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <input
          type="text"
          name="message"
          value={messageInput}
          onChange={handleInputChange}
          disabled={!tripId || sending}
          className="h-10 flex-1 rounded-2xl border border-transparent bg-white px-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder={tripId ? "Type a message..." : "Select a trip to start chatting"}
        />
        <button
          type="submit"
          disabled={!messageInput.trim() || !tripId || sending}
          className="inline-flex h-10 items-center justify-center rounded-2xl bg-indigo-500 px-4 text-sm font-semibold text-white shadow transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatMessages;