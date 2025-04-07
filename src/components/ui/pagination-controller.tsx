
import React from "react";
import { Pagination, PaginationProps } from "@/components/ui/pagination";

// This is a wrapper component that maintains backward compatibility
// with the previous implementation while using the new Pagination component
export interface PaginationControllerProps extends PaginationProps {}

export function PaginationController(props: PaginationControllerProps) {
  // Simply pass all props to the Pagination component
  return <Pagination {...props} />;
}
