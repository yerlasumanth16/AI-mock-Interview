import React from "react";
import { Users, MessageSquare, ThumbsUp, Share2, Search, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface CommunityProps {
  onBack: () => void;
}

export const Community: React.FC<CommunityProps> = ({ onBack }) => {
  const posts = [
    {
      id: 1,
      author: "Sarah Chen",
      role: "Frontend Engineer",
      company: "Google",
      content: "Just passed my Google onsite! The system design round was tough, but focusing on scalability and trade-offs really helped. Happy to answer any questions.",
      likes: 124,
      comments: 32,
      time: "2 hours ago",
      tags: ["Interview Experience", "System Design", "Google"]
    },
    {
      id: 2,
      author: "Michael Rodriguez",
      role: "Backend Developer",
      company: "Amazon",
      content: "What's the best way to prepare for Amazon's Leadership Principles? I have my loop coming up next week.",
      likes: 45,
      comments: 18,
      time: "5 hours ago",
      tags: ["Amazon", "Leadership Principles", "Advice"]
    },
    {
      id: 3,
      author: "Emily Taylor",
      role: "Full Stack Engineer",
      company: "Meta",
      content: "I created a comprehensive list of the top 50 LeetCode patterns you need to know for Meta interviews. Link below!",
      likes: 389,
      comments: 56,
      time: "1 day ago",
      tags: ["LeetCode", "Meta", "Resources"]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Community</h2>
          <p className="text-gray-500 mt-2">Connect with other candidates, share experiences, and get advice.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search posts, tags, or companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.role} @ {post.company} • {post.time}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-6 text-gray-500 pt-4 border-t border-gray-50">
                  <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {["#SystemDesign", "#GoogleInterviews", "#LeetCode", "#Behavioral", "#SalaryNegotiation"].map((topic, i) => (
                <div key={topic} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-gray-600 group-hover:text-indigo-600 transition-colors">{topic}</span>
                  <span className="text-xs text-gray-400">{Math.floor(Math.random() * 500) + 100} posts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-3xl text-white shadow-md">
            <h3 className="font-semibold text-lg mb-2">Join a Study Group</h3>
            <p className="text-indigo-100 text-sm mb-4">Connect with peers preparing for the same roles and companies.</p>
            <button className="w-full bg-white text-indigo-600 py-2 rounded-xl font-medium hover:bg-indigo-50 transition-colors">
              Find Groups
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
