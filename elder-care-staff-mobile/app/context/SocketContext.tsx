import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  hello: { message: string };
  // Thêm sự kiện ở đây...
}

interface ClientToServerEvents {
  // Ví dụ: sendMessage: (msg: string) => void;
}

type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: MySocket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<MySocket | null>(null);

  useEffect(() => {
    const s: MySocket = io("http://192.168.81.101:5000", {
      transports: ["websocket"],
    });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
