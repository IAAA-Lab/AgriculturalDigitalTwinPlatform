import axios from "axios";

class AuthRestApi {
  async logout(): Promise<Result<boolean>> {
    try {
      const res = await axios.post(`${API_URL}/auth/logout`);
      if (res.status !== 200)
        return { isError: true, error: new LogoutError() };
      else return { isError: false, data: true };
    } catch (e) {
      console.error((e as Error).message);
      return { isError: true, error: new BackendError(e as Error) };
    }
  }

  async refresh(): Promise<Result<string>> {
    try {
      const res = await axios.post(`${API_URL}/auth/refresh`);
      if (res.status === 200)
        return { isError: false, data: res.data.accesstoken };
      if (res.status === 401)
        return { isError: true, error: new MustLoginAgainError() };
      else return { isError: true, error: new BackendError() };
    } catch (e) {
      console.error((e as Error).message);
      return { isError: true, error: new BackendError(e as Error) };
    }
  }
}

export default AuthRestApi;
