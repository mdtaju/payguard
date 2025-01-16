export function dateFormation(dateString: string) {
  // Convert the string into a Date object
  const date = new Date(dateString);

  // Format the date
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  return formattedDate;
}
