"use client";

import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useState } from "react";

type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  avatar?: string;
  avatarColor?: string;
};

const googleReviews: Review[] = [
  {
    id: "1",
    author: "Aysha Ashai",
    rating: 5,
    date: "9 months ago",
    text: "I truly believe that investing time in professional development is one of the most valuable things you can do for your career. It's boosted my confidence in decision-making, helped me approach challenges with greater clarity, and kept me motivated to contribute my best to my team and organization.",
    avatar: "",
    avatarColor: "bg-blue-500"
  },
  {
    id: "2",
    author: "Yolanda",
    rating: 5,
    date: "9 month ago",
    text: `Investing in professional development has truly been a game-changer for me. 
      It's not just about gaining new skills — it's also helped me think more strategically, 
      communicate more effectively, and approach challenges with greater resilience. 
      I feel more empowered in my role and better equipped to support my team and contribute 
      meaningfully to the organization's goals.`,
    avatar: "",
    avatarColor: "bg-purple-500"
  },
  {
    id: "3",
    author: "Adnan Bin Zahoor",
    rating: 5,
    date: "6 months ago",
    text: `We engaged RTO Specialist to support us in developing high-quality training and assessment resources, 
      and the outcome exceeded our expectations. Their deep understanding of the VET sector meant they could 
      design and align materials that perfectly matched unit requirements, industry standards, and compliance 
      obligations. Every resource was clear, structured, and easy for both trainers and learners to use. 
      The entire process was professional, efficient, and saved our team considerable time. We highly recommend 
      their resource development services to any RTO seeking reliable, compliant, and industry-relevant training materials.`,
    avatar: "",
    avatarColor: "bg-green-500"
  },
    {
    id: "4",
    author: "Muskaan Basharat",
    rating: 5,
    date: "9 months ago",
    text: `Investing in professional development has been a transformative experience. 
      Beyond acquiring new skills, it's expanded my ability to think strategically, 
      communicate with greater clarity, and navigate challenges with resilience. 
      I feel more confident and empowered in my role, better prepared to support my team, 
      and more aligned with driving meaningful impact toward our organizational goals.`,
    avatar: "",
    avatarColor: "bg-pink-500"
  },
    {
    id: "5",
    author: "Tanzila Misger",
    rating: 5,
    date: "10 months ago",
    text: "I genuinely believe that taking time for professional development is one of the best things you can do for your career. It's helped me feel more confident when making decisions, handle challenges with a clearer mindset, and stay motivated to do my best for my team and the organization.",
    avatar: "",
    avatarColor: "bg-orange-500"
  },
    {
    id: "6",
    author: "Paramjeet Kaur",
    rating: 5,
    date: "10 months ago",
    text: `I am so happy to give 5 stars here!!! Quality of the learning resources is Awesome 
      like they are well- written, comprehensive, and up to date. Resources are also easily accessible!! 
      Quizzes are also very easy and user-friendly. Overall helped me a lot in my professional Development!! 
      Highly Recommended!!`,
    avatar: "",
    avatarColor: "bg-teal-500"
  },
  {
    id: "7",
    author: "Tru Zha",
    rating: 5,
    date: "9 months ago",
    text: "They provided outstanding assistance with RTO compliance and training materials. Their expertise in CRICOS registration was invaluable—smooth, efficient, and error-free. Highly recommend their services for anyone in the VET sector!",
    avatar: "",
    avatarColor: "bg-indigo-500"
  },
    {
    id: "8",
    author: "Fiba Badagshie",
    rating: 5,
    date: "9 months ago",
    text: "Engaging in professional growth opportunities has been truly beneficial. I've been able to learn from fellow professionals in the field.",
    avatar: "",
    avatarColor: "bg-red-500"
  },
  {
    id: "9",
    author: "Sana Zamir",
    rating: 5,
    date: "10 months ago",
    text: "Taking part in professional development has been a valuable experience. It helped me to learn from others in this field",
    avatar: "",
    avatarColor: "bg-cyan-500"
  },
  {
    id: "10",
    author: "Lalit Lamsal (Anzit)",
    rating: 5,
    date: "9 months ago",
    text: "Glad I picked these guys in my path to career development. 100% worth it.",
    avatar: "",
    avatarColor: "bg-amber-500"
  },
  {
    id: "11",
    author: "sheikh Insha",
    rating: 5,
    date: "Edited a week ago",
    text: `We've used their training materials and the difference compared to other providers is noticeable straight away. 
      The quality is not just in the content, but in the structure. These are not just documents, they are clearly 
      built as part of a system designed to be practical, consistent, and defensible in an audit context. 
      You can tell the resources are developed with input from instructional designers, industry experts, and RTOs, 
      which ensures alignment with current standards and real-world application. Another major advantage is usability. 
      The materials are well organised, clearly mapped, and ready to implement without needing to rebuild everything 
      from scratch, which saves a significant amount of time and reduces compliance risk. Highly recommended for any RTOs.`,
    avatar: "",
    avatarColor: "bg-lime-500"
  },
  {
    id: "12",
    author: "Lone Faisal",
    rating: 5,
    date: "a months ago",
    text: `I have used a few different providers over the years and usually end up reworking most of the content anyway. 
      With RTO Specialist, that wasn't really the case. The mapping and structure are already there, which makes 
      audit prep a lot less stressful. You still need to contextualise properly, obviously, but is very easy to do 
      with their resources.`,
    avatar: "",
    avatarColor: "bg-rose-500"
  },
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(googleReviews.length / reviewsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleReviews = googleReviews.slice(
    currentIndex * reviewsPerPage,
    currentIndex * reviewsPerPage + reviewsPerPage
  );

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  return (
      <div className="home-reviews bg-gradient-to-b from-blue-50 via-blue-100 to-white py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.h1
          className="mb-8 text-center text-2xl font-extrabold text-slate-950 dark:text-white sm:text-4xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
        >
          Google Reviews
        </motion.h1>

        <div className="relative">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 sm:-translate-x-12"
            aria-label="Previous reviews"
          >
            <ArrowBackIosNewRoundedIcon className="!text-xl text-blue-600 dark:text-blue-400" />
          </button>

          {/* Reviews Slider */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col rounded-2xl border border-blue-200 bg-white p-6 shadow-lg transition hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold text-lg ${review.avatarColor || "bg-blue-500"}`}>
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {review.author}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {review.date}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`!text-lg ${
                          i < review.rating
                            ? "!text-yellow-400"
                            : "!text-slate-300 dark:!text-slate-600"
                        }`}
                      />
                    ))}
                  </div>

                  <div>
                    <p className={`text-sm leading-relaxed text-slate-700 dark:text-slate-300 flex-grow text-justify ${
                      !expandedReviews.has(review.id) && review.text.length > 200 ? "line-clamp-3" : ""
                    }`}>
                      {review.text}
                    </p>
                    {review.text.length > 200 && (
                      <button
                        onClick={() => toggleExpand(review.id)}
                        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {expandedReviews.has(review.id) ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 rounded-full bg-white p-3 shadow-lg transition hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 sm:translate-x-12"
            aria-label="Next reviews"
          >
            <ArrowForwardIosRoundedIcon className="!text-xl text-blue-600 dark:text-blue-400" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-blue-600 dark:bg-blue-400"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500"
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

          <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <a
            href="https://www.google.com/maps/place/RTO+Specialist/@-30.3874784,114.6980842,4z/data=!4m8!3m7!1s0x4aa682330838acdf:0xae3cfaed3062d5a3!8m2!3d-32.205415!4d136.1073692!9m1!1b1!16s%2Fg%2F11xftlc_bk?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View All Reviews on Google
          </a>
        </motion.div>
        </div>
      </div>
  );
};

export default Reviews;
