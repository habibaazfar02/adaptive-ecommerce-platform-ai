import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client = null;

export const connectSocket = (userId, onMessage) => {
  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    onConnect: () => {
      client.subscribe(`/topic/inbox/${userId}`, (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    },
  });

  client.activate();
};

export const disconnectSocket = () => {
  if (client) client.deactivate();
};