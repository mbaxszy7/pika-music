import { css } from "styled-components"

const SingleLineTexts = css`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
`

export const MultipleLineTexts = n => css`
  text-overflow: ellipsis;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示，必须结合的属性 **/
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式，必须结合的属性 **/
  -webkit-line-clamp: ${n}; /** 显示的行数 **/
  overflow: hidden; /** 隐藏超出的内容 **/
`
export default SingleLineTexts
