import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useState } from "react";
import { useTrips } from "../Context/TripContext";
import ChatMessages from "./ChatMessages";

const ChatTap = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState(null);
  const { registeredTrips } = useTrips();

  const toggleChat = () => {
    setChatOpen((prev) => !prev);
  };

  const handleTripSelect = (trip) => {
    setChatMessage(trip);
    if (!chatOpen) {
      setChatOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleChat}
        className="fixed bottom-18 right-3 z-50 rounded-full bg-indigo-500 p-2 text-white shadow-lg transition hover:bg-indigo-600"
        aria-label={chatOpen ? "Close chat" : "Open chat"}
      >
        <IoChatbubbleEllipsesOutline size={24} />
      </button>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-gray-100 p-6">
          <div className="flex h-[600px] w-full max-w-5xl flex-col rounded-2xl bg-white p-4 shadow-2xl">
            <div className="flex">
              <div className="flex w-full flex-nowrap gap-2 overflow-x-auto">
                {registeredTrips.map((trip) => (
                  <button
                    key={trip?.id ?? trip?.tripId ?? trip?.name}
                    type="button"
                    className={`flex w-fit  flex-col items-center gap-1 rounded-xl border border-transparent transition hover:border-indigo-400 ${
                      chatMessage?.id === trip?.id ? "border-indigo-500" : ""
                    }`}
                    onClick={() => handleTripSelect(trip)}
                  >
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={`${import.meta.env.VITE_API_URL}/api/trip/image/${trip.imagePath}`}
                      alt={trip.name}
                    />
                    <p className="text-xs w-[80px] overflow-hidden text-nowrap text-gray-700" title={trip.name}>
                      {trip.name}
                    </p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-lg font-semibold text-gray-500 transition hover:text-red-500"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="mt-4 h-[490px] ">
              <ChatMessages chatmessage={chatMessage} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatTap;