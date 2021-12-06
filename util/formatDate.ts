const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(date));
}

export default formatDate;
