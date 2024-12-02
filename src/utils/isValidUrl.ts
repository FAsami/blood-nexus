const isValidUrl = (str: unknown) => {
  try {
    if (typeof str === 'string') {
      new URL(str)
      return true
    }
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}
export { isValidUrl }
