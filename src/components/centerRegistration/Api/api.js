import axios from "axios";
import { BASE_URL } from "../../config/config";

class TripsModule {
  constructor() {
    this.base_url = BASE_URL;
  }

  getCenterOnboarderObjectId(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}common/get-center-onboarder-objectId`,
        params: data,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  updateCenterAdmin(data) {
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

  getAllClients(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-clients`,
        params: data,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }


  getCenterDetails(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-centers`,
        params: payload,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  uploadImage(data, file_identifier_name) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}common/upload-image/${file_identifier_name}`,
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

  submitFeedBack(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}common/submit-feedback`,
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

  checkIfFeedBackExistsForThisId(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}common/check-feedback-link-valid`,
        params: data,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  sendOtp(data, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/sent-otp`,
        data: data,
        params: params
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }



  getCenterByQrId(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        params: data,
        url: `${this.base_url}center/get-center-based-on-qr`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  getAllServices() {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-services`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  getAllActiveServices() {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}admin/get-all-active-services`,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        });
    });

  }

  verifyOtp(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/verify-otp`,
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

  registerCenter(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/register-center-via-web`,
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

  adminCreateCenter(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}admin/create-center`,
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

  loginCenter(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}center/login-with-otp`,
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
export default TripsModule;
