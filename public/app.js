const leftTeamInput = document.getElementById("leftTeamInput");
const rightTeamInput = document.getElementById("rightTeamInput");
const leftAbbrevInput = document.getElementById("leftAbbrevInput");
const rightAbbrevInput = document.getElementById("rightAbbrevInput");
const saveTeamsButton = document.getElementById("saveTeams");
const savePlayersButton = document.getElementById("savePlayers");
const resetButton = document.getElementById("resetButton");
const slotSelect = document.getElementById("slotSelect");
const heroSelect = document.getElementById("heroSelect");
const assignHeroButton = document.getElementById("assignHero");
const clearHeroButton = document.getElementById("clearHero");
const statusBoard = document.getElementById("statusBoard");
const leftPlayersContainer = document.getElementById("leftPlayers");
const rightPlayersContainer = document.getElementById("rightPlayers");

const socket = new WebSocket(`ws://${window.location.host}`);
const localState = initialState();

const buildSlotOptions = () => {
  slotSelect.innerHTML = "";
  slotGroups.forEach((group) => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = group.label;
    group.keys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = slotLabel(key);
      optGroup.appendChild(option);
    });
    slotSelect.appendChild(optGroup);
  });
};

const buildHeroOptions = () => {
  heroSelect.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "-- เลือกฮีโร่ --";
  heroSelect.appendChild(emptyOption);

  heroes.forEach((hero) => {
    const option = document.createElement("option");
    option.value = hero.id;
    option.textContent = hero.name;
    heroSelect.appendChild(option);
  });
};

const renderStatus = (state) => {
  statusBoard.innerHTML = "";

  const groups = slotGroups.map((group) => {
    const section = document.createElement("div");
    section.className = "status-group";

    const title = document.createElement("h3");
    title.textContent = group.label;
    section.appendChild(title);

    const list = document.createElement("div");
    list.className = "status-list";

    group.keys.forEach((key) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "status-item";
      item.dataset.key = key;
      item.textContent = `${slotLabel(key)}: ${heroNameById(state.slots[key]) || "-"}`;
      item.addEventListener("click", () => {
        slotSelect.value = key;
      });
      list.appendChild(item);
    });

    section.appendChild(list);
    return section;
  });

  groups.forEach((section) => statusBoard.appendChild(section));
};

const buildPlayerRow = (player, index, side) => {
  const row = document.createElement("div");
  row.className = "player-row";
  row.dataset.side = side;
  row.dataset.index = String(index);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = `Player ${index + 1}`;
  nameInput.value = player.name;
  nameInput.className = "player-name";

  const laneSelect = document.createElement("select");
  laneSelect.className = "player-lane";
  lanes.forEach((lane) => {
    const option = document.createElement("option");
    option.value = lane.id;
    option.textContent = lane.label;
    laneSelect.appendChild(option);
  });
  laneSelect.value = player.lane;

  row.appendChild(nameInput);
  row.appendChild(laneSelect);
  return row;
};

const renderPlayers = (state) => {
  leftPlayersContainer.innerHTML = "";
  rightPlayersContainer.innerHTML = "";

  state.players.left.forEach((player, index) => {
    leftPlayersContainer.appendChild(buildPlayerRow(player, index, "left"));
  });

  state.players.right.forEach((player, index) => {
    rightPlayersContainer.appendChild(buildPlayerRow(player, index, "right"));
  });
};

const sendMessage = (payload) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
};

saveTeamsButton.addEventListener("click", () => {
  sendMessage({
    type: "setTeams",
    payload: {
      leftTeam: leftTeamInput.value.trim() || "Team A",
      rightTeam: rightTeamInput.value.trim() || "Team B",
      leftAbbrev: leftAbbrevInput.value.trim() || "TA",
      rightAbbrev: rightAbbrevInput.value.trim() || "TB"
    }
  });
});

savePlayersButton.addEventListener("click", () => {
  const buildPlayersPayload = (container) =>
    Array.from(container.querySelectorAll(".player-row")).map((row) => ({
      name: row.querySelector(".player-name").value.trim(),
      lane: row.querySelector(".player-lane").value
    }));

  sendMessage({
    type: "setPlayers",
    payload: {
      left: buildPlayersPayload(leftPlayersContainer),
      right: buildPlayersPayload(rightPlayersContainer)
    }
  });
});

assignHeroButton.addEventListener("click", () => {
  if (!slotSelect.value) return;
  sendMessage({
    type: "setSlot",
    payload: {
      slotKey: slotSelect.value,
      heroId: heroSelect.value || null
    }
  });
});

clearHeroButton.addEventListener("click", () => {
  if (!slotSelect.value) return;
  sendMessage({
    type: "setSlot",
    payload: {
      slotKey: slotSelect.value,
      heroId: null
    }
  });
});

resetButton.addEventListener("click", () => {
  sendMessage({ type: "reset" });
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "state") {
    leftTeamInput.value = data.payload.leftTeam;
    rightTeamInput.value = data.payload.rightTeam;
    leftAbbrevInput.value = data.payload.leftAbbrev;
    rightAbbrevInput.value = data.payload.rightAbbrev;
    renderPlayers(data.payload);
    renderStatus(data.payload);
  }
});

buildSlotOptions();
buildHeroOptions();
renderPlayers(localState);
renderStatus(localState);
leftTeamInput.value = localState.leftTeam;
rightTeamInput.value = localState.rightTeam;
leftAbbrevInput.value = localState.leftAbbrev;
rightAbbrevInput.value = localState.rightAbbrev;
