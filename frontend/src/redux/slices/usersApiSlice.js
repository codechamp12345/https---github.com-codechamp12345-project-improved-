import { apiSlice } from "../apiSlice";
import { logout } from "./authSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      transformResponse: (response) => {
        // Check if user is verified before allowing login
        if (!response.user.isVerified) {
          return {
            error: {
              data: {
                message: "Please verify your email before logging in"
              }
            }
          };
        }
        return response;
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear the Redux store
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
          // Clear all auth-related data from localStorage
          localStorage.removeItem('userInfo');
          localStorage.removeItem('verificationEmail');
          // Clear any cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        } catch (error) {
          // Even if the API call fails, we should still logout locally
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
          localStorage.removeItem('userInfo');
          localStorage.removeItem('verificationEmail');
          // Clear any cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        }
      },
    }),
    getUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
} = usersApiSlice;
