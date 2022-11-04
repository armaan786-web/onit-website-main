import axios from "axios";
import { BASE_URL } from "../../config/config";

class BroadCastListing {
    constructor() {
        this.base_url = BASE_URL;
    }

    getAllBroadCastTicket() {
        return new Promise((resolve, reject) => {
            axios({
                method: "get",
                url: `${this.base_url}center/get-all-available-broadcast`,
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                });
        });
    }

    acceptBroadCast(data) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                data: data,
                url: `${this.base_url}center/accepted-broadcast-request`,
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                });
        });

    }

    acceptBroadCastWithoutPayment(data) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                data: data,
                url: `${this.base_url}center/accepted-broadcast-request-unpaid-ticket`,
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                });
        });

    }


    acceptTicketAfterPayment(data) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                data: data,
                url: `${this.base_url}center/accept-ticket-after-payment`,
            })
                .then((res) => {
                    resolve(res.data)
                })
                .catch((err) => {
                    reject(err)
                });
        });

    }
    rejectTicket(data) {
        return new Promise((resolve, reject) => {
            axios({
                method: "post",
                data: data,
                url: `${this.base_url}center/reject-broadCast-technician`,
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

export default BroadCastListing;