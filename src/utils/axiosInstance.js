import axios from "axios"

const createAxiosInstance = ({ isDEV }) => {
  // [isDEV] in csr development means true
  const baseURL = isDEV ? "/" : "https://111.229.78.115"
  return axios.create({
    baseURL,
  })
}

export default createAxiosInstance
