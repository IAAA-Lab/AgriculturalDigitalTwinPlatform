import axios from "axios";
import { API_URL } from "../../../app/config/constants";
import { Parcel, Result } from "../../../core/Domain";

class FieldRestAPI {
  async getParcelsByUser(accessToken: string): Promise<Result<Parcel[]>> {
    try {
      const res = await axios.get(`${API_URL}/fields`, {
        params: {
          year: "2014",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status !== 200) {
        return { isError: true, error: Error() };
      }
      if ((res.data as Parcel[]).length === 0) {
        return { isError: true, error: Error() };
      }
      return { isError: false, data: res.data };
    } catch (e) {
      console.error((e as Error).message);
      return { isError: true, error: new Error() };
    }
  }
}

export default FieldRestAPI;
