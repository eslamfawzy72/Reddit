import { useEffect, useState } from "react";
import "../styles/users.css";

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="users-list-container">
      <h1>Users:</h1>
      {users.length === 0 ? (
        <p className="no-users">No users found</p>
      ) : (
        <ul className="users-list">
          {users.map((u) => (
            <li key={u._id} className="user-item">
              {u.userName} — {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UsersList;
