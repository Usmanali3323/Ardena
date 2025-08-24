"use client";

export default function ReturnsPage() {
  return (
    <section className="mt-5 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-400 bg-clip-text text-transparent">
            Return & Exchange Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            At Ardena, your satisfaction is our priority. If you're not completely happy with your purchase, we’re here to help.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Eligibility */}
          <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4">🛍️ Eligibility for Returns</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Items can be returned or exchanged within{" "}
              <span className="font-semibold">14 days</span> of delivery,
              provided they are unused, unwashed, and in their original packaging with all tags attached.
            </p>
          </div>

          {/* Process */}
          <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4">📧 How to Request a Return</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              To initiate a return or exchange, simply email us at{" "}
              <a
                href="mailto:support@ardena.com"
                className="text-pink-500 font-semibold hover:underline"
              >
                support@ardena.com
              </a>{" "}
              with your <span className="font-semibold">Order ID</span> or{" "}
              <span className="font-semibold">Product ID</span>.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our support team will guide you through the next steps and provide you with a return label if applicable.
            </p>
          </div>

          {/* Refunds */}
          <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4">💳 Refunds</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Refunds will be processed within{" "}
              <span className="font-semibold">7-10 business days</span> after we
              receive your returned item. The refund will be issued to your original payment method.
            </p>
          </div>

          {/* Exceptions */}
          <div className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4">⚠️ Exceptions</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Please note that{" "}
              <span className="font-semibold">
                sale items, personalized products, and gift cards
              </span>{" "}
              are non-returnable and non-refundable.
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our customer support team is here to assist you with any issues.
          </p>
          <a
            href="mailto:support@ardena.com"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            Email Support
          </a>
        </div>
      </div>
    </section>
  );
}
