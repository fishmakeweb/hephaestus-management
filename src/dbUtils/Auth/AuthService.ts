import axios from "@/dbUtils/axios";

class AuthService {
  static async login(username: any, password: any) {
    try {
      const response = await axios.post(`/auth/login`, {
        username,
        password,
      });
      const { token, refreshToken, staff } = response.data;
      if (token != null) {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (staff) {
        localStorage.setItem("role", "STAFF");
        localStorage.setItem("user", JSON.stringify(staff));
        if(staff.role.roleName == 'ROLE_ADMIN') {
            localStorage.setItem("userRole", "ROLE_ADMIN");
        } else {
            localStorage.setItem("userRole", "ROLE_SALESTAFF");  
      }
      return response.data;
    }} catch (error) {
      throw error;
    }
  }

  static async registerStaff(userData: any) {
    try {
      const response = await axios.post(`/auth/register/staff`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static isAdmin() {
    const userRole = localStorage.getItem("userRole");
    return userRole == "ROLE_ADMIN";
  }

  static isSales() {
    const userRole = localStorage.getItem("userRole");
    return userRole == "ROLE_SALESTAFF";
  }

  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(`/auth/refresh`, {
        refreshToken,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
  }

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  static isStaff() {
    const role = localStorage.getItem("role");
    return role === "STAFF";
  }
}

export default AuthService;
