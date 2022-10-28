import axios from "axios";

const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = (personObj) => {
    const request = axios.post(baseUrl, personObj);
    return request.then(response => response.data);
};

const update = (id, personObj) => {
    const request = axios.put(`${baseUrl}/${id}`, personObj);
    return request.then(response => response.data);
}

const _delete = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(response => response.data);
}

const personService = { getAll, create, update, _delete };
export default personService;