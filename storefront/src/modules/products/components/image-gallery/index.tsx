import { HttpTypes } from "@medusajs/types"
import { Container } from "@modules/common/components/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle?: string
}

const ImageGallery = ({ images, productTitle }: ImageGalleryProps) => {
  const [hero, ...rest] = images

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4">
        {hero && (
          <Container
            className="relative aspect-[16/11] w-full overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-subtle"
            id={hero.id}
          >
            {!!hero.url && (
              <Image
                src={hero.url}
                priority
                className="absolute inset-0"
                alt={`${productTitle ?? "VectraCompute AI hardware"} image 1`}
                fill
                sizes="(max-width: 1024px) 100vw, 760px"
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </Container>
        )}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {rest.map((image, index) => (
              <Container
                key={image.id}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-subtle"
                id={image.id}
              >
                {!!image.url && (
                  <Image
                    src={image.url}
                    className="absolute inset-0"
                    alt={`${
                      productTitle ?? "VectraCompute AI hardware"
                    } image ${index + 2}`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 360px"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
              </Container>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
