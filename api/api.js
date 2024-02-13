export const api = async(endpoint, method = 'post', params = {}) => {
    const config = useRuntimeConfig();
    const {data, pending, error} = await useFetch(endpoint, {
        method,
        baseURL: config.public.NUXT_PUBLIC_API_BASE,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        onRequest({ request, options }) {
            if (method == 'get') {
                options.params = params
            }
            if (method == 'post') {
                options.body = params
            }
        }
      })
    return { data, pending, error };
}
export const get = async(endpoint, params = {}) => {
  return await api(endpoint, 'get', params);
};

export const post = async(endpoint, params = {}) => {
  return await api(endpoint, 'post', params);
};

export const remove = async(endpoint, params = {}) => {
  return await api(endpoint, 'delete', params);
};

