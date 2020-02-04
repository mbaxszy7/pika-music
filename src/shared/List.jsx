/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import { memo } from "react"
import PropTypes from "prop-types"

const List = memo(({ list, fallBack, listItem }) => {
  return list && list.length > 0
    ? list.map((item, index) => listItem({ item, index }))
    : fallBack || null
})

List.propTypes = {
  list: PropTypes.array,
  fallBack: PropTypes.node,
  listItem: PropTypes.func,
}

export default List
