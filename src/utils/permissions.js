export function hasGreaterPermissions(user1, user2) {
  function permissionValue(user) {
    if (user.is_superuser) return 2;
    else if (user.is_staff) return 1;
    else return 0;
  }
  return user1.is_superuser || permissionValue(user1) > permissionValue(user2);
}
