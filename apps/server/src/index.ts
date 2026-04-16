import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { getPrismaClient, disconnectPrisma } from "./prisma/PrismaService.js";
import { RedisService } from "./services/redis.service.js";
import { GameCoordinator } from "./services/game-coordinator.js";
import { SocketHandler } from "./services/socket-handler.js";

// ─── Configuración ───────────────────────────────────────────────────────────

const PORT = Number(process.env.PORT) || 4000;

// ─── Express + HTTP ──────────────────────────────────────────────────────────

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ─── API REST: Dashboard Administrativo ──────────────────────────────────────

/** GET /api/leaderboard — Jugadores ordenados por puntuación total descendente */
app.get("/api/leaderboard", async (_req, res) => {
  try {
    const players = await prisma.playerModel.findMany({
      orderBy: { totalScore: "desc" },
    });
    res.json(players);
  } catch (err) {
    console.error("[API] Error al obtener leaderboard:", err);
    res.status(500).json({ error: "Error al obtener el leaderboard" });
  }
});

/** GET /api/sessions — Sesiones de juego (más recientes primero) */
app.get("/api/sessions", async (_req, res) => {
  try {
    const sessions = await prisma.gameSessionModel.findMany({
      orderBy: { startTime: "desc" },
      take: 50,
    });
    const sessionsWithDetails = await Promise.all(
      sessions.map(async (session) => {
        const movementCount = await prisma.movementModel.count({
          where: { sessionId: session.id },
        });
        return { ...session, movementCount };
      }),
    );
    res.json(sessionsWithDetails);
  } catch (err) {
    console.error("[API] Error al obtener sesiones:", err);
    res.status(500).json({ error: "Error al obtener las sesiones" });
  }
});

/** GET /api/sessions/:id/movements — Movimientos de una sesión específica */
app.get("/api/sessions/:id/movements", async (req, res) => {
  try {
    const { id } = req.params;
    const movements = await prisma.movementModel.findMany({
      where: { sessionId: id },
      orderBy: { timestamp: "asc" },
    });
    res.json(movements);
  } catch (err) {
    console.error("[API] Error al obtener movimientos:", err);
    res.status(500).json({ error: "Error al obtener los movimientos" });
  }
});

// ─── Socket.IO ───────────────────────────────────────────────────────────────

const io = new Server(server, {
  cors: { origin: "*" },
});

// ─── Servicios ───────────────────────────────────────────────────────────────

const prisma = getPrismaClient();
const redisService = new RedisService();
const coordinator = new GameCoordinator(prisma, redisService);
const socketHandler = new SocketHandler(io, coordinator);

socketHandler.initialize();

// ─── Inicio del servidor ─────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`[Server] Dado Triple corriendo en puerto ${PORT}`);
});

// ─── Graceful shutdown ───────────────────────────────────────────────────────

async function shutdown(): Promise<void> {
  console.log("\n[Server] Cerrando conexiones...");
  io.close();
  await redisService.disconnect();
  await disconnectPrisma();
  server.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
