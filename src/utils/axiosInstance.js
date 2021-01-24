import axios from "axios"

const createAxiosInstance = ({ isDEV }) => {
  // [isDEV] in csr development means true
  const baseURL = isDEV ? "/" : "https://81.69.200.140"
  return axios.create({
    baseURL,
  })
}

export default createAxiosInstance
