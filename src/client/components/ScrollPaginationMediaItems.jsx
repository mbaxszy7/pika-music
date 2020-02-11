import React, { memo, useRef, useCallback, useEffect } from "react"
import useSWR, { useSWRPages } from "swr"
import styled from "styled-components"
import MediaItemList from "./MediaItemList"

const NoData = styled.div`
  text-align: center;
  color: ${props => props.theme.fg};
`

const ScrollPaginationMediaItems = memo(
  ({
    keyPage,
    getScrollRef,
    pageFetch,
    getUrl,
    mockLoadingOption,
    setItemsCount,
  }) => {
    const page = useRef(0)
    const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
      keyPage,
      ({ offset, withSWR }) => {
        const { data } = withSWR(
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useSWR(getUrl(offset || 0), pageFetch, {
            revalidateOnFocus: false,
          }),
        )
        page.current = offset
        if (data?.[0] === null) {
          return <NoData>无结果</NoData>
        }
        return (
          <MediaItemList
            list={data?.[0] ?? new Array(2).fill({ ...mockLoadingOption })}
          />
        )
      },
      // one page's SWR => offset of next page
      ({ data: projects }) => {
        if (setItemsCount) {
          setItemsCount(projects?.[2])
        }
        if (projects?.[1]) {
          return page.current + 1
        }

        return null
      },
    )

    const onScroll = useCallback(() => {
      const isBottom =
        window.scrollY + 30 > getScrollRef().clientHeight - window.innerHeight

      if (isBottom && !isReachingEnd && !isLoadingMore) {
        loadMore()
      }
    }, [getScrollRef, isReachingEnd, isLoadingMore, loadMore])

    useEffect(() => {
      window.addEventListener("scroll", onScroll)
      return () => window.removeEventListener("scroll", onScroll)
    }, [onScroll])

    return <>{pages}</>
  },
)

export default ScrollPaginationMediaItems
