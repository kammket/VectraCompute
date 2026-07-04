import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@modules/common/components/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle?: string
}

// Mobile: one horizontal snap-scroll row so many photos never push the buy
// panel down the page. Desktop (large+): hero image with a two-column grid of
// the remaining shots. Zero JS — pure CSS scroll snap.
const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  const single = images.length <= 1

  return (
    <div className="relative">
      <div className="rounded-md border border-grey-20 bg-grey-90 p-3 shadow-elevation-card-rest">
        <div
          className={clx(
            "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1",
            "large:grid large:grid-cols-2 large:gap-4 large:overflow-visible large:pb-0"
          )}
        >
          {images.map((image, index) => (
            <Container
              key={image.id}
              id={image.id}
              className={clx(
                "relative shrink-0 snap-center overflow-hidden rounded-md border border-grey-70 bg-grey-90",
                single ? "w-full" : "w-[86%]",
                "aspect-[4/3] large:w-full large:shrink",
                index === 0 && "large:col-span-2 large:aspect-[16/11]"
              )}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index === 0}
                  className="absolute inset-0"
                  alt={`${productTitle ?? "VectraCompute AI hardware"} image ${
                    index + 1
                  }`}
                  unoptimized={image.url.startsWith("data:")}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 1024px) 86vw, 760px"
                      : "(max-width: 1024px) 86vw, 360px"
                  }
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          ))}
        </div>
        {images.length > 1 && (
          <p className="mt-2 text-center text-[11px] text-grey-40 large:hidden">
            Swipe for more · {images.length} photos
          </p>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
