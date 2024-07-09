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
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("refreshToken", refreshToken);
      }
      if (staff) {
        sessionStorage.setItem("role", "STAFF");
        sessionStorage.setItem("user", JSON.stringify(staff));
        if (staff.role.roleName == "ROLE_ADMIN") {
          sessionStorage.setItem("userRole", "ROLE_ADMIN");
        } else {
          sessionStorage.setItem("userRole", "ROLE_SALESTAFF");
        }
        return response.data;
      }
    } catch (error) {
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
    try {
      const userRole = sessionStorage.getItem("userRole");
      return userRole == "ROLE_ADMIN";
    } catch (error) {
    }
  }

  static isSales() {
    try {
      const userRole = sessionStorage.getItem("userRole");
      return userRole == "ROLE_SALESTAFF";
    } catch (error) {
      
    }

  }

  static getStaff() {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch (error) {
      
    }
  }

  static async refreshToken() {
    try {
      const refreshToken = sessionStorage.getItem("refreshToken");
      const response = await axios.post(`/auth/refresh`, {
        refreshToken,
      });
      sessionStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole");
  }

  static isAuthenticated() {
    const token = sessionStorage.getItem("token");
    return !!token;
  }

  static isStaff() {
    const role = sessionStorage.getItem("role");
    return role === "STAFF";
  }
}

export default AuthService;
