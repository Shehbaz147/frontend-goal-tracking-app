import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { post } from "~/api/api";

export default defineNuxtPlugin(() => {
  window.Pusher = Pusher;

  const config = useRuntimeConfig();

  window.Echo = new Echo({
    broadcaster: "pusher",
    key: config.public.PUSHER_APP_KEY,
    wsHost: config.public.PUSHER_HOST,
    wssHost: config.public.PUSHER_HOST,
    cluster: config.public.PUSHER_APP_CLUSTER,
    wsPort: config.public.PUSHER_PORT,
    wssPort: config.public.PUSHER_PORT,
    forceTLS: false,
    authorizer: (channel, options) => {
      return {
        authorize: async (socketId, callback) => {
          try {
            const response = await post("/broadcasting/auth", {
              socket_id: socketId,
              channel_name: channel.name,
            });

            callback(null, response);
          } catch (error) {
            callback(error);
          }
        },
      };
    },
  });
});
