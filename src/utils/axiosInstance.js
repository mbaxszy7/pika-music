import axios from "axios"

const createAxiosInstance = ({ ctx, isSSR, isDEV }) => {
  const baseURL = isDEV ? "/" : "http://localhost:9000"
  if (typeof window === "undefined") {
    return axios.create({
      baseURL,
      headers: {
        cookie: ctx?.cookies.get() ?? {},
      },
    })
  }

  return axios.create({
    baseURL,
  })
}

export default createAxiosInstance
