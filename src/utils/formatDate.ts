export default function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES").format(date);
}
