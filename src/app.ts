import express, { Application, Request, Response, NextFunction } from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from './modules/user/user.routes.js'
import opportunityRoutes  from './modules/opportunity/opportunity.routes.js'


const app=express()


app.use(
  cors({})
);

app.use(express.json());
app.use(cookieParser());

// Silence Chrome DevTools internal discovery ping
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req: Request, res: Response) => {
  res.status(204).end();
});

// Mount Auth Module
 app.use("/api/v1/", authRoutes);     // working
 app.use("/api/v1/", userRoutes);     // working
 app.use("/api/v1",opportunityRoutes)  
// Global Error Handling Middleware (Must be declared after routes)
//app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("💥 Error Intercepted:", err.message);

  // Return a clean fallback response to the user
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

export default app;