import { SUPABASE_URl, SUPABASE_KEY } from "../utils/constants.js";

export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${SUPABASE_URl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users = await response.json();

    if (users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get user");
  }
};
