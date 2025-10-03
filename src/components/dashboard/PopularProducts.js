import React, { useEffect, useState } from "react";
import api from "../../constants/api";

function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortByQty, setSortByQty] = useState(null);

  useEffect(() => {
    api
      .get("/product/PopularProducts")
      .then((res) => {
        console.log("API response:", res.data);
        const result = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setProducts(result);
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // 🔍 Filter + sort
  const filteredProducts = products
    .filter(
      (p) =>
        p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.department_name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortByQty) return 0;
      return sortByQty === "asc"
        ? a.sold_qty - b.sold_qty
        : b.sold_qty - a.sold_qty;
    })
    .slice(0, rowsPerPage);

  return (
    <div className="p-4 bg-white shadow rounded w-full max-w-5xl mx-auto">
     

      {/* Controls */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[10, 25, 50, 100, 200].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-1 flex-1 min-w-[150px]"
        />

        <button
          type="button"
          onClick={() => setSortByQty(sortByQty === "asc" ? "desc" : "asc")}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          {sortByQty === "asc"
            ? "QTY ↑"
            : sortByQty === "desc"
            ? "QTY ↓"
            : "QTY"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto h-[300px] overflow-y-auto border rounded">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border text-right">Sold Qty</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.product_id} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{p.department_name}</td>
                  <td className="p-2 border">{p.category_name}</td>
                  <td className="p-2 border">{p.product_name}</td>
                  <td className="p-2 border text-right">{p.sold_qty}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PopularProducts;
