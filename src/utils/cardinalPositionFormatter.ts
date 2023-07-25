export const getOrdinalNum = (place: number) => {
  const suffix =
    (place >= 4 && place <= 20) || (place >= 24 && place <= 30)
      ? "th"
      : ["st", "nd", "rd"][(place % 10) - 1] || "th";
  return suffix;
};
