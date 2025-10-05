export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

//utils/apiPaths.js

export const API_PATHS = {
    AUTH:{
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        GET_USER_INFO: "/auth/getUser",
        UPDATE_PROFILE: "/auth/update-profile",
    },
    DASHBOARD:{
        GET_DATA: "/dashboard",
        GET_ANALYTICS: "/dashboard/analytics",
    },
    INCOME:{
        ADD_INCOME: "/income/add",
        GET_INCOME: "/income/get",
        DELETE_INCOME: (incomeId)=>`/income/${incomeId}`,
        DOWNLOAD_INCOME: "/income/downloadexcel",
    },
    EXPENSE:{
        ADD_EXPENSE: "/expense/add",
        GET_EXPENSE: "/expense/get",
        DELETE_EXPENSE: (expenseId)=>`/expense/${expenseId}`,
        DOWNLOAD_EXPENSE:  "/expense/downloadexcel",
    },
    IMAGE:{
        UPLOAD_IMAGE: "/auth/upload-image"
    },
}