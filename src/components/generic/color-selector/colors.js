// const colors = Object.freeze({
//   bisque: 0xffe4c4,
//   orange: 0xffa500,
//   coral: 0xff7f50,
//   red: 0xff3d1e,
//   maroon: 0x800000,
//   khaki: 0xf0e68c,
//   tan: 0xd2b48c,
//   peru: 0xcd853f,
//   sienna: 0xa0522d,
//   brown: 0xa52a2a,
//   greenyellow: 0xadff2f,
//   yellowgreen: 0x9acd32,
//   forestgreen: 0x00af50,
//   green: 0x008000,
//   darkgreen: 0x006400,
//   lightcyan: 0xe0ffff,
//   skyblue: 0x87ceeb,
//   steelblue: 0x4682b4,
//   blue: 0x0000ff,
//   darkblue: 0x00008b,
//   mistyrose: 0xffe4e1,
//   hotpink: 0xff69b4,
//   magenta: 0xff00ff,
//   purple: 0x800080,
//   indigo: 0x4b0082,
//   whitesmoke: 0xf5f5f5,
//   silver: 0xc0c0c0,
//   darkgray: 0xa9a9a9,
//   grey: 0x808080,
//   black: 0x000000
// });
const colors = Object.freeze({
  bisque: "ffe4c4",
  orange: "ffa500",
  coral: "ff7f50",
  red: "ff3d1e",
  maroon: "800000",
  khaki: "f0e68c",
  tan: "d2b48c",
  peru: "cd853f",
  sienna: "a0522d",
  brown: "a52a2a",
  greenyellow: "adff2f",
  yellowgreen: "9acd32",
  forestgreen: "00af50",
  green: "008000",
  darkgreen: "006400",
  lightcyan: "e0ffff",
  skyblue: "87ceeb",
  steelblue: "4682b4",
  blue: "0000ff",
  darkblue: "00008b",
  mistyrose: "ffe4e1",
  hotpink: "ff69b4",
  magenta: "ff00ff",
  purple: "800080",
  indigo: "4b0082",
  whitesmoke: "f5f5f5",
  silver: "c0c0c0",
  darkgray: "a9a9a9",
  grey: "7a7a7a",
  black: "000000"
});

// Some colors are too bright to be selected randomnly, but in some cases user may want to have it.
const tooBrightColors = [
  "bisque",
  "khaki",
  "greenyellow",
  "lightcyan",
  "mistyrose",
  "whitesmoke"
];

function getRandomHexColor() {
  const validColors = Object.entries(colors).filter(
    ([name]) => !tooBrightColors.includes(name)
  );
  const index = Math.floor(Math.random() * validColors.length);

  return validColors[index][1];
}

export { colors, getRandomHexColor };
