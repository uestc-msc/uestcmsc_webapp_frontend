import store from "@/store";

export function isAuthenticated() {
  return store.getters['account/isAuthenticated'];
};

export function isNotAuthenticated() {
  return !isAuthenticated();
};

export function isOwner(id) {
  try {
    return store.state.account.profile.id == id;
  } catch {
    return false;
  }
}

export function isAdmin() {
  try {
    return store.state.account.profile.is_admin || store.state.account.profile.is_superuser;
  } catch {
    return false;
  }
}

export function isSuperuser() {
  try {
    return store.state.account.profile.is_superuser;
  } catch {
    return false;
  }
}
