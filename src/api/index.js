export async function deleteData(func, throwErrorIfNotFound = true) {
  try {
    return await func()
  } catch (res) {
    if (throwErrorIfNotFound && res.status === 404)
      return res;
    throw res;
  }
}