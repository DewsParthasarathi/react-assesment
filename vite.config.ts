import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vite Dev Server API Plugin
 * Serves real HTTP network endpoints for authentication and dashboard data
 * directly backed by src/data/dashboard.json.
 */
function mockApiPlugin(): Plugin {
  return {
    name: "mock-api-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api")) {
          return next();
        }

        const dataFilePath = path.resolve(__dirname, "src/data/dashboard.json");
        const getDashboardData = () => {
          try {
            return JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
          } catch (e) {
            console.error("Error reading dashboard.json:", e);
            return null;
          }
        };

        const parsedUrl = new URL(req.url, "http://127.0.0.1:5173");
        const pathname = parsedUrl.pathname;
        res.setHeader("Content-Type", "application/json");

        // 1. POST /api/auth/login
        if (req.method === "POST" && pathname === "/api/auth/login") {
          let body = "";
          req.on("data", (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const { email, password } = JSON.parse(body || "{}");
              const data = getDashboardData();
              const user = data?.users?.find(
                (u: { email?: string; password?: string }) =>
                  u.email?.toLowerCase() === email?.trim().toLowerCase() &&
                  u.password === password,
              );

              if (user) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password: _, ...safeUser } = user;
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, user: safeUser }));
              } else {
                res.statusCode = 401;
                res.end(
                  JSON.stringify({
                    success: false,
                    error: "Invalid email or password",
                  }),
                );
              }
            } catch {
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  success: false,
                  error: "Malformed request body",
                }),
              );
            }
          });
          return;
        }

        // 2. GET /api/users
        if (req.method === "GET" && pathname === "/api/users") {
          const data = getDashboardData();
          const safeUsers =
            data?.users?.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ password: _, ...u }: { password?: string; [key: string]: unknown }) => u,
            ) || [];
          res.statusCode = 200;
          res.end(JSON.stringify(safeUsers));
          return;
        }

        // 2.5. GET /api/dashboard/crm
        if (req.method === "GET" && pathname === "/api/dashboard/crm") {
          const data = getDashboardData();
          const crmData = data?.crmDashboard
            ? JSON.parse(JSON.stringify(data.crmDashboard))
            : {};
          const year = parsedUrl.searchParams.get("year");
          if (year && crmData.salesAnalytics?.years?.[year]) {
            crmData.salesAnalytics.selectedYear = year;
            crmData.salesAnalytics.matrix = crmData.salesAnalytics.years[year].matrix;
            crmData.salesAnalytics.badge = crmData.salesAnalytics.years[year].badge;
            crmData.salesAnalytics.badgeText = crmData.salesAnalytics.years[year].badgeText;
          } else if (crmData.salesAnalytics?.selectedYear && crmData.salesAnalytics?.years) {
            const defYear = crmData.salesAnalytics.selectedYear;
            if (crmData.salesAnalytics.years[defYear]) {
              crmData.salesAnalytics.matrix = crmData.salesAnalytics.years[defYear].matrix;
              crmData.salesAnalytics.badge = crmData.salesAnalytics.years[defYear].badge;
              crmData.salesAnalytics.badgeText = crmData.salesAnalytics.years[defYear].badgeText;
            }
          }
          res.statusCode = 200;
          res.end(JSON.stringify(crmData));
          return;
        }

        // 2.7. GET /api/dashboard/ecommerce
        if (req.method === "GET" && pathname === "/api/dashboard/ecommerce") {
          const data = getDashboardData();
          const ecommerceData = data?.ecommerceDashboard
            ? JSON.parse(JSON.stringify(data.ecommerceDashboard))
            : {};
          const year = parsedUrl.searchParams.get("year");
          if (year && ecommerceData.years?.[year]) {
            ecommerceData.selectedYear = year;
            Object.assign(ecommerceData, ecommerceData.years[year]);
          } else if (ecommerceData.selectedYear && ecommerceData.years?.[ecommerceData.selectedYear]) {
            Object.assign(ecommerceData, ecommerceData.years[ecommerceData.selectedYear]);
          }
          res.statusCode = 200;
          res.end(JSON.stringify(ecommerceData));
          return;
        }

        // 3. GET /api/dashboard/:userId
        const dashboardMatch = pathname.match(/^\/api\/dashboard\/([^/]+)$/);
        if (req.method === "GET" && dashboardMatch) {
          const userId = dashboardMatch[1];
          const data = getDashboardData();
          const profile = data?.profiles?.find(
            (p: { userId?: string; id?: string }) =>
              p.userId === userId || p.id === userId,
          );

          if (profile) {
            res.statusCode = 200;
            res.end(JSON.stringify(profile));
          } else {
            // Fallback to first profile if exists
            const fallback = data?.profiles?.[0];
            if (fallback) {
              res.statusCode = 200;
              res.end(JSON.stringify(fallback));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "User profile not found" }));
            }
          }
          return;
        }

        // 4. GET /api/dashboard
        if (req.method === "GET" && pathname === "/api/dashboard") {
          const data = getDashboardData();
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              navigation: data?.navigation,
              orderStatistics: data?.orderStatistics,
              incomeChart: data?.incomeChart,
              browserStatistics: data?.browserStatistics,
            }),
          );
          return;
        }

        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Endpoint not found" }));
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), mockApiPlugin()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    cors: true,
  },
});
