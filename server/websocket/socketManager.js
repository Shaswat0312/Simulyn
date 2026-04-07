import { WebSocketServer } from "ws";

let wss = null
export const initSocket = (server) =>
{
    wss = new WebSocketServer({server})
    wss.on('connection', (socket) => {
  console.log('Client connected to WebSocket')
  
  socket.on('message', (data) => {
    console.log('Received:', data.toString())
  })
  
  socket.on('close', () => {
    console.log('Client disconnected')
  })
})
}


export const broadcast = (data) => {
  wss.clients.forEach(client => {
  if (client.readyState === 1) {
    client.send(JSON.stringify(data))
  }
})
}