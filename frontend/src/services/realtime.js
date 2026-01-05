import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

/**
 * Connects to Spring Boot WebSocket for Inventory/Price updates.
 */
export function connectInventory(onMessage) {
  const socket = new SockJS('http://localhost:8080/ws');
  const client = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      // Subscribe to the global inventory topic
      client.subscribe('/topic/inventory', (msg) => {
        const body = JSON.parse(msg.body);
        onMessage(body); // Updates the HomePage state
      });
    },
  });

  client.activate();
  return () => client.deactivate();
}