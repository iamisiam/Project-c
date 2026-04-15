# Project Brief: Us - Couples App

## Purpose

"Us" is a web application designed for couples to strengthen their relationship through shared activities and communication. It provides a private workspace where partners can engage in interactive quizzes, share memories, discuss frustrations with AI-mediated advice, plan their future, and build their own couple dictionary.

## Target Users

- Couples looking to deepen their connection
- Partners wanting fun, meaningful shared activities
- Relationships seeking better communication tools

## Core Use Case

Couples create an account together and access a shared workspace with five main features:

1. **Quiz**: Interactive quizzes to learn about each other
2. **Remember**: Photo albums of shared memories
3. **Frustrations**: Safe space to express concerns with AI counseling
4. **Future**: Shared calendar for planning
5. **Us'isms**: Dictionary of couple's unique language

## Key Requirements

### Must Have

- User authentication for couples
- Shared workspace with block-based layout
- Database persistence for all user data
- Five core features: Quiz, Remember, Frustrations, Future, Us'isms
- AI integration (Gemini) for relationship counseling
- Responsive design for mobile and desktop
- Secure data handling with proper access controls

### Nice to Have

- Photo upload for albums
- Calendar integration
- Push notifications for shared activities
- Export functionality for memories
- Dark/light theme toggle

## Success Metrics

- Couples can create accounts and access shared workspace
- All features functional with proper data persistence
- AI advice provides helpful, non-generic counseling
- Clean, intuitive user interface
- Secure authentication and data protection

## Constraints

- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Database: SQLite with Drizzle ORM
- AI: Gemini API for counseling
- Package manager: Bun
- Authentication: Custom implementation (no external providers)
