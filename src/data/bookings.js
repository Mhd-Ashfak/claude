// Lightweight localStorage-backed booking store (mock persistence).
const KEY = "omero.bookings";

export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveBooking(booking) {
  const all = getBookings();
  const id = "OM-" + Math.floor(1000 + Math.random() * 9000);
  const record = { id, status: "Confirmed", ...booking };
  localStorage.setItem(KEY, JSON.stringify([record, ...all]));
  return record;
}

export function cancelBooking(id) {
  const all = getBookings().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
  return all;
}
