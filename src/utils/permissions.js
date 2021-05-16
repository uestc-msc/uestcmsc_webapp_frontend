import store from "@/store";
import {goBack, gotoLogin, goHome} from "@/utils/router";

function permissionValue(user) {
  if (user.is_superuser) return 2;
  else if (user.is_staff) return 1;
  else return 0;
}


/**
 * 当 user1 权限大于 user2，或 user1 为 superuser 时，返回 true
 * @param user1
 * @param user2
 * @return {boolean}
 */
export function hasGreaterPermissions(user1, user2) {
  return user1.is_superuser || permissionValue(user1) > permissionValue(user2);
}


const denyTips = Object.freeze({
  loginFirst: '请先登录~',
  alreadyLoggedIn: '您已经登录了~',
  permissionDenied: '您没有权限访问~'
});

/**
 * 检查用户是否登录，如果没有登录则跳转到登录页面
 */
export function isAuthenticatedOrGotoLogin() {
  if (!store.getters.isAuthenticated) {
    store.commit('setMsg', denyTips.loginFirst);
    gotoLogin();
  }
}


/**
 * 检查用户是否登录，如果登录了则跳转到首页
 */
export function isNotAuthenticatedOrGoHome() {
  if (!store.getters.isAuthenticated) {
    store.commit('setMsg', denyTips.alreadyLoggedIn);
    goHome();
  }
}


/**
 * 检查用户是否是有权进入页面，如果没有登录则跳转到登录页面，如果无权则跳转到上一页
 * @param hasPermission {boolean} 用户是否是有权
 */
function hasPermissionOrGoBack(hasPermission) {
  isAuthenticatedOrGotoLogin();
  if (hasPermission) {
    store.commit('setMsg', denyTips.permissionDenied);
    goBack();
  }
}


/**
 * 检查用户是否是管理员，如果没有登录则跳转到登录页面，如果不是则跳转到上一页
 */
export function isAdminOrGoBack() {
  hasPermissionOrGoBack(store.getters.isAdmin);
}


/**
 * 检查用户是否是本人或管理员，如果没有登录则跳转到登录页面，如果不是则跳转到上一页
 * @param id {number} 本人的 id
 */
export function isSelfOrAdminOrGoBack(id) {
  hasPermissionOrGoBack(store.getters.isSelfOrAdmin);
}


/**
 * 检查用户是否是活动主讲人或管理员，如果没有登录则跳转到登录页面，如果不是则跳转到上一页
 * @param presenters {number[]} 主讲人名单
 */
export function isSelfOrAdminOrGoBack(presenters) {
  hasPermissionOrGoBack(store.getters.isInListOrAdmin(presenters));
}
