var Colors: any = {};
Colors.names = {
  aqua: "#00ffff",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  black: "#000000",
  blue: "#0000ff",
  brown: "#a52a2a",
  cyan: "#00ffff",
  darkblue: "#00008b",
  magenta: "#ff00ff",
  maroon: "#800000",
  navy: "#000080",
  orange: "#ffa500",
  violet: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  white: "#ffffff",
  yellow: "#ffff00",
};

const getRandomColor = () => {
  var result;
  var count = 0;
  for (var prop in Colors.names) if (Math.random() < 1 / ++count) result = prop;
  return result;
};

export { getRandomColor };
