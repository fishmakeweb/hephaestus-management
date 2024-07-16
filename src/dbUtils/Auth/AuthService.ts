import axios from "@/dbUtils/axios";

class AuthService {
  static async login(username: any, password: any) {
    try {
      const response = await axios.post(`/auth/login`, {
        username,
        password,
      });
      const { token } = response.data; // Assume the response will only handle token
      if (token != null) {
        sessionStorage.setItem("token", token); // Store only the token
        sessionStorage.setItem("username", username); // Store the username for future use
      }
      return token; // Return the token for immediate use if necessary
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Ensure that login errors are properly handled or logged
    }
  }
  static getUserName() {
    const username = sessionStorage.getItem("username");
    return username ? username : null;
  }
  // SECURE DONE

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
    sessionStorage.removeItem("username");
  }

  static isAuthenticated() {
    const token = sessionStorage.getItem("token");
    return !!token;
  }

  static async checkRole(token: string) {
    try {
      const response = await axios.get("/public/checkrole", {
        params: {
          token: token,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking user role:", error);
      return false;
    }
  }
}

export default AuthService;
