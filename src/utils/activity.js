import Vue from 'vue'
import {getActivityPhotoList} from "@/api/activity";
import {getOnedriveFileUrl} from "@/api/cloud";

/**
 * 为 `activity` 分配头图并写入 `activity.topPhotoURL`（如果已存在，则什么都不做）
 * @param activity 沙龙
 * @return activity
 */
export async function generateTopPhoto(activity) {
  // 如果已经有了，就不重复写入了
  if (activity.bannerUrl)
    return activity;

  let url;
  if (activity.banner_id)
    url = getOnedriveFileUrl(activity.banner_id);
  else {
    // 如果没有沙龙照片，就从默认照片中随机选一张
    // 为了稳定的获取图片，防止刷新后分配新的图片，使用 id 取模
    const randomPhotoSize = 19;
    const randomPhotoIndex = activity.id % randomPhotoSize + 1;
    url = `/img/random/material-${randomPhotoIndex}.png`;
  }
  Vue.set(activity, 'bannerUrl', url);
  return activity;
}