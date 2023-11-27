import http from "../http-common";

class NoteDataService {

    /* used routes */
    create(data) {
        return http.post("/notes/", data);
    }

    /* routes that are redundant but can be useful if you want to test something*/
    generateSampleData() {
        return http.post("/notes/generate_sample_data")
    }
    getAll() {
        return http.get("/notes/");
    }

    getByUsername(username) {
        return http.get(`/notes/username/${username}`)
    }

    getByTitle(title) {
        return http.get(`/notes/title/${title}`)
    }
    updateByUsername(username, data) {
        return http.put(`/notes/username/${username}`, data);
    }
    updateByTitle(title, data) {
        return http.put(`/notes/title/${title}`, data);
    }

    deleteByUsername(username) {
        return http.delete(`/notes/username/${username}`);
    }

    deleteByTitle(title) {
        return http.delete(`/notes/title/${title}`);
    }

    deleteAll() {
        return http.delete(`/notes/`);
    }

}

export default new NoteDataService();
