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
      // Unwatch data directory and dashboard.json to prevent Vite from reloading on API data mutations
      server.watcher.unwatch(path.resolve(__dirname, "src/data/**"));
      server.watcher.unwatch(path.resolve(__dirname, "src/data/dashboard.json"));

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

        const saveDashboardData = (newData: unknown) => {
          try {
            fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), "utf-8");
          } catch (e) {
            console.error("Error saving dashboard.json:", e);
          }
        };

        const readJsonBody = async (): Promise<Record<string, unknown>> => {
          return new Promise((resolve) => {
            let body = "";
            req.on("data", (chunk: Buffer) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                resolve(JSON.parse(body || "{}"));
              } catch {
                resolve({});
              }
            });
          });
        };

        // 5. EMAIL ENDPOINTS
        // 5.1. GET /api/emails
        if (req.method === "GET" && pathname === "/api/emails") {
          const data = getDashboardData();
          let emails = (data?.emails || []) as Array<Record<string, unknown>>;

          const folder = parsedUrl.searchParams.get("folder");
          const search = parsedUrl.searchParams.get("search")?.toLowerCase().trim();
          const label = parsedUrl.searchParams.get("label")?.toLowerCase().trim();

          const allEmails = [...emails];
          const counts = {
            inbox: allEmails.filter((e) => e.folder === "inbox" && !e.isRead).length,
            sent: allEmails.filter((e) => e.folder === "sent").length,
            draft: allEmails.filter((e) => e.folder === "draft").length,
            starred: allEmails.filter((e) => e.isStarred && e.folder !== "trash").length,
            spam: allEmails.filter((e) => e.folder === "spam").length,
            trash: allEmails.filter((e) => e.folder === "trash").length,
          };

          if (folder) {
            if (folder === "starred") {
              emails = emails.filter((e) => e.isStarred && e.folder !== "trash");
            } else {
              emails = emails.filter((e) => e.folder === folder);
            }
          }

          if (label) {
            emails = emails.filter((e) => {
              const labels = (e.labels as string[]) || [];
              return labels.map((l) => l.toLowerCase()).includes(label);
            });
          }

          if (search) {
            emails = emails.filter((e) => {
              const fromName = ((e.from as Record<string, string>)?.name || "").toLowerCase();
              const fromEmail = ((e.from as Record<string, string>)?.email || "").toLowerCase();
              const to = (typeof e.to === "string" ? e.to : "").toLowerCase();
              const subject = (typeof e.subject === "string" ? e.subject : "").toLowerCase();
              const message = (typeof e.message === "string" ? e.message : "").toLowerCase();
              const snippet = (typeof e.snippet === "string" ? e.snippet : "").toLowerCase();
              return (
                fromName.includes(search) ||
                fromEmail.includes(search) ||
                to.includes(search) ||
                subject.includes(search) ||
                message.includes(search) ||
                snippet.includes(search)
              );
            });
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ emails, counts }));
          return;
        }

        // 5.2. POST /api/emails/batch-update
        if (req.method === "POST" && pathname === "/api/emails/batch-update") {
          readJsonBody().then((body) => {
            const data = getDashboardData();
            const ids = (body.ids as string[]) || [];
            const updates = (body.updates as Record<string, unknown>) || {};
            const emails = (data?.emails || []) as Array<Record<string, unknown>>;

            emails.forEach((e) => {
              if (ids.includes(e.id as string)) {
                // If moving to trash, remember original folder
                if (updates.folder === "trash" && e.folder !== "trash") {
                  e.originalFolder = e.folder;
                }
                // If restoring from trash, restore original folder or inbox
                if (updates.folder === "restore" || (updates.folder && updates.folder !== "trash" && e.folder === "trash")) {
                  e.folder = updates.folder === "restore" ? (e.originalFolder || "inbox") : updates.folder;
                  delete e.originalFolder;
                } else {
                  Object.assign(e, updates);
                }
              }
            });

            saveDashboardData(data);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          });
          return;
        }

        // 5.3. POST /api/emails/batch-delete
        if (req.method === "POST" && pathname === "/api/emails/batch-delete") {
          readJsonBody().then((body) => {
            const data = getDashboardData();
            const ids = (body.ids as string[]) || [];
            if (data?.emails) {
              data.emails = (data.emails as Array<Record<string, unknown>>).filter(
                (e) => !ids.includes(e.id as string),
              );
              saveDashboardData(data);
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          });
          return;
        }

        // 5.4. POST /api/emails/empty-trash
        if (req.method === "POST" && pathname === "/api/emails/empty-trash") {
          const data = getDashboardData();
          if (data?.emails) {
            data.emails = (data.emails as Array<Record<string, unknown>>).filter(
              (e) => e.folder !== "trash",
            );
            saveDashboardData(data);
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 5.5. GET /api/emails/:id
        const emailDetailMatch = pathname.match(/^\/api\/emails\/([^/]+)$/);
        if (req.method === "GET" && emailDetailMatch) {
          const emailId = emailDetailMatch[1];
          const data = getDashboardData();
          const email = (data?.emails || []).find((e: { id: string }) => e.id === emailId);
          if (email) {
            res.statusCode = 200;
            res.end(JSON.stringify(email));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Email not found" }));
          }
          return;
        }

        // 5.6. POST /api/emails (Compose / Draft)
        if (req.method === "POST" && pathname === "/api/emails") {
          readJsonBody().then((body) => {
            const data = getDashboardData();
            const emails = (data?.emails || []) as Array<Record<string, unknown>>;
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            const newEmail = {
              id: "email-" + Date.now(),
              from: {
                name: "Katie Seller",
                email: "katie.seller@salesflow.com",
                avatar: "member1.jpg",
              },
              to: body.to || "",
              cc: body.cc || "",
              bcc: body.bcc || "",
              subject: body.subject || "(No Subject)",
              snippet: (typeof body.message === "string" ? body.message.slice(0, 75) : ""),
              message: body.message || "",
              timestamp: timeStr,
              date: now.toISOString(),
              folder: body.isDraft ? "draft" : "sent",
              isRead: true,
              isStarred: false,
              labels: ["company"],
            };

            emails.unshift(newEmail);
            data.emails = emails;
            saveDashboardData(data);

            res.statusCode = 201;
            res.end(JSON.stringify(newEmail));
          });
          return;
        }

        // 5.7. PATCH /api/emails/:id
        if (req.method === "PATCH" && emailDetailMatch) {
          const emailId = emailDetailMatch[1];
          readJsonBody().then((updates) => {
            const data = getDashboardData();
            const emails = (data?.emails || []) as Array<Record<string, unknown>>;
            const email = emails.find((e) => e.id === emailId);

            if (email) {
              if (updates.folder === "trash" && email.folder !== "trash") {
                email.originalFolder = email.folder;
              }
              if (updates.folder === "restore") {
                email.folder = email.originalFolder || "inbox";
                delete email.originalFolder;
              } else {
                Object.assign(email, updates);
              }
              saveDashboardData(data);
              res.statusCode = 200;
              res.end(JSON.stringify(email));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "Email not found" }));
            }
          });
          return;
        }

        // 5.8. DELETE /api/emails/:id
        if (req.method === "DELETE" && emailDetailMatch) {
          const emailId = emailDetailMatch[1];
          const data = getDashboardData();
          if (data?.emails) {
            data.emails = (data.emails as Array<Record<string, unknown>>).filter(
              (e) => e.id !== emailId,
            );
            saveDashboardData(data);
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 6. CHAT & GEMINI AI ENDPOINTS
        // 6.1. GET /api/chat/contacts
        if (req.method === "GET" && pathname === "/api/chat/contacts") {
          const data = getDashboardData();
          const users = (data?.users || []) as Array<{ id: string; name: string; role: string; email: string; avatar: string }>;
          const conversations = (data?.chatConversations || {}) as Record<string, Array<{ id: string; senderId: string; text: string; timestamp: string }>>;

          // Contacts from existing users (excluding logged-in user id "1")
          const userContacts = users
            .filter((u) => u.id !== "1")
            .map((u) => {
              const msgs = conversations[u.id] || [];
              const lastMsg = msgs[msgs.length - 1];
              return {
                id: u.id,
                name: u.name,
                role: u.role || "Team Member",
                email: u.email,
                avatar: u.avatar || "member2",
                isOnline: true,
                isAi: false,
                lastMessage: lastMsg?.text || "No messages yet",
                lastMessageTime: lastMsg?.timestamp || "",
              };
            });

          res.statusCode = 200;
          res.end(JSON.stringify({ contacts: userContacts }));
          return;
        }

        // 6.2. GET /api/chat/conversations/:contactId
        const chatConvMatch = pathname.match(/^\/api\/chat\/conversations\/([^/]+)$/);
        if (req.method === "GET" && chatConvMatch) {
          const contactId = chatConvMatch[1];
          const data = getDashboardData();
          const conversations = (data?.chatConversations || {}) as Record<string, unknown[]>;
          const messages = conversations[contactId] || [];
          res.statusCode = 200;
          res.end(JSON.stringify({ messages }));
          return;
        }

        // 6.3. POST /api/chat/messages
        if (req.method === "POST" && pathname === "/api/chat/messages") {
          readJsonBody().then((body) => {
            const data = getDashboardData();
            const contactId = (body.contactId as string) || "";
            const text = (body.text as string) || "";
            const senderId = (body.senderId as string) || "user";

            if (!contactId || !text) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "contactId and text are required" }));
              return;
            }

            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const userMsg = {
              id: "msg-" + Date.now(),
              senderId,
              text,
              timestamp: timeStr,
              createdAt: now.toISOString(),
            };

            if (!data.chatConversations) data.chatConversations = {};
            if (!data.chatConversations[contactId]) data.chatConversations[contactId] = [];
            data.chatConversations[contactId].push(userMsg);
            saveDashboardData(data);

            res.statusCode = 201;
            res.end(JSON.stringify({ message: userMsg }));
          });
          return;
        }

        // 6.4. POST /api/chat/gemini (Secure Server-Side Gemini AI Proxy)
        if (req.method === "POST" && pathname === "/api/chat/gemini") {
          readJsonBody().then(async (body) => {
            // Read GEMINI_API_KEY from environment or .env file securely
            let apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              try {
                const envContent = fs.readFileSync(path.resolve(__dirname, ".env"), "utf-8");
                const match = envContent.match(/GEMINI_API_KEY=([^\r\n]+)/);
                if (match) apiKey = match[1].trim();
              } catch {
                // Ignore missing .env
              }
            }

            if (!apiKey) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Server Gemini API key is not configured." }));
              return;
            }

            const rawMessages = (body.messages as Array<{ senderId: string; text: string }>) || [];
            const targetContactId = (body.contactId as string) || "2";
            const contactName = (body.contactName as string) || "team member";
            const contactRole = (body.contactRole as string) || "colleague";

            // Map conversation history into Gemini format
            const contents = rawMessages.map((m) => ({
              role: m.senderId === "user" ? "user" : "model",
              parts: [{ text: m.text }],
            }));

            // Fallback content if empty
            if (contents.length === 0) {
              contents.push({ role: "user", parts: [{ text: (body.text as string) || "Hello" }] });
            }

            try {
              const requestPayload = {
                system_instruction: {
                  parts: [
                    {
                      text: `You are ${contactName}, ${contactRole} at SalesFlow. You are having an ongoing internal chat with your colleague/sales manager John Doe. Reply in character as ${contactName} in a natural, friendly, professional workplace tone. Keep your responses concise (1-3 sentences) and relevant to your role, the conversation context, and dashboard/sales operations. Do not introduce yourself; just speak naturally as colleagues in a chat.`,
                    },
                  ],
                },
                contents,
              };

              const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
              const apiRes = await fetch(geminiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestPayload),
              });

              if (!apiRes.ok) {
                const errText = await apiRes.text();
                console.error("Gemini API error:", errText);
                res.statusCode = apiRes.status;
                res.end(JSON.stringify({ error: "Gemini API service error: " + errText }));
                return;
              }

              const apiJson = (await apiRes.json()) as {
                candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
              };
              const aiText =
                apiJson.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Got it! I will review this and update our records.";

              // Automatically record response in employee's conversation history
              const data = getDashboardData();
              const now = new Date();
              const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const aiMsg = {
                id: "msg-ai-" + Date.now(),
                senderId: targetContactId,
                text: aiText,
                timestamp: timeStr,
                createdAt: now.toISOString(),
              };

              if (!data.chatConversations) data.chatConversations = {};
              if (!data.chatConversations[targetContactId]) data.chatConversations[targetContactId] = [];
              data.chatConversations[targetContactId].push(aiMsg);
              saveDashboardData(data);

              res.statusCode = 200;
              res.end(JSON.stringify({ response: aiText, message: aiMsg }));
            } catch (err) {
              console.error("Failed to proxy Gemini request:", err);
              const fallbacks = [
                "Understood, looking into this right now.",
                "Got it! Let me review this and get back to you shortly.",
                "Thanks for the update John, I will check the dashboard figures on my end.",
                "Sounds good! Let's follow up on this during our team sync.",
              ];
              const fallbackText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
              const data = getDashboardData();
              const now = new Date();
              const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const fallbackMsg = {
                id: "msg-ai-" + Date.now(),
                senderId: targetContactId,
                text: fallbackText,
                timestamp: timeStr,
                createdAt: now.toISOString(),
              };
              if (!data.chatConversations) data.chatConversations = {};
              if (!data.chatConversations[targetContactId]) data.chatConversations[targetContactId] = [];
              data.chatConversations[targetContactId].push(fallbackMsg);
              saveDashboardData(data);
              res.statusCode = 200;
              res.end(JSON.stringify({ response: fallbackText, message: fallbackMsg }));
            }
          });
          return;
        }

        // 7. CALENDAR ENDPOINTS
        // 7.1. GET /api/calendar/events
        if (req.method === "GET" && pathname === "/api/calendar/events") {
          const data = getDashboardData();
          const events = data?.calendarEvents || [];
          res.statusCode = 200;
          res.end(JSON.stringify(events));
          return;
        }

        // 7.2. POST /api/calendar/events
        if (req.method === "POST" && pathname === "/api/calendar/events") {
          readJsonBody().then((body) => {
            const data = getDashboardData();
            if (!data.calendarEvents) data.calendarEvents = [];
            const newEvent = {
              id: (body.id as string) || "evt-" + Date.now(),
              title: (body.title as string) || "Untitled Event",
              description: (body.description as string) || "",
              startDate: (body.startDate as string) || new Date().toISOString().split("T")[0],
              startTime: (body.startTime as string) || "",
              endDate: (body.endDate as string) || (body.startDate as string) || new Date().toISOString().split("T")[0],
              endTime: (body.endTime as string) || "",
              allDay: Boolean(body.allDay),
              category: (body.category as string) || "etc",
              location: (body.location as string) || "",
              color: (body.color as string) || "",
            };

            data.calendarEvents.push(newEvent);
            saveDashboardData(data);

            res.statusCode = 201;
            res.end(JSON.stringify(newEvent));
          });
          return;
        }

        // 7.3. PUT/PATCH /api/calendar/events/:id
        const calendarEventMatch = pathname.match(/^\/api\/calendar\/events\/([^/]+)$/);
        if ((req.method === "PUT" || req.method === "PATCH") && calendarEventMatch) {
          const eventId = calendarEventMatch[1];
          readJsonBody().then((updates) => {
            const data = getDashboardData();
            const events = (data?.calendarEvents || []) as Array<Record<string, unknown>>;
            const eventIndex = events.findIndex((e) => e.id === eventId);

            if (eventIndex !== -1) {
              events[eventIndex] = {
                ...events[eventIndex],
                ...updates,
                id: eventId,
              };
              data.calendarEvents = events;
              saveDashboardData(data);

              res.statusCode = 200;
              res.end(JSON.stringify(events[eventIndex]));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "Event not found" }));
            }
          });
          return;
        }

        // 7.4. DELETE /api/calendar/events/:id
        if (req.method === "DELETE" && calendarEventMatch) {
          const eventId = calendarEventMatch[1];
          const data = getDashboardData();
          if (data?.calendarEvents) {
            data.calendarEvents = (data.calendarEvents as Array<Record<string, unknown>>).filter(
              (e) => e.id !== eventId,
            );
            saveDashboardData(data);
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
          return;
        }

        // 8. INVOICE ENDPOINTS
        // 8.1. GET /api/invoices
        if (req.method === "GET" && pathname === "/api/invoices") {
          const data = getDashboardData();
          const invoices = data?.invoices || [];
          res.statusCode = 200;
          res.end(JSON.stringify(invoices));
          return;
        }

        // 8.2. POST /api/invoices/batch-delete
        if (req.method === "POST" && pathname === "/api/invoices/batch-delete") {
          readJsonBody().then((body) => {
            const data = getDashboardData();
            const idsToDelete = (body.ids as string[]) || [];
            if (data?.invoices) {
              data.invoices = (data.invoices as Array<{ id: string }>).filter(
                (inv) => !idsToDelete.includes(inv.id),
              );
              saveDashboardData(data);
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, deletedCount: idsToDelete.length }));
          });
          return;
        }

        // 8.3. POST /api/invoices/batch-status
        if (req.method === "POST" && pathname === "/api/invoices/batch-status") {
          readJsonBody().then((body) => {
            const data = getDashboardData();
            const ids = (body.ids as string[]) || [];
            const newStatus = (body.status as string) || "Paid";
            if (data?.invoices) {
              data.invoices = (data.invoices as Array<{ id: string; status: string; balance: number; total: number; paidAmount: number }>).map(
                (inv) => {
                  if (ids.includes(inv.id)) {
                    const isPaid = newStatus.toLowerCase() === "paid";
                    return {
                      ...inv,
                      status: newStatus,
                      balance: isPaid ? 0 : inv.balance,
                      paidAmount: isPaid ? inv.total : inv.paidAmount,
                    };
                  }
                  return inv;
                },
              );
              saveDashboardData(data);
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, updatedCount: ids.length }));
          });
          return;
        }

        // 8.4. POST /api/invoices
        if (req.method === "POST" && pathname === "/api/invoices") {
          readJsonBody().then((body) => {
            const data = getDashboardData();
            if (!data.invoices) data.invoices = [];
            const newId = (body.id as string) || String(Math.floor(4000 + Math.random() * 2000));
            const total = Number(body.total) || 0;
            const balance = body.balance !== undefined ? Number(body.balance) : total;
            const newInvoice = {
              id: newId,
              invoiceNumber: (body.invoiceNumber as string) || `#${newId}`,
              clientId: (body.clientId as string) || "c-new",
              clientName: (body.clientName as string) || "New Client",
              clientEmail: (body.clientEmail as string) || "client@example.com",
              clientAvatar: (body.clientAvatar as string) || "member1",
              total,
              paidAmount: total - balance,
              balance,
              status: (body.status as string) || (balance === 0 ? "Paid" : "Pending"),
              issueDate: (body.issueDate as string) || new Date().toISOString().split("T")[0],
              dueDate: (body.dueDate as string) || new Date().toISOString().split("T")[0],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            data.invoices.unshift(newInvoice);
            saveDashboardData(data);

            res.statusCode = 201;
            res.end(JSON.stringify(newInvoice));
          });
          return;
        }

        // 8.5. GET /api/invoices/:id
        const singleInvoiceMatch = pathname.match(/^\/api\/invoices\/([^/]+)$/);
        if (req.method === "GET" && singleInvoiceMatch) {
          const invId = singleInvoiceMatch[1];
          const data = getDashboardData();
          const invoice = (data?.invoices || []).find((i: { id: string }) => i.id === invId);
          if (invoice) {
            res.statusCode = 200;
            res.end(JSON.stringify(invoice));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Invoice not found" }));
          }
          return;
        }

        // 8.6. PUT/PATCH /api/invoices/:id
        if ((req.method === "PUT" || req.method === "PATCH") && singleInvoiceMatch) {
          const invId = singleInvoiceMatch[1];
          readJsonBody().then((updates) => {
            const data = getDashboardData();
            const invoices = (data?.invoices || []) as Array<Record<string, unknown>>;
            const invIndex = invoices.findIndex((i) => i.id === invId);

            if (invIndex === -1) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "Invoice not found" }));
              return;
            }

            const updatedInvoice = {
              ...invoices[invIndex],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            invoices[invIndex] = updatedInvoice;
            saveDashboardData(data);

            res.statusCode = 200;
            res.end(JSON.stringify(updatedInvoice));
          });
          return;
        }

        // 8.7. DELETE /api/invoices/:id
        if (req.method === "DELETE" && singleInvoiceMatch) {
          const invId = singleInvoiceMatch[1];
          const data = getDashboardData();
          if (data?.invoices) {
            data.invoices = (data.invoices as Array<{ id: string }>).filter(
              (i) => i.id !== invId,
            );
            saveDashboardData(data);
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true }));
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
    watch: {
      ignored: [
        "**/src/data/**",
        "**/src/data/dashboard.json",
        "**/.env*",
      ],
    },
  },
});
