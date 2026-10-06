import Link from 'next/link';
import React from 'react';

export default function CategorySection({ categories }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pb-2">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-6">
        {categories.map((cat) => (
          <Link href={`/store?category=${cat.slug}`} key={cat._id}>
            <div

              className="group flex flex-col items-center text-center cursor-pointer"
            >
              {/* Image */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-100 overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <h4 className="mt-3 text-sm md:text-base font-semibold text-gray-800 line-clamp-1">
                {cat.name}
              </h4>

              {/* Product Count */}
              <p className="text-xs text-gray-500 mt-1">
                {cat.productCount} {cat.productCount === 1 ? "Product" : "Products"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}