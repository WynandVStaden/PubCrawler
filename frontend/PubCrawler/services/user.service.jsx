import http from "../http-common";

class UserDataService {

   /***
    USED ROUTES
    ***/
    checkLogin(data){return http.post("/users/login", data)}
    doSignUp(data){return http.post("/users/signup", data)}
    editProfile(data) {return http.put("/users/edit_profile", data)}
    deleteProfile(username) {return http.delete("/users/delete_profile", { data: { username: username },
        headers: { 'Content-Type': 'application/json' },
    })}

    /***
     TESTING ROUTES
     ***/
    generateSampleData() {
        return http.post("/users/generate_sample_data")
    }
    getAll() {
        return http.get("/users/");
    }

    getUserByUserName(username) {
        return http.get(`/users/username/${username}`)
    }

    getUserByEmail(email) {
        return http.get(`/users/email/${email}`)
    }
    create(data) {
        return http.post("/users/", data);
    }
    updateUserByEmail(email, data) {
        return http.put(`/users/email/${email}`, data);
    }
    updateUserByUsername(username, data) {
        return http.put(`/users/username/${username}`, data);
    }

    deleteUserByUsername(username) {
        return http.delete(`/users/username/${username}`);
    }

    deleteAll() {
        return http.delete(`/users/`);
    }

}

export default new UserDataService();
