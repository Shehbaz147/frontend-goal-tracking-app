import { get } from "~/api/api";
import { toast } from "vue-sonner";

const config = useRuntimeConfig();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authToken: localStorage.getItem("authToken"),
    baseUrl: config.public.NUXT_PUBLIC_API_BASE,
    authUser: {
      name: "",
      image: "",
    },
    errors: [],
    loading: false,
  }),

  actions: {

    setErrors(errors: any){
      this.$state.errors = errors
    },

    getErrors(){
      return this.$state.errors
    },

    async getUserDetails(){
      try {

        const { data, error } = await get('/user');

        if (error.value) {
          return error
        } else {
          return {
            id: data.value.id,
            name: data.value.name
          };
        }
      } catch (error) {
        return error;
      }
    },

    // since we rely on `this`, we cannot use an arrow function
    async signIn(payload: any) {
      this.loading = true;
      const state = this;

      const { data } = useFetch("/auth/login", {
        method: "post",
        baseURL: this.baseUrl,
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        onResponse({ request, response, options }) {
          console.log(response)
          if (response.status == 401) {
            state.loading = false;
            toast(`${response.statusText}`, {
              description: "",
            });

          } else if (response._data.user.access_token) {
            state.errors = []
            localStorage.setItem(
              "token",
              response._data.user.access_token
            );
            state.authUser.name = response._data.user.name;
            state.loading = false;
            navigateTo("/dashboard");
          }
        },
      });
    },

    async signUp(payload: any) {
      this.loading = true;
      const state = this.$state;

      const { data } = useFetch("/auth/register", {
        method: "post",
        baseURL: this.baseUrl,
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          password_confirmation: payload.password_confirmation
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        onResponse({ request, response, options }) {
          if (response.status == 401) {
            state.loading = false;
            toast(`${response.statusText}`);
            state.errors = response._data.errors
          } else if (response._data.user) {
            state.errors = []
            localStorage.setItem("token", response._data.access_token);
            state.authUser.name = response._data.user.name;
            state.loading = false;
            navigateTo("/dashboard");
          }else{
            state.loading = false;
            toast(`${response.statusText}`);
            state.errors = response._data.errors
          }
        },
      });
    },

    logout() {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      useFetch("/auth/logout", {
        method: "post",
        baseURL: this.baseUrl,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        onResponse({ request, response, options }) {
          if (response.status === 200) {
            localStorage.removeItem("token");
            navigateTo("/login");
          }
        },
        onResponseError({ request, response, options }) {
          ElNotification({
            message: "Something Went Wrong",
            type: "error",
          });
        },
      });
    },

    async getProfile() {
      try {
        const { data, error } = await get("/profile");
        if (error.value) {
        } else {
          this.authUser.name = data.value.name;
          this.authUser.image = data.value?.images?.avatar;
        }
      } catch (error) {
        // Handle any unexpected errors
      }
    },
  },
  getters: {
    getAuthToken: (state) => state.authToken,
  },
});
