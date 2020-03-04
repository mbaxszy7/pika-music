import axios from "axios"

const createAxiosInstance = ({ isDEV }) => {
  // [isDEV] in csr development means true
  const baseURL = isDEV ? "/" : "http://192.168.10.109:9000"
  return axios.create({
    baseURL,
  })
}

export default createAxiosInstance
