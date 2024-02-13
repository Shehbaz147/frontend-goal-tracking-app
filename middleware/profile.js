
const auth = useAuthStore();
export default function () {
  if (!auth.authUser.name) {
    auth.getProfile()
  }
}
