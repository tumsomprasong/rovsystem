const path = require("path");
const http = require("http");
const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const slotKeys = [
  "left-ban-1",
  "left-ban-2",
  "left-ban-3",
  "left-pick-1",
  "left-pick-2",
  "left-pick-3",
  "left-pick-4",
  "left-pick-5",
  "right-ban-1",
  "right-ban-2",
  "right-ban-3",
  "right-pick-1",
  "right-pick-2",
  "right-pick-3",
  "right-pick-4",
  "right-pick-5"
];

const defaultState = () => ({
  leftTeam: "Team A",
  rightTeam: "Team B",
  slots: Object.fromEntries(slotKeys.map((key) => [key, null]))
});

let state = defaultState();

const broadcast = () => {
  const payload = JSON.stringify({ type: "state", payload: state });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

app.get("/api/state", (_req, res) => {
  res.json(state);
});

app.post("/api/reset", (_req, res) => {
  state = defaultState();
  broadcast();
  res.json(state);
});

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "state", payload: state }));

  ws.on("message", (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (error) {
      console.error("Invalid message", error);
      return;
    }

    if (message.type === "setTeams") {
      const { leftTeam, rightTeam } = message.payload || {};
      if (typeof leftTeam === "string") {
        state.leftTeam = leftTeam;
      }
      if (typeof rightTeam === "string") {
        state.rightTeam = rightTeam;
      }
      broadcast();
      return;
    }

    if (message.type === "setSlot") {
      const { slotKey, heroId } = message.payload || {};
      if (slotKeys.includes(slotKey)) {
        state.slots[slotKey] = heroId || null;
        broadcast();
      }
      return;
    }

    if (message.type === "reset") {
      state = defaultState();
      broadcast();
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
