export const Status = Object.freeze({
  default: 0,
  editing: 1,
  submitting: 2,  // 无进度百分比
  uploading: 3,   // 有进度百分比
  success: 4,
  error: 5,
})

export const StatusColor = Object.freeze({
  0: 'primary',
  1: 'primary',
  2: 'primary',
  3: 'primary',
  4: 'success',
  5: 'error',
})