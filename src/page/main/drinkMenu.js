const drinkMenu = [
  {
    seq: 1,
    code: "ESPRESSO",
    name: "에스프레소",
    url: "/menuImages/espresso.jpg",
    price: 3500,
    optSeq : [3, 4]
  },
  {
    seq: 2,
    code: "AMERICANO",
    name: "아메리카노",
    url: "/menuImages/americano.jpg",
    price: 4000,
    optSeq : [1, 2, 3, 4]
  },
  {
    seq: 3,
    code: "CAFE_LATTE",
    name: "카페라떼",
    url: "/menuImages/cafelatte.jpg",
    price: 4500,
    optSeq : [1, 2, 3, 4]
  },
  {
    seq: 4,
    code: "HAZELNUT_COFFEE",
    name: "헤이즐넛 커피",
    url: "/menuImages/hazelnutcoffee.png",
    price: 5000,
    optSeq : [1, 2, 3, 4]
  },
  {
    seq: 5,
    code: "CAPPUCCINO",
    name: "카푸치노",
    url: "/menuImages/cappuccino.jpg",
    price: 4500,
    optSeq : [3, 4]
  },
  {
    seq: 6,
    code: "CHOCO",
    name: "핫초코",
    url: "/menuImages/hotchoco.jpg",
    price: 5000,
    optSeq : [1, 2]
  },
  {
    seq: 7,
    code: "STRAWBERRY_LATTE",
    name: "딸기라떼",
    url: "/menuImages/strawberrylatte.jpg",
    price: 5500,
    optSeq : []
  },
  {
    seq: 8,
    code: "GRAPEFRUIT_ADE",
    name: "자몽에이드",
    url: "/menuImages/grapefruitade.jpg",
    price: 5000,
    optSeq : []
  },
  {
    seq: 9,
    code: "BLACK_TEA",
    name: "홍차",
    url: "/menuImages/tea.jpg",
    price: 5000,
    optSeq : [1, 2]
  },
];

export default drinkMenu;
