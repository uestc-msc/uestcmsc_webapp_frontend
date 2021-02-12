import store from "@/store";

export function isAuthenticated() {
  return store.getters['isAuthenticated'];
}

export function isNotAuthenticated() {
  return !isAuthenticated();
}

export function isOwner(id) {
  return store.state.profile.id === id;
}

export function isAdmin() {
  return store.state.profile.is_admin || store.state.profile.is_superuser;
}

export function isSuperuser() {
  return store.state.profile.is_superuser;
}
