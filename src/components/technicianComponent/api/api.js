import axios from "axios";
import { BASE_URL } from "../../config/config";

class TechnicianApi {
    constructor() {
        this.base_url = BASE_URL;
    }


    getAllTicketCreatedByYou() {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: `${this.base_url}center/get-all-tickets-created-not-assigned`,
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                });
        });

    }

    getAllTechnician() {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: `${this.base_url}center/get-all-technician`,
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                });
        });
    }
}

export default TechnicianApi;