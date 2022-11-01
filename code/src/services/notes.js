import axios from 'axios';

// baseUrl doesn't need to include the domain
// for production version, it will use server's domain
// for dev version, setupProxy.js will ensure that this app can communicate with server
const baseUrl = '/api/notes';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
};

const create = (newObject) => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
}

const noteService = { getAll, create, update };
export default noteService;