const dateFormatter = (dateToFormat, variant = "1") => {
  const date = new Date(dateToFormat);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  switch (variant) {
    case "1":
        return `${day}/${month}/${year}`;
    default:
      return;
  }
};
export default dateFormatter;
