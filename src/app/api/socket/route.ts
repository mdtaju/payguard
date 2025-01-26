import { Server as IOServer, Socket } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: IOServer;
    };
  };
};

// This is required to prevent unused export errors
export const runtime = "nodejs";

let io: IOServer | undefined;

export async function GET(req: NextRequest) {
  if (!io) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const server = (req as any).socket.server as NetServer & { io?: IOServer };
    if (!server.io) {
      console.log("Initializing Socket.IO...");
      io = new IOServer(server);
      server.io = io;

      io.on("connection", (socket: Socket) => {
        console.log("A user connected:", socket.id);

        socket.on("sendNotification", (message) => {
          console.log("Notification received:", message);
          io?.emit("newNotification", message);
        });

        socket.on("disconnect", () => {
          console.log("A user disconnected:", socket.id);
        });
      });
    } else {
      io = server.io;
    }
  }

  return NextResponse.json({ message: "Socket.IO initialized" });
}
