
# Policy Hub Knowledge Base

This document serves as the central knowledge repository for the Policy Hub application. It captures key concepts, architecture decisions, module functionality, and implementation details to assist developers and stakeholders in understanding the system.

## Table of Contents

1. [Application Overview](#application-overview)
2. [Core Business Logic](#core-business-logic)
3. [Module Architecture](#module-architecture)
4. [Component Library](#component-library)
5. [Data Models](#data-models)
6. [Authentication & Authorization](#authentication--authorization)
7. [Workflow Processes](#workflow-processes)
8. [Internationalization](#internationalization)
9. [Best Practices](#best-practices)
10. [Known Issues & Workarounds](#known-issues--workarounds)

## Application Overview

Policy Hub is a scalable, modular, and secure digital platform designed to streamline end-to-end operations for insurance intermediaries, brokers, and their clients. The platform provides a unified environment where users can manage and oversee critical processes across multiple domains.

### Key Differentiator

The key differentiator in Policy Hub's logic is that new policies are not created manually within the system; they are generated exclusively by insurance companies and then imported into Policy Hub. Users review, update, and finalize these imported policies rather than creating them from scratch.

### Key Domains

- **Policy Administration**: Management of imported policies, policy addendums, related data, and audit trails
- **Sales & Lead Management**: Lead capture through quote management with Kanban boards and funnel visualizations
- **Claims Processing**: Centralized module for registering, processing, and resolving claims
- **Financial Operations**: Commission calculations, invoicing, and bank statement reconciliation
- **Agent Management**: Flexible commission structures with detailed payout calculations
- **Reporting & Analytics**: Customizable reports for informed decision-making
- **Localization & Internationalization**: Support for multiple languages (English, Serbian, Macedonian, Spanish)
- **Role-Based Access Control**: Super Admins, Broker Admins, and Employees see only features and data relevant to their roles

## Core Business Logic

### Policy Management

Policies are exclusively created by insurance companies and imported into Policy Hub. The platform's role is to facilitate:

1. **Policy Import**: Accepting policy data from insurance companies
2. **Review & Validation**: Verifying imported policy details for accuracy and completeness
3. **Finalization**: Marking policies as complete after all mandatory fields and documents are present
4. **Amendments**: Tracking and managing policy changes through addendums

### Sales Process

1. **Lead Capture**: Initial prospect information is recorded
2. **Quote Management**: Quotes are generated and sent to multiple insurance companies
3. **Offer Collection**: Insurer responses are gathered and presented to clients
4. **Selection & Import**: Client selects a quote, which is sent to the insurer who creates the policy that is then imported

### Claims Handling

Claims are linked to imported policies, automatically pulling relevant policy details to ensure consistency and reduce manual entry.

## Module Architecture

The application is organized into logical modules, each with its own set of components, services, and data structures:

### Dashboard Module

- Landing page with key performance indicators
- Quick access to policies nearing expiry, incomplete policies, and active claims

### Policies Module

- **All Policies**: Comprehensive directory with search, filtering, and detailed views
- **Policies Workflow**: Review and finalization of imported policies
- **Policy Addendums**: Management of policy amendments
- **Unlinked Payments**: Matching of payments to policies
- **Documents**: Repository for policy-related files

### Sales Module

- **Pipeline Overview**: Visual representation of sales activities
- **Leads**: Management of prospective clients
- **Sales Processes**: Structured workflow from interest to policy
- **Responsible Persons**: Assignment of accountability

### Claims Module

- Claim registration, processing, status updates, and resolution

### Finances Module

- **Commissions**: Calculation and management of broker commissions
- **Invoicing**: Generation and tracking of invoices
- **Statement Processing**: Reconciliation of bank statements

### Codebook Module

- **Clients**: Directory of policyholders and clients
- **Insurance Companies**: Directory of insurers
- **Insurance Codes**: Product code management

### Agent Module

- Commission management and payout calculations

### Reports Module

- Customizable reports across different domains

### Settings Module

- Application configuration, user management, and access control

## Component Library

The application uses a custom component library built on top of Shadcn UI and Tailwind CSS. Key components include:

### UI Components

- Forms, tables, modals, cards, and other basic UI elements
- Responsive design patterns for all screen sizes
- Accessibility-compliant interactive elements

### Document Management

- Upload, categorization, version control, and retrieval
- Preview and approval workflows
- AI-assisted document analysis

### Workflow Components

- Status progression visualization
- Approval workflows with audit trails
- Kanban and pipeline representations

## Data Models

### Core Entities

- **Policy**: Imported insurance policy with metadata
- **Addendum**: Modification to an existing policy
- **Claim**: Insurance claim linked to a policy
- **Client**: Policyholder or insured party
- **Insurer**: Insurance company
- **Product**: Insurance product or service
- **Document**: Files associated with various entities
- **User**: System user with role-based permissions

### Relationships

- Policies are linked to clients, insurers, and products
- Claims are linked to policies
- Documents are linked to various entity types
- Users are associated with companies

## Authentication & Authorization

### User Roles

- **Super Admin**: Full system control
- **Admin**: Broker company management
- **Employee**: Role-specific access to modules

### Access Control

- Role-based permissions
- Feature-level access restrictions
- Company-specific data isolation
- Privilege customization

## Workflow Processes

### Policy Workflow

1. **Draft**: Imported policy with incomplete information
2. **In Review**: Policy being verified and updated
3. **Ready**: Policy with complete information ready for finalization
4. **Complete**: Finalized policy in active state

### Claims Workflow

1. **In Processing**: Newly registered claim
2. **Reported**: Claim reported to insurer
3. **Accepted/Rejected/Partially Accepted**: Insurer decision
4. **Appealed**: Contested decision
5. **Withdrawn**: Canceled claim

### Sales Workflow

1. **Prospect**: Initial lead
2. **Quote Generation**: Creating and sending quotes to insurers
3. **Offer Collection**: Gathering insurer responses
4. **Client Selection**: Client chooses preferred offer
5. **Policy Import**: Finalization and import of policy

## Internationalization

The application supports multiple languages through a robust translation framework:

- English (EN)
- Serbian (SR)
- Macedonian (MK)
- Spanish (ES)

Translations are managed through JSON files and a language context provider.

## Best Practices

### Code Organization

- Use hooks for reusable logic
- Create small, focused components
- Maintain consistent naming conventions
- Document complex logic and business rules

### State Management

- Use React Context for global state
- Prefer local state for component-specific data
- Use TanStack Query for data fetching and caching

### Performance Optimization

- Implement pagination for large datasets
- Lazy load components and resources
- Memoize expensive computations
- Use virtual lists for long scrollable content

## Known Issues & Workarounds

| Issue | Affected Components | Workaround | Planned Fix |
|-------|---------------------|------------|-------------|
| Type conflicts in document management | `DocumentUploadDialog`, `DocumentAnalysisPanel` | Use explicit type casting | Refactor type definitions |
| EntityType import issues | Multiple document components | Update import statements to use `enum` instead of `type` | Consolidate type definitions |
| Pagination component inconsistencies | Various list components | Use a wrapper to normalize pagination props | Standardize pagination interface |

## Integration Points

### External Systems

- Insurance company APIs for policy data
- Banking systems for payment reconciliation
- Document processing services for OCR and analysis

### Internal Services

- Authentication and user management
- Document storage and retrieval
- Notification system

## Development Guidelines

### New Features

1. Understand the business context
2. Design with internationalization in mind
3. Implement with proper error handling
4. Document the feature in the knowledge base
5. Update type definitions as needed

### Bug Fixes

1. Reproduce the issue
2. Add test cases where appropriate
3. Fix the root cause, not just symptoms
4. Document the fix in the changelog
5. Update the knowledge base if applicable

## Maintaining This Document

This knowledge base should be updated:

1. When new features are added
2. When significant bugs are fixed
3. When architectural decisions are made
4. When best practices are established or updated

Use the `docs/knowledge-changelog.md` file to track changes to this document.

---

Last Updated: 2025-04-09
