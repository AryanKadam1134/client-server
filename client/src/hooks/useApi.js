import { useState } from "react";

export default function useApi() {
  const [loading, setLoading] = useState({});

  const setLoadingKey = (key, boolean) => {
    setLoading((prev) => ({ ...prev, [key]: boolean }));
  };

  const callApi = async (api, keyName, onSuccess, onError) => {
    setLoadingKey(keyName, true);

    try {
      const res = await api();

      if (res.success) {
        onSuccess(res.data);
      }
    } catch (error) {
      console.error("Error: ", error);
      onError(error);
    } finally {
      setLoadingKey(keyName, false);
    }
  };

  return { loading, callApi };
}
