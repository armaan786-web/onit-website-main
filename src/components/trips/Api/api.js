import axios from "axios";
import { BASE_URL } from "../../config/config";

class TripsModule {
  constructor() {
    this.base_url = BASE_URL;
  }

  getAllTrips(option) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `${this.base_url}auth/get-all-shipments-of-driver`,
        params: option,
      })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }


}
export default TripsModule;
