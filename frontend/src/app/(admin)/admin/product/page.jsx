import ActionDropdown from "@/components/admin/ActionDropdown";
import { fetchProduct } from "@/utils/api";
import TableHeader from "@/components/admin/TableHeader";
import TableFilter from "@/components/admin/TableFilter";
import StatusBtn from "@/components/admin/StatusBtn";
import ProductStatus from "@/components/admin/ProductStatus";
import ProductDetailsModal from "@/components/admin/ProductDetailsModal";

export default async function Page() {
  const products = await fetchProduct();

  if (products?.success === false) {
    throw new Error(products?.message || "failed to fetch products");
  }

  const productCount = products?.data?.length || 0;

  return (
    <div className="min-h-screen p-2 lg:p-6 bg-gray-50">
      <TableHeader title="products" path="/admin/product/add" />
      
      {/* Product Count */}
      <div className="mb-4 px-2">
        <p className="text-sm font-medium text-gray-600">Total Products: {productCount}</p>
      </div>

      <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <TableFilter />

        {/* TABLE HEADER */}
        <div className="hidden grid-cols-12 border-b border-gray-100 bg-gray-50 px-4 py-3 lg:grid items-center">
          <div className="col-span-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Thumb</div>
          <div className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Name</div>
          <div className="col-span-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</div>
          <div className="col-span-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Price Details</div>
          <div className="col-span-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Status & Flags</div>
          <div className="col-span-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">Action</div>
        </div>

        {/* TABLE BODY */}
        <div>
          {products?.data?.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">No product Found</h2>
                <p className="mt-2 text-sm text-gray-500">There are no product available right now</p>
              </div>
            </div>
          ) : (
            products?.data?.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-1 gap-4 border-b border-gray-100 px-4 py-4 transition-all duration-300 hover:bg-gray-50/60 lg:grid-cols-12 lg:items-center"
              >
                {/* Thumbnail */}
                <div className="hidden lg:flex lg:col-span-1">
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-gray-100 border flex items-center justify-center">
                    {item.thumbnail ? <img src={item.thumbnail} className="object-cover" alt="img" /> : null}
                  </div>
                </div>

                {/* Name */}
                <div className="lg:col-span-3">
                  <h2 className="text-sm font-bold text-gray-900">{item.name}</h2>
                </div>

                {/* Category */}
                <div className="lg:col-span-1">
                  <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                    {item?.categoryId?.name}
                  </span>
                </div>

                {/* Price */}
                <div className="lg:col-span-2 text-[11px] font-medium text-gray-600">
                  <p>Sale: {item?.salePrice}</p>
                  <p className="line-through text-gray-400">Org: {item?.originalPrice}</p>
                </div>

                {/* Status & Flags */}
                <div className="lg:col-span-3 flex flex-wrap gap-2">
                  <StatusBtn status={item.status} path={`product/status-update/${item._id}`} />
                  <ProductStatus status={item.bestSeller} flag="bestSeller" id={item._id} />
                  <ProductStatus status={item.stock} flag="stock" id={item._id} />
                  <ProductStatus status={item.newArrival} flag="newArrival" id={item._id} />
                  <ProductStatus status={item.featured} flag="featured" id={item._id} />
                </div>

                {/* Action */}
                <div className="flex justify-start lg:justify-end lg:col-span-2">
                 <ActionDropdown module="product" id={item._id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ProductDetailsModal />
    </div>
  );
}