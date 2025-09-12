# PolicyHub - Insurance Intermediary Management Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-blue.svg)](https://tailwindcss.com/)

PolicyHub is a comprehensive, scalable, and secure digital platform designed to streamline end-to-end operations for insurance intermediaries, brokers, and their clients. The platform provides a unified environment for managing critical processes across multiple domains with a focus on policy import workflows, advanced quote management, and comprehensive audit trails.

## 🚀 Key Features

### Core Business Logic
- **Policy Import-First Architecture**: Policies are exclusively imported from insurance companies, not created manually
- **Advanced Quote Management**: Complete quote-to-policy workflow with insurer integration
- **Comprehensive Audit Trail**: Every action is logged with user, timestamp, IP, and detailed change descriptions
- **Multi-language Support**: English, Serbian, Macedonian, and Spanish localization
- **Role-Based Access Control**: Super Admin, Admin, and Employee roles with granular permissions

### Implemented Modules

#### 📊 Dashboard
- **Real-time KPIs**: Total policies, sales pipeline metrics, open claims, monthly revenue
- **Smart Widgets**: Upcoming policy renewals, incomplete policies, ready-to-finalize policies
- **Interactive Charts**: Sales pipeline visualization with drill-down capabilities
- **Performance Metrics**: Conversion rates, lead statistics, and financial summaries

#### 📋 Policy Management
- **Policy Directory**: Comprehensive policy listing with advanced search and filtering
- **Policy Workflow**: Review and finalization of imported policies with validation
- **Policy Addendums**: Amendment management with premium adjustments and lien status
- **Document Management**: Version-controlled document storage with AI-powered analysis
- **Unlinked Payments**: Payment reconciliation and manual linking capabilities
- **Policy Signature Workflow**: Complete digital signature process from client to insurer

#### 💼 Sales & Lead Management
- **Lead Capture**: Comprehensive lead management with source tracking
- **Quote Management**: Multi-insurer quote generation and response handling
- **Sales Pipeline**: Visual Kanban boards and funnel diagrams
- **Client Selection Process**: Structured quote comparison and selection workflow
- **Sales Activities**: Task management and follow-up tracking
- **Lead Communications**: Email template management and communication history

#### 🏥 Claims Processing
- **Claim Registration**: Automated policy data population for new claims
- **Status Management**: Complete claim lifecycle tracking
- **Document Upload**: Supporting evidence and report management
- **Claim Analytics**: Status reporting and trend analysis

#### 💰 Financial Operations
- **Commission Management**: Automated calculations with manual override capabilities
- **Invoice Generation**: Template-based PDF generation with customizable layouts
- **Bank Statement Processing**: Automated transaction matching and reconciliation
- **Unlinked Payment Management**: Manual payment-to-policy linking
- **Financial Reporting**: Comprehensive financial analytics and export capabilities

#### 👥 Agent Portal
- **Commission Structures**: Fixed, client-specific, and manual commission management
- **Payout Calculations**: Automated agent payout processing
- **Performance Tracking**: Agent performance metrics and reporting
- **Commission History**: Detailed commission tracking and audit trails

#### 📈 Reports & Analytics
- **Production Reports**: Policy production metrics with filtering
- **Client Activity Reports**: Client engagement and policy statistics
- **Agent Performance Reports**: Sales volume and commission analysis
- **Claims Reports**: Claim summary and trend analysis
- **Custom Report Builder**: Flexible report generation with export capabilities

#### 📚 Codebook (Master Data)
- **Client Directory**: Comprehensive client management with contact persons
- **Insurance Companies**: Insurer directory with branch and parent company relationships
- **Insurance Products**: Product code management with multilingual support
- **Relationship Management**: Complex entity relationships and hierarchies

#### ⚙️ Settings & Administration
- **User Management**: Employee onboarding with invitation system
- **Company Settings**: Multi-company support with seat management
- **Email Configuration**: SMTP settings and template management
- **Instructions Module**: Internal guidelines and help documentation
- **Privilege Management**: Granular permission control and testing

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18.3.1** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system
- **Shadcn/ui** component library for consistent UI
- **React Router** for client-side routing
- **TanStack Query** for data fetching and caching
- **React Hook Form** with Zod validation
- **Recharts** for data visualization

### Backend & Database
- **Supabase** for backend-as-a-service
- **PostgreSQL** database with Row Level Security (RLS)
- **Real-time subscriptions** for live data updates
- **Edge Functions** for serverless computing
- **File storage** for document management

### Key Libraries & Tools
- **Internationalization**: Custom i18n implementation with date-fns locales
- **PDF Generation**: jsPDF with autoTable for invoice generation
- **Document Processing**: Tesseract.js for OCR capabilities
- **File Handling**: React Dropzone for file uploads
- **Excel Processing**: XLSX for data import/export
- **Date Handling**: date-fns for comprehensive date operations

### Advanced Features Implemented Beyond Specification

#### 🤖 AI-Powered Document Analysis
- **OpenAI Integration**: GPT-4 powered document classification and extraction
- **OCR Processing**: Tesseract.js for text extraction from images
- **Smart Categorization**: Automatic document type detection
- **Data Extraction**: Structured data extraction from insurance documents

#### 🔐 Enhanced Security & Audit
- **Comprehensive Audit Trail**: [`useAuditTrail.ts`](src/hooks/useAuditTrail.ts) hook for detailed logging
- **IP Address Tracking**: User action tracking with IP and user agent
- **Session Management**: Secure authentication with Supabase Auth
- **Role-Based UI**: Dynamic component rendering based on user permissions

#### 📱 Advanced UI/UX Features
- **Modern Sidebar**: Collapsible navigation with [`ModernSidebar.tsx`](src/components/layout/sidebar/ModernSidebar.tsx)
- **Data Tables**: Advanced filtering and sorting with [`data-table.tsx`](src/components/ui/data-table.tsx)
- **Toast Notifications**: User feedback with Sonner
- **Loading States**: Comprehensive loading and error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS

#### 🔄 Workflow Management
- **Policy Signature Workflow**: [`PolicySignatureWorkflow.tsx`](src/components/policies/signature/PolicySignatureWorkflow.tsx)
- **Quote Management System**: Complete quote lifecycle management
- **Document Approval Process**: Multi-stage document review and approval
- **Status Tracking**: Visual progress indicators for all workflows

#### 📊 Advanced Analytics
- **Dashboard KPIs**: Real-time metrics with [`Dashboard.tsx`](src/pages/Dashboard.tsx)
- **Performance Metrics**: Conversion rates and pipeline analytics
- **Financial Reporting**: Automated commission and payout calculations
- **Export Capabilities**: PDF and Excel export functionality

#### 🌐 Internationalization Enhancements
- **Multi-language Support**: 4 languages with comprehensive translations
- **Locale-specific Formatting**: Currency, date, and number formatting
- **Translation Management**: Structured translation files with fallback support
- **Regional Settings**: Company-specific locale configurations

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── agent/           # Agent portal components
│   ├── auth/            # Authentication components
│   ├── claims/          # Claims management components
│   ├── codebook/        # Master data components
│   ├── dashboard/       # Dashboard widgets
│   ├── documents/       # Document management
│   ├── finances/        # Financial operations
│   ├── layout/          # Layout components
│   ├── policies/        # Policy management
│   ├── sales/           # Sales and lead management
│   ├── settings/        # Settings and administration
│   └── ui/              # Base UI components
├── contexts/            # React contexts
│   ├── auth/            # Authentication context
│   └── LanguageContext.tsx # Internationalization
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── locales/             # Translation files
├── pages/               # Page components
├── routes/              # Routing configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles/              # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key (for document analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd policyhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Database Setup**
   - Run the Supabase migrations from the `supabase/` directory
   - Set up Row Level Security policies
   - Configure authentication providers

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Demo Accounts
The application includes demo authentication for testing:
- **Super Admin**: `superadmin@demo.com`
- **Broker Admin**: `admin@demo.com`
- **Employee**: `employee@demo.com`
- **Password**: Any password (mock authentication)

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with 30+ tables including:

### Core Entities
- **Companies**: Multi-tenant company management
- **Profiles**: User profiles with role-based access
- **Policies**: Insurance policy records
- **Claims**: Claim management and tracking
- **Clients**: Customer directory
- **Insurers**: Insurance company directory
- **Agents**: Agent management and commissions

### Financial Management
- **Commissions**: Automated commission calculations
- **Invoices**: Invoice generation and tracking
- **Bank Statements**: Statement processing and reconciliation
- **Unlinked Payments**: Payment matching system

### Sales & Marketing
- **Leads**: Lead capture and management
- **Sales Processes**: Sales workflow tracking
- **Sales Quotes**: Quote management system
- **Sales Activities**: Task and activity tracking

### Document Management
- **Policy Documents**: Version-controlled document storage
- **Claim Documents**: Claim-related file management
- **Sales Documents**: Sales process documentation

### System Management
- **Activity Logs**: Comprehensive audit trail
- **Notifications**: User notification system
- **Email Templates**: Template management
- **Instructions**: Internal documentation

## 🔧 Configuration

### Language Support
The application supports 4 languages with comprehensive translations:
- **English (en)**: Primary language with 549+ translation keys
- **Serbian (sr)**: Complete translation set
- **Macedonian (mk)**: Complete translation set
- **Spanish (es)**: Complete translation set

### Email Configuration
- SMTP server configuration
- Template-based email system
- Automated notifications
- Invitation system

### Document Processing
- AI-powered document analysis
- OCR text extraction
- Automatic categorization
- Version control

## 📊 Current Implementation Status

### ✅ Fully Implemented (Beyond Specification)
- **Advanced Dashboard**: Real-time KPIs with interactive widgets
- **Policy Signature Workflow**: Complete digital signature process
- **AI Document Analysis**: OpenAI-powered document processing
- **Comprehensive Audit Trail**: Detailed action logging
- **Multi-language Support**: 4 languages with locale formatting
- **Advanced Quote Management**: Complete quote-to-policy workflow
- **Financial Operations**: Automated commission and invoice processing
- **Agent Portal**: Commission management and payout calculations
- **Document Management**: Version control with AI analysis
- **User Management**: Invitation system with role-based access

### 🚧 Partially Implemented
- **Claims Processing**: Basic functionality with room for enhancement
- **Reporting System**: Core reports implemented, advanced analytics pending
- **Bank Statement Processing**: Basic reconciliation implemented
- **Mobile Responsiveness**: Desktop-first with mobile improvements needed

### 📋 Future Enhancements
- **Mobile Application**: React Native implementation
- **Advanced Analytics**: AI-powered insights and predictions
- **API Integrations**: Direct insurer API connections
- **Workflow Automation**: Advanced business process automation
- **Performance Optimization**: Caching and optimization improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the established component patterns
- Maintain comprehensive translations
- Include audit trail logging for user actions
- Follow the existing file structure
- Write meaningful commit messages

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Check the internal documentation in the Instructions module
- Review the knowledge base in [`docs/policy-hub-knowledge.md`](docs/policy-hub-knowledge.md)
- Contact the development team

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintained by**: PolicyHub Development Team

*This README is automatically updated with each major release to reflect the current state of the application and its features.*
