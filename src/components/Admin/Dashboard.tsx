import { useState, useEffect } from "react";
import {
  Database,
  FileText,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import DocumentList from "./DocumentList";
import { getVectorStats } from "../../services/api";
import type { VectorStats } from "../../types";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<VectorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVectorStats();
      setStats(data);
    } catch (err) {
      setError("Failed to fetch statistics");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchStats();
  };

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    description?: string;
  }> = ({ title, value, icon, color, description }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`w-8 h-8 ${color} rounded-md flex items-center justify-center`}
            >
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {typeof value === "number" ? value.toLocaleString() : value}
              </dd>
              {description && (
                <dd className="text-sm text-gray-500">{description}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage documents and monitor system statistics
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="animate-pulse">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                    <div className="ml-5 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-800">{error}</span>
                <button
                  onClick={fetchStats}
                  className="ml-auto text-red-600 hover:text-red-500 font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : stats ? (
          <>
            <StatCard
              title="Total Documents"
              value={stats.database.total_documents}
              icon={<FileText className="w-5 h-5 text-white" />}
              color="bg-blue-500"
              description="Documents in database"
            />

            <StatCard
              title="Processed Documents"
              value={stats.database.processed_documents}
              icon={<CheckCircle className="w-5 h-5 text-white" />}
              color="bg-green-500"
              description="Ready for queries"
            />

            <StatCard
              title="Processing Queue"
              value={stats.database.unprocessed_documents}
              icon={<Clock className="w-5 h-5 text-white" />}
              color="bg-yellow-500"
              description="Waiting to be processed"
            />

            <StatCard
              title="Vector Chunks"
              value={stats.vector_database.total_chunks}
              icon={<Database className="w-5 h-5 text-white" />}
              color="bg-purple-500"
              description="Searchable text chunks"
            />
          </>
        ) : null}
      </div>

      {/* Processing Status */}
      {stats && (
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Processing Status
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.database.total_documents > 0
                    ? Math.round(
                        (stats.database.processed_documents /
                          stats.database.total_documents) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-500">Processing Rate</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.vector_database.total_chunks}
                </div>
                <div className="text-sm text-gray-500">Available Chunks</div>
              </div>

              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    stats.database.unprocessed_documents === 0
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {stats.database.unprocessed_documents === 0
                    ? "Idle"
                    : "Active"}
                </div>
                <div className="text-sm text-gray-500">Queue Status</div>
              </div>
            </div>

            {/* Progress Bar */}
            {stats.database.total_documents > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Document Processing Progress</span>
                  <span>
                    {stats.database.processed_documents} /{" "}
                    {stats.database.total_documents}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (stats.database.processed_documents /
                          stats.database.total_documents) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="bg-white shadow rounded-lg p-6">
        <DocumentList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default Dashboard;
