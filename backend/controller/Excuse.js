import { SUPABASE_KEY, SUPABASE_URl } from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";
import { STATUS_PENDING } from "../utils/constants.js";

export const postNewExcuse = async (type, date, from_time, to_time, reason, approval_code) => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to post an excuse");
    }
    const response = await fetch(`${SUPABASE_URl}/rest/v1/excuses`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_code: LOGGING_USER.user_code,
        type,
        date,
        from_time,
        to_time,
        approval_code,
        reason,
        status: STATUS_PENDING,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }
    console.log(response);

    alert("Excuse request submitted successfully!");
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};

export const getAllExcusesByUser = async () => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to get its excuses");
    }
    //
    const response = await fetch(`${SUPABASE_URl}/rest/v1/excuses?user_code=eq.${LOGGING_USER.user_code}`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const excuses = await response.json();
    console.log(excuses);
    return excuses;
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};
