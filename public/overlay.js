const leftTeamLabel = document.getElementById("leftTeam");
const rightTeamLabel = document.getElementById("rightTeam");
const leftAbbrevLabel = document.getElementById("leftAbbrev");
const rightAbbrevLabel = document.getElementById("rightAbbrev");
const leftAbbrevLarge = document.getElementById("leftAbbrevLarge");
const rightAbbrevLarge = document.getElementById("rightAbbrevLarge");
const leftBans = document.getElementById("leftBans");
const rightBans = document.getElementById("rightBans");
const leftPicks = document.getElementById("leftPicks");
const rightPicks = document.getElementById("rightPicks");

const socket = new WebSocket(`ws://${window.location.host}`);

const renderBanCards = (container, keys, state) => {
  container.innerHTML = "";
  keys.forEach((key) => {
    const card = document.createElement("div");
    card.className = "ban-card";

    const hero = document.createElement("div");
    hero.className = "ban-hero";
    hero.textContent = heroNameById(state.slots[key]) || "BAN";

    card.appendChild(hero);
    container.appendChild(card);
  });
};

const renderPickCards = (container, keys, players, state) => {
  container.innerHTML = "";
  keys.forEach((key, index) => {
    const card = document.createElement("div");
    card.className = "pick-card";

    const hero = document.createElement("div");
    hero.className = "pick-hero";
    hero.textContent = heroNameById(state.slots[key]) || "PICK";

    const footer = document.createElement("div");
    footer.className = "pick-footer";

    const laneBadge = document.createElement("span");
    laneBadge.className = `lane-badge lane-${players[index]?.lane || "slayer"}`;
    laneBadge.textContent =
      lanes.find((lane) => lane.id === players[index]?.lane)?.short || "";

    const playerName = document.createElement("span");
    playerName.className = "pick-player";
    playerName.textContent = players[index]?.name || "-";

    footer.appendChild(laneBadge);
    footer.appendChild(playerName);

    card.appendChild(hero);
    card.appendChild(footer);
    container.appendChild(card);
  });
};

const renderOverlay = (state) => {
  leftTeamLabel.textContent = state.leftTeam;
  rightTeamLabel.textContent = state.rightTeam;
  leftAbbrevLabel.textContent = state.leftAbbrev;
  rightAbbrevLabel.textContent = state.rightAbbrev;
  leftAbbrevLarge.textContent = state.leftAbbrev;
  rightAbbrevLarge.textContent = state.rightAbbrev;

  const leftBanKeys = ["left-ban-1", "left-ban-2", "left-ban-3"];
  const rightBanKeys = ["right-ban-1", "right-ban-2", "right-ban-3"];
  const leftPickKeys = [
    "left-pick-1",
    "left-pick-2",
    "left-pick-3",
    "left-pick-4",
    "left-pick-5"
  ];
  const rightPickKeys = [
    "right-pick-1",
    "right-pick-2",
    "right-pick-3",
    "right-pick-4",
    "right-pick-5"
  ];

  renderBanCards(leftBans, leftBanKeys, state);
  renderBanCards(rightBans, rightBanKeys, state);
  renderPickCards(leftPicks, leftPickKeys, state.players.left, state);
  renderPickCards(rightPicks, rightPickKeys, state.players.right, state);
};

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "state") {
    renderOverlay(data.payload);
  }
});

renderOverlay(initialState());
