import * as signalR from "@microsoft/signalr";

export const createConnection = (userId) => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`https://localhost:7198/notificationHub?userId=${userId}`)
    .withAutomaticReconnect()
    .build();
};
