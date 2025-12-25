const leftTeamLabel = document.getElementById("leftTeam");
const rightTeamLabel = document.getElementById("rightTeam");
const leftColumn = document.getElementById("leftColumn");
const rightColumn = document.getElementById("rightColumn");

const socket = new WebSocket(`ws://${window.location.host}`);

const renderColumn = (container, title, keys, state) => {
  container.innerHTML = "";
  const heading = document.createElement("h3");
  heading.textContent = title;
  container.appendChild(heading);

  const list = document.createElement("div");
  list.className = "overlay-list";

  keys.forEach((key) => {
    const card = document.createElement("div");
    card.className = "overlay-card";

    const label = document.createElement("span");
    label.className = "overlay-slot";
    label.textContent = slotLabel(key);

    const hero = document.createElement("span");
    hero.className = "overlay-hero";
    hero.textContent = heroNameById(state.slots[key]) || "-";

    card.appendChild(label);
    card.appendChild(hero);
    list.appendChild(card);
  });

  container.appendChild(list);
};

const renderOverlay = (state) => {
  leftTeamLabel.textContent = state.leftTeam;
  rightTeamLabel.textContent = state.rightTeam;

  const leftGroup = slotGroups.filter((group) => group.label.includes("ซ้าย"));
  const rightGroup = slotGroups.filter((group) => group.label.includes("ขวา"));

  renderColumn(leftColumn, "ทีมซ้าย", leftGroup.flatMap((group) => group.keys), state);
  renderColumn(rightColumn, "ทีมขวา", rightGroup.flatMap((group) => group.keys), state);
};

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "state") {
    renderOverlay(data.payload);
  }
});
