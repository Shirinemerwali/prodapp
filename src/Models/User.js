export default function createUser(username, password) {
  return {
    id: crypto.randomUUID(),
    username,
    password,
  };
}