import { awaitWrapper } from "../../utils"

const fetchCompData = async store => {
  const fakeFetchData = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(["rrrrr", "llllll"])
    }, 2000)
  })

  const [error, data] = await awaitWrapper(fakeFetchData)

  if (error) {
    //  handle error in server setInitialDataToStore
    return Promise.reject(error)
  }
  store.dispatch({
    type: "ADD_NEWS",
    data,
  })
}

export default fetchCompData
