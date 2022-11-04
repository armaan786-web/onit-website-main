import axios from "axios";
import { BASE_URL } from "../../config/config";

class CenterOnboardApiModule {
  constructor() {
    this.base_url = BASE_URL;
  }

  SendOtpOnboarder(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}centerOnboarding/sendotp-onboarder`,
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

  RegisterOnboarder(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}centerOnboarding/register-onboarder`,
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

  SendOtpOnboarderLogin(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}centerOnboarding/send-otp-login`,
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

  VerifyOtpOnboarder(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}centerOnboarding/verify-otp-login`,
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

  OnboarderCreateCenter(data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: `${this.base_url}centerOnboarding/create-center`,
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

  OnboarderGetAllCenters(payload) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}centerOnboarding/get-center`,
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

}

export default CenterOnboardApiModule;