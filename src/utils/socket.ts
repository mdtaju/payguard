import { io } from "socket.io-client";

const initSocket = io(process.env.NEXT_PUBLIC_BASE_URL as string);

export default initSocket;
