import { LogCategory, LogStage, LogStatus } from "./product.entity";
import { AffiliateUser, PdevUser, User } from "./user.entity";

export interface LogTrail {
  id: string;
  accountType: string | null;
  email: string | null;
  action: string;
  category: LogCategory; // From your initial schema definitions
  status: LogStatus;     // From your initial schema definitions
  stage: LogStage;       // From your initial schema definitions
  target: Record<string, any>; // JSON Field
  metaData: Record<string, any>; // JSON Field
  timestamp: Date;
  userId: string | null;
  affiliateUserId: string | null;
  pdevUserId: string | null;

  // Relations
  user?: User | null;
  affiliateUser?: AffiliateUser | null; // From your initial schema definitions
  pdevUser?: PdevUser | null;
}