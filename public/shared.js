const heroes = [
  { id: "valhein", name: "Valhein" },
  { id: "violet", name: "Violet" },
  { id: "nakroth", name: "Nakroth" },
  { id: "alice", name: "Alice" },
  { id: "tulen", name: "Tulen" },
  { id: "yorn", name: "Yorn" },
  { id: "liliana", name: "Liliana" },
  { id: "moren", name: "Moren" },
  { id: "thanes", name: "Thane" },
  { id: "krixi", name: "Krixi" },
  { id: "lorion", name: "Lorion" },
  { id: "raz", name: "Raz" }
];

const slotGroups = [
  {
    label: "Ban ทีมซ้าย",
    keys: ["left-ban-1", "left-ban-2", "left-ban-3"]
  },
  {
    label: "Pick ทีมซ้าย",
    keys: [
      "left-pick-1",
      "left-pick-2",
      "left-pick-3",
      "left-pick-4",
      "left-pick-5"
    ]
  },
  {
    label: "Ban ทีมขวา",
    keys: ["right-ban-1", "right-ban-2", "right-ban-3"]
  },
  {
    label: "Pick ทีมขวา",
    keys: [
      "right-pick-1",
      "right-pick-2",
      "right-pick-3",
      "right-pick-4",
      "right-pick-5"
    ]
  }
];

const slotLabel = (key) =>
  key
    .replace("left", "ซ้าย")
    .replace("right", "ขวา")
    .replace("ban", "Ban")
    .replace("pick", "Pick")
    .replace(/-/, " ");

const heroNameById = (id) => heroes.find((hero) => hero.id === id)?.name || "";
