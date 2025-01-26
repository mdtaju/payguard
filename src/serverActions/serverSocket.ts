import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export const initializeSocket = (server: HTTPServer): IOServer => {
  if (!io) {
    io = new IOServer(server, {
      cors: {
        origin: "*", // Adjust this for production
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      socket.on("sendNotification", (message) => {
        io?.emit("newNotification", message);
      });

      socket.on("disconnect", () => {});
    });
  }

  return io;
};

export const getSocket = (): IOServer | null => io;
