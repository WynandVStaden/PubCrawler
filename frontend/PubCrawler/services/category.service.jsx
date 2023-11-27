import http from "../http-common";

class CategoryDataService {

    /* used routes */
    create(data) {
        return http.post("/categories/", data);
    }

    /* routes that are redundant but can be useful if you want to test something*/
    generateSampleData() {
        return http.post("/categories/generate_sample_data")
    }
    getAll() {
        return http.get("/categories");
    }

    getByTitle(title) {
        return http.get(`/categories/title/${title}`)
    }

    getAllByType(type) {
        return http.get(`/categories/type/${type}`)
    }

    updateByTitle(title, data) {
        return http.put(`/categories/title/${title}`, data);
    }

    deleteByTitle(title) {
        return http.delete(`/categories/title/${title}`);
    }

    deleteAll() {
        return http.delete(`/categories/`);
    }

}

export default new CategoryDataService();
