import axios from "axios";
import { BASE_URL } from "../../config/config";

class AdminApiModule {
  constructor() {
    this.base_url = BASE_URL;
  }

  getAllBroadCastedList() {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-broadCasted-ticket`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  updateTicket(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/update-ticket`,
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
        url: `${this.base_url}admin/create-ticket`,
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


  getAllFeedBack() {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-feedBacks`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }



  getAllCenters(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-centers`,
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


  login(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/login`,
        data: data
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  getAllTickets(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-ticket`,
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

  getSingleTicket(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-single-ticket`,
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

  adminBroadCast(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/admin-broadcast`,
        data: data

      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  updatePincode(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/update-ticket`,
        data: data

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
        url: `${this.base_url}admin/get-all-technician`,
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

  addService(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/create-services`,
        data: data
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  deleteService(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/delete-service`,
        data: data
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  updateService(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/update-service`,
        data: data
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  updateServiceStatus(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/update-service-status`,
        data: data
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  addClient(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/add-client`,
        data: data
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  getAllClients() {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-clients`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  deleteClient(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/delete-client`,
        data: data
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }


  adminUpdateCenter(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/update-center`,
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

  adminUpdateTechnician(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/update-technician`,
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

  getAllAvailableRoles(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-available-roles`,
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

  adminAddRole(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/add-role`,
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

  adminUpdateRole(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/update-role`,
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

  getAllUsers(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-users`,
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

  adminCreateUser(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/create-user`,
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

  adminRemoveUser(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/remove-user`,
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

  getAllCenterOnBoarder(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin//get-all-onboarder`,
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

  adminCreateCenterOnBoarder(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/create-centerOnBoarder`,
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

  adminUpdateCenterOnBoarder(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/update-centerOnBoarder`,
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

  uploadTicketsCsv(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/upload-csv-for-ticket`,
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

export default AdminApiModule;