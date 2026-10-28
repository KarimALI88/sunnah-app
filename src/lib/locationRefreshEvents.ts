type LocationRefreshListener = () => void;

const listeners = new Set<LocationRefreshListener>();

export function subscribeToLocationRefresh(listener: LocationRefreshListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyLocationRefresh() {
  listeners.forEach((listener) => listener());
}
