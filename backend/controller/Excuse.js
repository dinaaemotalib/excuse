import { ROLE_CO, ROLE_EMPLOYEE, ROLE_HR, STATUS_ACCEPTED, SUPABASE_KEY, SUPABASE_URl } from "../utils/constants.js";
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
    const response = await fetch(
      `${SUPABASE_URl}/rest/v1/excuses?user_code=eq.${LOGGING_USER.user_code}&select=*,approval_code(email)`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const excuses = await response.json();
    return excuses;
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};

export const getAllPendingExcusesForApproval = async () => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to get its excuses");
    }
    if (LOGGING_USER.role === ROLE_EMPLOYEE) {
      throw new Error("Employees are not authorized for that route");
    }
    //
    const response = await fetch(
      `${SUPABASE_URl}/rest/v1/excuses?approval_code=eq.${LOGGING_USER.user_code}&status=eq.${STATUS_PENDING}&select=*,user_code(name)`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const excuses = await response.json();
    return excuses;
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};

export const getAllAcceptedExcuses = async (year, month) => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to get its excuses");
    }
    if (LOGGING_USER.role !== ROLE_HR) {
      throw new Error(`${LOGGING_USER.role}/s are not authorized for that route`);
    }

    const startOfMonth = `${year.toString()}-${month.toString().padStart(2, "0")}-01`;
    const endOfMonth = `${year.toString()}-${month.toString().padStart(2, "0")}-31`;

    const response = await fetch(
      `${SUPABASE_URl}/rest/v1/excuses?status=eq.${STATUS_ACCEPTED}&date=gte.${startOfMonth}&date=lt.${endOfMonth}&select=*,user_code(name,user_code)`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const excuses = await response.json();
    return excuses;
  } catch (error) {
    console.log("Error getting all Accepted excuses");
    console.log(error);
  }
};

export const getAllExcuses = async (year, month) => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to get its excuses");
    }
    if (LOGGING_USER.role !== ROLE_CO) {
      throw new Error(`${LOGGING_USER.role}/s are not authorized for that route`);
    }

    const startOfMonth = `${year.toString()}-${month.toString().padStart(2, "0")}-01`;
    const endOfMonth = `${year.toString()}-${month.toString().padStart(2, "0")}-31`;

    const response = await fetch(
      `${SUPABASE_URl}/rest/v1/excuses?date=gte.${startOfMonth}&date=lt.${endOfMonth}&select=*,user_code(name,user_code),approval_code(email)`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const excuses = await response.json();
    return excuses;
  } catch (error) {
    console.log("Error getting all excuses");
    console.log(error);
  }
};

export const changeExcuseStatus = async (excuse_id, newStatus) => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to post an excuse");
    }
    if (LOGGING_USER.role === ROLE_EMPLOYEE) {
      throw new Error("Employees cant change its excuse status");
    }
    const response = await fetch(`${SUPABASE_URl}/rest/v1/excuses?excuse_id=eq.${excuse_id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus, // Only updating the status field
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }
    console.log(response);

    alert(`Excuse status has been changed to ${newStatus}`);
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};
