export function assert(statement: any, message: any) {
  if (!statement) {
    throw Error(`Assertion failed: ${message}`)
  }
}