import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// normalise error shape so callers always get { message }
// also reject responses that came back as HTML (misconfigured VITE_API_URL)
apiClient.interceptors.response.use(
  (res) => {
    const contentType: string = res.headers['content-type'] ?? '';
    if (!contentType.includes('application/json')) {
      return Promise.reject(new Error('API unreachable — check VITE_API_URL'));
    }
    return res;
  },
  (err) => {
    const message: string =
      err.response?.data?.message ?? err.message ?? 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
