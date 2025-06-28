export async function addUser(db, userId) {
  return db.prepare(
    'INSERT OR IGNORE INTO users (user_id) VALUES (?)'
  ).bind(userId).run();
}

export async function getUsers(db) {
  return db.prepare('SELECT user_id FROM users').all();
}

export async function addGroup(db, groupId) {
  return db.prepare(
    'INSERT OR IGNORE INTO groups (group_id) VALUES (?)'
  ).bind(groupId).run();
}

export async function getStats(db) {
  const users = await db.prepare('SELECT COUNT(*) as count FROM users').first();
  const groups = await db.prepare('SELECT COUNT(*) as count FROM groups').first();
  return {
    users: users.count,
    groups: groups.count,
    total: users.count + groups.count
  };
}
