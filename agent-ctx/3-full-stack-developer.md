# Task ID: 3 - Pathfinder IA API Routes

## Agent: full-stack-developer

## Summary
Successfully created all 13 API routes for the Pathfinder IA platform, including standard CRUD operations and AI-powered endpoints using z-ai-web-dev-sdk.

## Files Created

### 1. `/src/app/api/pepites/route.ts` - GET & POST
- **GET**: Fetch all pepites with optional user responses filtering
  - Query params: `userId`
  - Returns pepites with user's category response (have/want/not_priority)
- **POST**: Save user's pepite response
  - Body: `{ userId, pepiteId, category }`
  - Validates category values and upserts response

### 2. `/src/app/api/pepites/[id]/route.ts` - GET
- Fetch single pepite details with statistics
- Query params: `userId` for user response
- Returns pepite with user response and aggregate stats

### 3. `/src/app/api/career-paths/route.ts` - GET & POST
- **GET**: Fetch user's career paths with nodes
  - Query params: `userId` (required)
- **POST**: Create new career path with optional nodes
  - Supports primary path management
  - Creates nodes in bulk if provided

### 4. `/src/app/api/career-paths/[id]/route.ts` - GET, PUT, DELETE
- **GET**: Fetch single career path with nodes
- **PUT**: Update career path (name, description, color, primary status, nodes)
- **DELETE**: Delete career path (cascade deletes nodes)

### 5. `/src/app/api/jobs/route.ts` - GET
- Fetch job opportunities with filtering and pagination
- Query params: `userId`, `sector`, `location`, `minSalary`, `maxSalary`, `search`, `page`, `limit`
- Returns jobs with skills and user application status

### 6. `/src/app/api/jobs/[id]/route.ts` - GET
- Fetch single job details with skills and similar jobs
- Query params: `userId` for user application status

### 7. `/src/app/api/skills/route.ts` - GET & POST
- **GET**: Fetch all skills grouped by category
  - Query params: `userId`, `category`, `search`
- **POST**: Add skill to user profile
  - Body: `{ userId, skillId, level, source }`
  - Validates level (1-5) and source values

### 8. `/src/app/api/badges/route.ts` - GET
- Fetch all badges with user's earned status
- Query params: `userId`
- Returns badges grouped by type with user stats

### 9. `/src/app/api/user/route.ts` - GET & PUT
- **GET**: Fetch comprehensive user profile
  - Includes skills, badges, career paths, career identity, pepites
  - Returns stats (total applications, skills, badges)
- **PUT**: Update user profile
  - Body: `{ userId, name, avatar, persona, language }`
  - Validates persona and language values

### 10. `/src/app/api/analyze-cv/route.ts` - POST (AI-powered)
- Analyze CV text and extract skills using AI
- Body: `{ cvText, userId, language }`
- Returns:
  - `technicalSkills`: Array of technical skills
  - `softSkills`: Array of soft skills
  - `languages`: Array of languages
  - `experience`: Years, positions, companies
  - `education`: Degrees, institutions
  - `suggestedCareerPaths`: Career path suggestions
  - `strengths`: Key strengths
  - `areasForDevelopment`: Areas to improve
- Automatically saves extracted skills to user profile if userId provided

### 11. `/src/app/api/career-identity/route.ts` - POST (AI-powered)
- Generate Career Identity Statement using AI
- Body: `{ userId, pepitesHave, pepitesWant, skills, experience, aspirations, language }`
- Returns:
  - `superPower`: Unique talent (one powerful sentence)
  - `mission`: Professional purpose
  - `values`: 3-5 core values
  - `strengths`: 3-5 main strengths
  - `rawAiAnalysis`: Detailed analysis
- Saves to database (upsert)

### 12. `/src/app/api/cover-letter/route.ts` - POST (AI-powered)
- Generate cover letter using AI
- Body: `{ userId, jobId, tone, language, customPoints }`
- Tone options: `professional`, `enthusiastic`, `creative`
- Returns:
  - `subject`: Email subject
  - `greeting`: Salutation
  - `body`: Main content (3-4 paragraphs)
  - `closing`: Closing phrase
  - `signature`: Signature
  - `fullLetter`: Complete formatted letter
- Saves to job application

### 13. `/src/app/api/interview-prep/route.ts` - POST (AI-powered)
- Generate interview questions using AI
- Body: `{ userId, jobId, jobTitle, company, interviewType, language, focusAreas }`
- Interview types: `technical`, `behavioral`, `case`, `general`
- Returns:
  - `questions`: 8-10 questions with suggested answers and tips
  - `generalTips`: Array of general tips
  - `companyInsights`: Company culture insights
  - `estimatedDuration`: Estimated prep time
- Saves to database

## Database Connection
All routes use `import { db } from '@/lib/db'` for database operations.

The DATABASE_URL is passed as an environment variable:
```
DATABASE_URL="postgresql://career_user:career_secure_pass_2026@109.123.249.114:5432/career_db?schema=public"
```

## AI Integration
All AI-powered routes use `z-ai-web-dev-sdk`:
- Used for CV analysis, career identity generation, cover letter writing, and interview prep
- Supports both French (`fr`) and Arabic (`ar`) languages
- Returns structured JSON responses
- Implements proper error handling and JSON parsing

## Error Handling
All routes implement:
- Input validation with descriptive error messages
- Try-catch blocks with console logging
- Proper HTTP status codes (400, 404, 500)
- Consistent JSON response format: `{ success: boolean, data?: T, error?: string, message?: string }`

## Lint Status
✅ All lint checks passed with no errors.

## Notes for Next Agents
- All API routes are ready for frontend integration
- AI routes require the z-ai-web-dev-sdk to be available
- Database schema is already pushed and seeded
- All routes support both French and Arabic languages
