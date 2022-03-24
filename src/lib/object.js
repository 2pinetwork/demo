export const hasOwnProperty =
  Function.prototype.call.bind(Object.prototype.hasOwnProperty)

export const mapObj = (obj, fn) => {
  const result = {}

  for (const key in obj)
    if (hasOwnProperty(obj, key))
      result[key] = fn(obj[key])

  return result
}
