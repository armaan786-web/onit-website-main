import axios from "axios";
import { BASE_URL } from "../../config/config";

class centerListing {
  constructor() {
    this.base_url = BASE_URL;
  }

  getAllTickets() {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}center/get-all-ticket`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  createTechnician(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/create-technician`,
        data: data,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  PublicTicketBooking(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/public-ticket-booking`,
        data: data,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  createTicket(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/create-ticket`,
        data: data,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  getAllTechnician(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}center/get-all-technician`,
        params: payload
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  closeTicket(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/close-ticket`,
        data: data,

      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  assignTechnician(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        data: data,
        url: `${this.base_url}center/assigning-ticket-technician`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  changeTechnician(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        data: data,
        url: `${this.base_url}center/change-ticket-technician`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  addTicketRemarks(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        data: data,
        url: `${this.base_url}center/add-remarks-ticket`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  centerUpdateTechnician(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/update-technician`,
        data: data,
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

export default centerListing;