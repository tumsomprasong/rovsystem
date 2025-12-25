const leftTeamInput = document.getElementById("leftTeamInput");
const rightTeamInput = document.getElementById("rightTeamInput");
const saveTeamsButton = document.getElementById("saveTeams");
const resetButton = document.getElementById("resetButton");
const slotSelect = document.getElementById("slotSelect");
const heroSelect = document.getElementById("heroSelect");
const assignHeroButton = document.getElementById("assignHero");
const clearHeroButton = document.getElementById("clearHero");
const statusBoard = document.getElementById("statusBoard");

const socket = new WebSocket(`ws://${window.location.host}`);

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
      rightTeam: rightTeamInput.value.trim() || "Team B"
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
    renderStatus(data.payload);
  }
});

buildSlotOptions();
buildHeroOptions();
