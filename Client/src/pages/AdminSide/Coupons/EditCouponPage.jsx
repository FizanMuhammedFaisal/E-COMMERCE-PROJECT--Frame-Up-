import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../../services/api/apiClient";
import Spinner from "../../../components/common/Animations/Spinner";

export default function CouponEdit() {
  const { couponId } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCoupon = async () => {
    const res = await apiClient.get(`/api/admin/coupons/${couponId}`);
    return res.data.coupon;
  };

  const { data, isLoading, isError } = useQuery({
    queryFn: fetchCoupon,
    queryKey: ["coupon", couponId],
  });

  useEffect(() => {
    if (data) {
      setCoupon(data);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoupon((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !coupon ||
      !coupon.code ||
      !coupon.discountType ||
      !coupon.discountValue ||
      !coupon.expirationDate
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setError("");
      await apiClient.put(`/api/admin/coupons/update/${couponId}`, coupon);

      toast.success("Coupon Updated");
      setCoupon(null);
      navigate("/dashboard/coupons");
    } catch (err) {
      console.error("Failed to update coupon:", err);
      if (err.response && err.response.data.errors) {
        const errorMessages = err.response.data.errors
          .map((error) => error.msg)
          .join(", ");
        setError(errorMessages);
      } else if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner center={true} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">Failed to load coupon</div>
    );
  }

  return (
    <div className="p-8 rounded-lg w-full lg:max-w-full font-primary mx-auto md:px-20 mt-10">
      <h1 className="text-4xl font-primary font-bold mb-6 text-start">
        Edit Coupon
      </h1>

      {error && (
        <div className="dark:bg-customP2BackgroundD bg-red-100 dark:border-customP2ForegroundD_600 border bg-customP2ForeGroundW_500 py-2 mb-4 rounded-lg">
          <p className="text-red-900 dark:text-red-500 ms-4 text-start">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label
            htmlFor="code"
            className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200"
          >
            Coupon Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={coupon?.code || ""}
            onChange={handleInputChange}
            placeholder="Enter coupon code"
            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="discountType"
            className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200"
          >
            Discount Type:
          </label>
          <select
            id="discountType"
            name="discountType"
            value={coupon?.discountType || ""}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50"
          >
            <option value="">Select type</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

        <div className="form-group">
          <label
            htmlFor="discountValue"
            className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200"
          >
            Discount Value:
          </label>
          <input
            type="number"
            id="discountValue"
            name="discountValue"
            value={coupon?.discountValue || ""}
            onChange={handleInputChange}
            placeholder="Enter discount value"
            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="expirationDate"
            className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200"
          >
            Expiration Date:
          </label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={
              coupon?.expirationDate ? coupon.expirationDate.split("T")[0] : ""
            }
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="description"
            className="block text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={coupon?.description || ""}
            onChange={handleInputChange}
            placeholder="Enter coupon description"
            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-customP2Primary focus:border-customP2Primary dark:border-customP2ForegroundD_400 dark:bg-customP2BackgroundD_darkest sm:text-sm dark:text-slate-50"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-customP2BackgroundD_800 hover:bg-customP2BackgroundD_500 text-white px-4 py-2 rounded-md transition"
          >
            Update Coupon
          </button>
        </div>
      </form>
    </div>
  );
}
