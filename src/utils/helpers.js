export function verifyToken(request, secret) {
  return request.headers.get('X-Telegram-Bot-Api-Secret-Token') === secret;
}

export function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function isAdmin(userId, adminId) {
  return userId == adminId;
}
