import axios from "axios";
import { API_URL } from "../../../app/config/constants";
import { Result } from "../../../core/Domain";
import {
  LogoutError,
  MustLoginAgainError,
  MustRefreshSession,
} from "../../../core/Exceptions";

class AuthRestApi {
  async logout(accessToken: string): Promise<Result<boolean>> {
    try {
      const res = await axios.post(`${API_URL}/auth/logout`, null, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status !== 200)
        return { isError: true, error: new LogoutError() };
      else return { isError: false, data: true };
    } catch (e) {
      console.error((e as Error).message);
      return { isError: true, error: new LogoutError() };
    }
  }

  async refresh(): Promise<Result<string>> {
    try {
      const res = await axios.post(`${API_URL}/auth/refresh`, null, {
        withCredentials: true,
      });
      if (res.status === 200)
        return { isError: false, data: res.data.accesstoken };
      else return { isError: true, error: new MustLoginAgainError() };
    } catch (e) {
      console.error((e as Error).message);
      return { isError: true, error: new MustLoginAgainError() };
    }
  }

  async validateLogin(accessToken: string): Promise<Result<boolean>> {
    try {
      const res = await axios.post(`${API_URL}/auth/validate`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status === 200) {
        return { isError: false, data: res.data };
      } else return { isError: true, error: new MustRefreshSession() };
    } catch (e) {
      console.error((e as Error).message);
      return { isError: true, error: new MustRefreshSession() };
    }
  }
}

export default AuthRestApi;
