import { useState, useCallback, useMemo } from "react";
import axios from "axios";

const useAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_EXPRESS_API_URL,
    });
  }, []);

  const request = useCallback(
    async (method, url, payload = null, config = {}) => {
      setLoading(true);
      setError(null);
      try {
        // Corregimos la forma en que se pasan los argumentos a los métodos de axios
        let response;
        if (method === "get" || method === "delete") {
          // GET y DELETE no tienen payload en el segundo argumento
          response = await axiosInstance[method](url, config);
        } else {
          // POST, PUT, PATCH tienen payload en el segundo argumento y config en el tercero
          response = await axiosInstance[method](url, payload, config);
        }

        // Aseguramos que los datos se actualicen correctamente
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [axiosInstance]
  );

  const get = useCallback(
    (url, config = {}) => request("get", url, null, config),
    [request]
  );

  const post = useCallback(
    (url, payload = null, config = {}) => request("post", url, payload, config),
    [request]
  );

  const put = useCallback(
    (url, payload = null, config = {}) => request("put", url, payload, config),
    [request]
  );

  const del = useCallback(
    (url, config = {}) => request("delete", url, null, config),
    [request]
  );

  return { data, error, loading, get, post, put, del };
};

export default useAxios;
