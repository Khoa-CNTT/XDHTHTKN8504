
// Server gửi gì cho client
export interface ServerToClientEvents {
  
  message: (msg: string) => void;
}

// Client gửi gì cho server
export interface ClientToServerEvents {
  join: (userId: string) => void;
}
