import Vue from 'vue'

const cloudComponent = Vue.extend({
  activated() {
    window.location.replace('https://demo4c-my.sharepoint.com/:f:/g/personal/uestcmsc_demo4c_onmicrosoft_com/Eq4PHVelleJCpDcY2HqjafcB-y6J0cPalW0Pn6J0wBSaXw?e=RJNaaB');
  }
});

const cloudAdminComponent = Vue.extend({
  activated() {
    window.location.replace('https://demo4c-my.sharepoint.com/personal/uestcmsc_demo4c_onmicrosoft_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fuestcmsc%5Fdemo4c%5Fonmicrosoft%5Fcom%2FDocuments%2Fcloud%2Fpublic');
  }
});

export {cloudComponent, cloudAdminComponent};