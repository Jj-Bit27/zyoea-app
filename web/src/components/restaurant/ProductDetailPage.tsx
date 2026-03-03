import { IoArrowBack } from "react-icons/io5";
import { Card, CardContent } from "../custom/Card";
import { PageLoader } from "../custom/Spinner";
import { ApolloWrapper } from "../ApolloWrapper";
import { useProductById, useProducts } from "../../hooks/useProducts";
import { useRestaurantById } from "../../hooks/useRestaurants";
import ProductDetailManager from "./ProductDetailManager";

interface Props {
  restaurantId: string;
  productId: string;
}

function ProductDetailPageContent({ restaurantId, productId }: Props) {
  const { product, loading: productLoading } = useProductById(productId);
  const { restaurant, loading: restaurantLoading } =
    useRestaurantById(restaurantId);
  const { products } = useProducts(restaurantId);

  if (productLoading || restaurantLoading) {
    return <PageLoader />;
  }

  if (!product || !restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <a
            href={`/restaurants/${restaurantId}/products`}
            className="mt-4 inline-block text-primary hover:underline"
          >
            Volver al menú
          </a>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(
      (p) =>
        p.restaurantId === restaurantId &&
        p.id !== productId &&
        p.categoryId === product.categoryId,
    )
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <a
        href={`/restaurants/${restaurantId}/products`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <IoArrowBack className="h-4 w-4" />
        Volver al menú
      </a>

      <ProductDetailManager
        product={product}
        restaurantName={restaurant.name}
        restaurantId={restaurantId}
      />

      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            También te puede gustar
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <a
                key={relatedProduct.id}
                href={`/restaurants/${restaurantId}/products/${relatedProduct.id}`}
              >
                <Card padding="none" hoverable className="h-full overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="line-clamp-1 font-medium text-foreground">
                      {relatedProduct.name}
                    </h3>
                    <p className="mt-1 font-semibold text-primary">
                      ${relatedProduct.price}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function ProductDetailPage({ restaurantId, productId }: Props) {
  return (
    <ApolloWrapper>
      <ProductDetailPageContent
        restaurantId={restaurantId}
        productId={productId}
      />
    </ApolloWrapper>
  );
}
