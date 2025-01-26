import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export const initializeSocket = (server: HTTPServer): IOServer => {
  if (!io) {
    console.log("Initializing Socket.IO...");
    io = new IOServer(server, {
      cors: {
        origin: "*", // Adjust this for production
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("sendNotification", (message) => {
        console.log("Notification received:", message);
        io?.emit("newNotification", message);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
      });
    });
  }

  return io;
};

export const getSocket = (): IOServer | null => io;
