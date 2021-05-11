/**
 * 表单或文件的状态
 */
export const Status = Object.freeze({
  default: 0,
  editing: 1,
  submitting: 2,  // 无进度百分比
  uploading: 3,   // 有进度百分比
  success: 4,
  error: 5,
})

/**
 * 状态对应的颜色
 */
export const StatusColor = Object.freeze({
  [Status.default]: 'primary',
  [Status.editing]: 'primary',
  [Status.submitting]: 'primary',
  [Status.uploading]: 'primary',
  [Status.success]: 'success',
  [Status.error]: 'error',
})

/**
 * 状态对应的图标
 */
export const StatusIcon = Object.freeze({
  [Status.default]: 'mdi-pencil',
  [Status.editing]: 'mdi-content-save',
  [Status.submitting]: '',
  [Status.uploading]: '',
  [Status.success]: 'mdi-check',
  [Status.error]: 'mdi-close',
})