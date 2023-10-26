import { store } from "@/Store";

let profile = store?.getState().auth?.profile.name

const users = [
 
  { username: 'admin_crm@trisysit.com', name: "Admin" },
  { username: 'brandon_crm@trisysit.com', name: "Brandon" },
  { username: 'karen_crm@trisysit.com', name: "Karen" },
  // { username: 'julio_crm@trisysit.com', name: "Julio" },
  { username: 'steve_crm@trisysit.com', name: "Steve" },
 
];

export function findUserByUsername(username) {
  return users.find(u => u.username === username);
}

export function getUsers() {
  // const filteredUsers = users.filter(user => user.username !== profile);
  return users;
}