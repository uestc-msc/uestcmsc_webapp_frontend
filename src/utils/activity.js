import Vue from 'vue'

/**
 * 为 `activity` 分配头图并写入 `activity.topPhotoURL`（如果已存在，则什么都不做）
 * @param activity 沙龙
 */
export function generateTopPhoto(activity) {
  if (activity.topPhotoUrl) {
    // 如果已经有了，就不重复写入了
    return activity;
  } else if (activity.photo.length) {
    // 如果有沙龙照片，就从沙龙相册随机选一张
    const PhotoIndex = activity.id % activity.photo.length;
    Vue.set(activity, 'topPhotoUrl', activity.photo[photoIndex].thumbnail);
  } else {
    // 如果没有沙龙照片，就从默认照片中随机选一张
    // 为了稳定的获取图片，防止刷新后分配新的图片，还是使用 id 取模吧
    const randomPhotoSize = 19;
    const randomPhotoIndex = activity.id % 19;
    Vue.set(activity, 'topPhotoUrl', `/img/random/material-${randomPhotoIndex}.png`);
  }
  return activity;
}