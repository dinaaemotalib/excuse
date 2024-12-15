import {
  ROLE_CO,
  ROLE_EMPLOYEE,
  ROLE_HR,
  STATUS_ACCEPTED,
  STATUS_PENDING,
  SUPABASE_KEY,
  SUPABASE_URl,
} from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

export const postNewLeave = async (type, from_date, to_date, reason, approval_code) => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to post an excuse");
    }
    const response = await fetch(`${SUPABASE_URl}/rest/v1/leaves`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_code: LOGGING_USER.user_code,
        type,
        from_date,
        to_date,
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

    alert("Leave request submitted successfully!");
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};

export const getAllLeavesByUser = async () => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to get its excuses");
    }
    //
    const response = await fetch(
      `${SUPABASE_URl}/rest/v1/leaves?user_code=eq.${LOGGING_USER.user_code}&select=*,approval_code(email)`,
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

    const leaves = await response.json();
    return leaves;
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};

export const getAllPendingLeavesForApproval = async () => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to get its leaves");
    }
    if (LOGGING_USER.role === ROLE_EMPLOYEE) {
      throw new Error("Employees are not authorized for that route");
    }
    //
    const response = await fetch(
      `${SUPABASE_URl}/rest/v1/leaves?approval_code=eq.${LOGGING_USER.user_code}&status=eq.${STATUS_PENDING}&select=*,user_code(name)`,
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

    const leaves = await response.json();
    console.log(leaves);
    return leaves;
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};

export const getAllAcceptedLeaves = async (year) => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to get its excuses");
    }
    if (LOGGING_USER.role !== ROLE_HR) {
      throw new Error(`${LOGGING_USER.role}/s are not authorized for that route`);
    }

    const startOfYear = `${year}-01-01`; // First day of the year

    const response = await fetch(
      `${SUPABASE_URl}/rest/v1/leaves?status=eq.${STATUS_ACCEPTED}&or=(from_date.gte.${startOfYear},to_date.gte.${startOfYear})&select=*,user_code(name,user_code)`,
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

    const leaves = await response.json();
    return leaves;
  } catch (error) {
    console.log("Error getting all Pending and Accepted leaves");
    console.log(error);
  }
};

export const getAllLeaves = async (year) => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to get its excuses");
    }
    if (LOGGING_USER.role !== ROLE_CO) {
      throw new Error(`${LOGGING_USER.role}/s are not authorized for that route`);
    }

    const startOfYear = `${year}-01-01`; // First day of the year

    const response = await fetch(
      `${SUPABASE_URl}/rest/v1/leaves?or=(from_date.gte.${startOfYear},to_date.gte.${startOfYear})&select=*,user_code(name),approval_code(email)`,
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

    const leaves = await response.json();
    return leaves;
  } catch (error) {
    console.log("Error getting all leaves");
    console.log(error);
  }
};

export const changeLeaveStatus = async (leave_id, newStatus) => {
  try {
    if (LOGGING_USER === null) {
      throw new Error("No loged in user to post an excuse");
    }
    if (LOGGING_USER.role === ROLE_EMPLOYEE) {
      throw new Error("Employees cant change its leave status");
    }
    const response = await fetch(`${SUPABASE_URl}/rest/v1/leaves?leave_id=eq.${leave_id}`, {
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

    alert(`Leave status has been changed to ${newStatus}`);
  } catch (error) {
    console.log("Error making new excuse");
    console.log(error);
  }
};
