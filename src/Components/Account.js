import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Vehicles.css";
import { API_BASE_URL } from "../apiConfig";

function Account() {
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        // Retrieving the token
        const token = localStorage.getItem("authToken");
        console.log("current token:", token); 

        if (!token) {
          console.error("Token not found. User is not logged in.");
          return;
        }

        // Send the token in the Authorization header
        const response = await axios.get(
        `${API_BASE_URL}/api/auth/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include 'Bearer' prefix
            },
          }
        );

        console.log("Fetched data:", response.data); // Debugging: confirm API response
        setUsernames(response.data);
      } catch (error) {
        console.error(
          "Error fetching usernames:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchUsernames();
  }, []);

  return (
    <section className="account-section p-3 p-md-5">
      <h1>Account </h1>
      <hr />
      <div className="pt-xl-4">
        <h6 className="users-list pb-xl-2">List of users of FastFix :</h6>
        {usernames.length > 0 ? (
          <ul className="ps-0 ">
            {usernames.map((user, index) => (
              <li key={index} className="">
                {user.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </section>
  );
}

export default Account;
