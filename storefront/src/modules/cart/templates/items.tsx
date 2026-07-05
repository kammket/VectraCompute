import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import MobileCartCard from "@modules/cart/components/mobile-cart-card"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const sortedItems = items
    ? [...items].sort((a, b) =>
        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
      )
    : []

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-2xl small:text-[2rem] small:leading-[2.75rem]">
          Cart
        </Heading>
      </div>

      {/* Mobile: two compact cards per row so more items are visible at once */}
      <div className="grid grid-cols-2 gap-3 small:hidden">
        {items
          ? sortedItems.map((item) => (
              <MobileCartCard
                key={item.id}
                item={item}
                currencyCode={cart?.currency_code ?? "usd"}
              />
            ))
          : repeat(4).map((i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-md bg-grey-10"
              />
            ))}
      </div>

      {/* Desktop: detailed table */}
      <Table className="hidden small:table">
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? sortedItems.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code}
                />
              ))
            : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
