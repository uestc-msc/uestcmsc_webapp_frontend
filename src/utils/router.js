import store from "@/store";
import router from "@/router";

export function goBack() {
  if (window.history.length > 1)
    router.go(-1);
  else
    router.push('/');
}

export function goHome() {
  router.push('/');
}

export function gotoLogin() {
  router.push({name: 'Login'});
}

