import {iconPath} from "@/utils/index";

// todo 二维码怎么搞啊

/**
 * 生成二维码
 * reference: https://www.jqueryscript.net/other/qr-code-logo-label.html
 * @param targetElement
 * @param url
 * @param img
 */
export function generateQRCode(targetElement, url, img=iconPath) {
  new QRCode(document.getElementById("checkin-qrcode"), "http://jindo.dev.naver.com/collie");
}