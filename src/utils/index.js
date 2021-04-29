const { verbose_name, version } = require('/package.json');
const DEBUG = process.env.NODE_ENV === 'development';
const baseUrl = DEBUG ? `http://${window.location.hostname}:8000/api` : 'https://api.uestc-msc.com/api';
const debounceTime = 500;
const displayCheckButtonTime = 1500;
const avatarDefault = "data:image/png;base64,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I75addzgF3VajM5WZJZqgiElFj7piyim+dCMXj8j4PCyTWc+usAzZ345pIeQ4iD33td8Xb5gtmk9dfU0xfcV3SWMjN5HwO4EKRgatLHMuVTNaSFQuoqK+S1svLOZHTvblxxoL1TOm609OEL7/nIyWYvmuYdoaxvBstyLGzQBkvF6xa6rMX7cbhpHOn1FpwGbtUIETJQUAvj5lQO+tNzCu7vHluSygYqL2GotUKoKIY6ddUWlbAZGNjLmLeSlLf343tPs3Ll31pz5Zo242ysqpTGkR9vV43z+CxPE4v401p20sBATltDdi0xxFF93YhqLzphe/0613w/gv/zLHAXnsNFQd1Wr75vTdui+ioPOI0QBCOIrm76Rj0NSgJkpmvKgdby7OxoMNywFQwmhuecjE9z9Bxka6l3OfTPvQhF4gLfU1VviQr81wRXKFQM+cMDjgT+qLNWaJTOdpnyvEimKSDmM75dO2kZbIECp+iMBOxC3baspm3YXKmUaQihq6/2p780MdbIUCkA0K3aVCrITvu7DEPWXrf8Vv6dVXZuhpi7jzp2Xeqe6ZmLMMC5s4jValaMJYFndF6is0bpywHWcLWgoFtxy5Zsm6PMZlelEGyiVcJVavEPrRd9F1A8q7XCl78caV/RtYPeuhxHhQvGznxdvjg7ntmYzhYzjerW+EtHJ1f3JaXUBafThOMs4t36XlIgDCxa+8cToyNCtFRWl/XfdPWwLOV49Gf+TTNzkjYIAbQI2SpfmlG5+W+sl3xf6jgfN3EPbHPmvnh2Yiymarkj/K3bpSapsGBCpHz4cev3HP96z4+Efljw6MlzW5rrmynxWtRadUKUUbQFpTBAKDaJUyeQrCyjDNP3++sZFO7u7Dz5RWVm+XRoVNyjlCrD8KepRoy0NAR8d6Udbe5So2CfU6j0mXxtUnNYi8V+v2LJn9X9fo6aRm2/4JXfdN2o8+3RTqFCsjUhhW47XiVOMkC9E8LULSommRjP/R5/Ljby0+dHo7NnlhW9+k6CvipYgiiSCJqyRMQ2lWutFReUuLwgJodDvTdUP5AP5QD6Qfz/y/wFKWRwJJeUeYgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wMi0xN1QxMzozNToxNiswMDowMOUrIqwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDItMTdUMTM6MzU6MTYrMDA6MDCUdpoQAAAARnRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjcuOC05IDIwMTQtMDUtMTIgUTE2IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3Jn3IbtAAAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpoZWlnaHQAMTkyDwByhQAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxOTLTrCEIAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MTM1Njg5MTYa3YZnAAAAD3RFWHRUaHVtYjo6U2l6ZQAwQkKUoj7sAAAAVnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vbW50bG9nL2Zhdmljb25zLzIwMjEtMDItMTcvOTk4Y2Y1ODg5YjVkNWYwMTE2NmY1MmNlNGZkNTY1YzQuaWNvLnBuZ4m2WP0AAAAASUVORK5CYII=";

export {
  verbose_name as appName,
  version as appVersion,
  DEBUG,
  baseUrl,
  debounceTime,
  displayCheckButtonTime,
  avatarDefault
}

