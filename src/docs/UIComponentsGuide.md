
# Policy Hub UI Components Guide

This document provides an overview of the common UI components we've standardized for the Policy Hub application. These components help ensure consistency across the application and make development faster and more maintainable.

## Table of Contents
1. [DataTable Component](#datatable-component)
2. [FilterBar Component](#filterbar-component)
3. [ActionButtons Component](#actionbuttons-component)
4. [PageHeader Component](#pageheader-component)
5. [Usage Examples](#usage-examples)

## DataTable Component

The `DataTable` component provides a standardized way to display tabular data with features like loading states, error handling, searching, and consistent styling.

### Key Features
- Loading state with skeleton loaders
- Error state with retry option
- Empty state with custom message
- Search capability
- Custom rendering for cells
- Consistent styling with border, headers, etc.

### Basic Usage
```tsx
import { DataTable, Column } from "@/components/ui/common";

// Define your columns
const columns: Column<YourDataType>[] = [
  {
    key: "name",
    header: "Name",
    render: (item) => <div className="font-medium">{item.name}</div>
  },
  {
    key: "status",
    header: "Status"
  }
];

// Use the component
<DataTable
  data={yourData}
  columns={columns}
  keyField="id"
  isLoading={isLoading}
  error={error}
  onRefresh={fetchData}
  onSearch={handleSearch}
  searchPlaceholder="Search..."
  emptyMessage="No data found"
/>
```

## FilterBar Component

The `FilterBar` component provides a standardized way to implement filtering across the application.

### Key Features
- Multiple filter groups support
- Single-select or multi-select filter options
- Active filters display with remove capability
- Clear all filters option
- Customizable filter content rendering

### Basic Usage
```tsx
import { FilterBar, FilterGroup, ActiveFilter } from "@/components/ui/common";

// Define your filter groups
const filterGroups: FilterGroup[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { id: "active", label: "Active", value: "active" },
      { id: "inactive", label: "Inactive", value: "inactive" }
    ]
  }
];

// Use the component
<FilterBar
  filterGroups={filterGroups}
  activeFilters={activeFilters}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearFilters}
/>
```

## ActionButtons Component

The `ActionButtons` component provides a standardized way to display primary and secondary action buttons.

### Key Features
- Primary action button with loading state
- Secondary actions in a dropdown menu
- Custom icons
- Various button variants (destructive, outline, etc.)
- Custom alignment

### Basic Usage
```tsx
import { ActionButtons } from "@/components/ui/common";
import { Plus, Edit, Trash2 } from "lucide-react";

<ActionButtons
  primaryAction={{
    label: "Add New",
    onClick: handleAddNew,
    icon: <Plus className="h-4 w-4 mr-2" />,
    isLoading: isSubmitting
  }}
  secondaryActions={[
    {
      id: "edit",
      label: "Edit",
      onClick: handleEdit,
      icon: <Edit className="h-4 w-4" />
    },
    {
      id: "delete",
      label: "Delete",
      onClick: handleDelete,
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive"
    }
  ]}
/>
```

## PageHeader Component

The `PageHeader` component provides a standardized way to display page headers with titles, descriptions, back buttons, and actions.

### Key Features
- Page title and description
- Back button with optional custom path
- Action buttons area
- Responsive design

### Basic Usage
```tsx
import { PageHeader } from "@/components/ui/common";

<PageHeader
  title="My Page Title"
  description="Description of what this page is for"
  backButtonLabel="Back"
  backButtonPath="/previous-page"
  actions={<YourActionButtons />}
/>
```

## Usage Examples

See the following files for complete examples of how these components work together:

1. `src/pages/sales/PipelineOverview.tsx` - Shows usage of PageHeader, FilterBar, and other components
2. `src/pages/codebook/ClientsDirectoryRefactored.tsx` - Shows usage of DataTable with other components

These common components help ensure consistency across the application and reduce development time by providing pre-built solutions for common UI patterns.
