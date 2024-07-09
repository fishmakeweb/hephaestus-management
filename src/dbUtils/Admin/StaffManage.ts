import axios from "@/dbUtils/axios";
import AuthService from "@/dbUtils/Auth/AuthService";

export interface Staff {
    staffId: string;
    fullName: string;
    email: string;
    username: string;
    role: {
      roleName: string;
    };
  }

class StaffManage {
    async fetchStaffs() {
        try {
            const response = await axios.get("/secure/staffs");
            const transformedData = response.data.map(
                (staff: { staffId: any; fullName: any; email: any; username: any; role: any; }) => ({
                    staffId: staff.staffId,
                    fullName: staff.fullName,
                    email: staff.email,
                    username: staff.username,
                    role: staff.role
                }));
            return transformedData;
        } catch (error) {
            console.error("Error fetching users data:", error);
        }
    }

    async addStaff(fullName: any, email: any, username: any, password: any, role: any) {
        const staffData = {
            fullName: fullName,
            email: email,
            username: username,
            password: password,
            role: { roleName: role }
        };
        try {
            const response = await AuthService.registerStaff(staffData);
            console.log('Register successful:', response);
        } catch (error) {
            console.error('Add staff failed:', error);
        }
    }

    async updateStaff(staffId: any, fullName: any, email: any, role: any) {
        const updateStaff = {
            fullName,
            email,
            role: { roleName: role }
        };
        try {
            const response = await axios.put(`/secure/staffs/${staffId}`, updateStaff);
            console.log('Update successful: ', response);
        } catch (error) {
            console.error('Update failed: ', error);
        }
    }

    async deleteStaff(staffId: any) {
        try {
            axios.delete(`/secure/staffs/${staffId}`);
        } catch (error) {
            console.error('Delete failed: ', error);
        }
    }
}

export default StaffManage;