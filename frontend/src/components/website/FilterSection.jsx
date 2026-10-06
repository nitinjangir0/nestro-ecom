'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FilterSection({ title, data, queryKey }) {

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleFilter = (slug) => {

        const params = new URLSearchParams(searchParams.toString());
        const selectedValues = params.get(queryKey)
            ? params.get(queryKey).split(',')
            : [];

        if (selectedValues.includes(slug)) {

            const updatedValues = selectedValues.filter(item => item !== slug);

            if (updatedValues.length > 0) {
                params.set(queryKey, updatedValues.join(','));
            } else {
                params.delete(queryKey);
            }

        } else {

            selectedValues.push(slug);
            params.set(queryKey, selectedValues.join(','));
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="border-b border-gray-200 pb-8">
            <h3 className="mb-5 text-xl font-semibold">
                {title}
            </h3>

            <div className="space-y-4">
                {
                    data.map((item) => {
                        const checked = searchParams
                            .get(queryKey)
                            ?.split(',')
                            .includes(item.slug) ?? false;
                        return (
                            <label
                                key={item._id}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                <div className="flex items-center gap-3">

                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleFilter(item.slug)}
                                        className="h-5 w-5 accent-amber-700"
                                    />

                                    {/* User ko name dikhana hai */}
                                    <span>{item.name}</span>

                                </div>

                                {item.count && (
                                    <span>{item.count}</span>
                                )}
                            </label>
                        )
                    })
                }
            </div>
        </div>
    )
}