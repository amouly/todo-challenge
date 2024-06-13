export function response(code: number, body: any | null) {
  return {
    statusCode: code,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : "",
  };
}
