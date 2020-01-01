import produce from "immer"

const defaultState = {
  newsList: ["yyy", "uuu", "ppp"],
  name: "frank",
}

const homeReducer = produce((draft, action) => {
  if (action.type === "ADD_NEWS") {
    const data = Array.isArray(action.data) ? [...action.data] : [action.data]
    draft.newsList.push(...data)
  }
}, defaultState)

export default homeReducer
