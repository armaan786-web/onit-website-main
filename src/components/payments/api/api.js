import axios from "axios";
import { BASE_URL } from "../../config/config";

class paymentModule {
    constructor() {
        this.base_url = BASE_URL;
    }

    getAllCenters() {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: `${this.base_url}center/get-all-orders`,
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

export default paymentModule;