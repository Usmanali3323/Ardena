"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Review } from "@/components/review";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

function Page() {
  const { id } = useParams();

  return (
    <div className="py-16 px-4 md:px-8 max-w-5xl mx-auto w-full font-font1 text-textColor">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Product Reviews
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Read what other customers are saying about this product
        </p>
      </div>

      {/* Summary Section */}
      <Card className="mb-10 shadow-md rounded-2xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
          {/* Average Rating */}
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <h2 className="text-4xl font-bold flex items-center gap-1">
              4.3 <Star className="text-yellow-400 w-8 h-8" />
            </h2>
            <p className="text-gray-500 text-sm">Average Rating</p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 w-full md:ml-6">
            {[
              { stars: 5, percent: "65%" },
              { stars: 4, percent: "20%" },
              { stars: 3, percent: "10%" },
              { stars: 2, percent: "3%" },
              { stars: 1, percent: "2%" },
            ].map((item) => (
              <div key={item.stars} className="flex items-center mb-2">
                <span className="w-12 text-sm">{item.stars}★</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-yellow-400 h-2.5 rounded-full"
                    style={{ width: item.percent }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{item.percent}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <Review productId={id} allReview={true} />
      </div>
      
    </div>
  );
}

export default Page;
