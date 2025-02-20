// import { useEffect, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";
// import { clearUserLocalStorage } from "./utils";
// import { useDispatch } from "react-redux";
// import { userLoginValues } from "@/store/slices/loginSlice";

// const ResponseInterceptor = () => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const interceptorId = useRef<any>(null);
//   const { push } = useRouter();
//   const dispatch = useDispatch();
//   useEffect(() => {
//     interceptorId.current = axios.interceptors.response.use(
//       (response) => {
//         return response;
//       },
//       (error) => {
//         if (error.response.status === 401 || error.response.status === 403) {
//           dispatch(
//             userLoginValues({
//               id: "",
//               userEmail: "",
//               firstName: "",
//               profilePic: "",
//             })
//           );
//           clearUserLocalStorage();
//           push("/login");
//         }
//         return Promise.reject(error);
//       }
//     );
//     return () => {
//       axios.interceptors.response.eject(interceptorId.current);
//     };
//   }, []);

//   return null;
// };

// export default ResponseInterceptor;
