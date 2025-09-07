import { toast } from "sonner";

export interface NotificationData {
  id?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp?: string;
  read?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  category: 'sales' | 'policies' | 'claims' | 'system';
  priority: 'low' | 'medium' | 'high';
  userId?: string;
  companyId?: string;
}

class NotificationService {
  private notifications: NotificationData[] = [];

  // Send notification to user
  sendNotification(notification: NotificationData) {
    // Add timestamp
    const notificationWithTimestamp = {
      ...notification,
      timestamp: new Date().toISOString(),
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Store in local notifications array (in real app, this would go to database)
    this.notifications.unshift(notificationWithTimestamp);

    // Show toast notification
    this.showToast(notification);

    // In a real application, you would also:
    // 1. Save to database
    // 2. Send push notification if user has it enabled
    // 3. Send email notification if configured
    // 4. Update notification badge in UI

    console.log("Notification sent:", notificationWithTimestamp);
  }

  // Show toast notification
  private showToast(notification: NotificationData) {
    const toastOptions = {
      description: notification.message,
      action: notification.actionUrl ? {
        label: notification.actionLabel || "View",
        onClick: () => {
          // Navigate to action URL
          console.log("Navigate to:", notification.actionUrl);
        }
      } : undefined
    };

    switch (notification.type) {
      case 'success':
        toast.success(notification.title, toastOptions);
        break;
      case 'error':
        toast.error(notification.title, toastOptions);
        break;
      case 'warning':
        toast.warning(notification.title, toastOptions);
        break;
      default:
        toast.info(notification.title, toastOptions);
    }
  }

  // Get notifications for user
  getNotifications(userId?: string, limit = 50) {
    // In real app, this would fetch from database
    return this.notifications.slice(0, limit);
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      // In real app, update in database
      console.log("Marked notification as read:", notificationId);
    }
  }

  // Delete notification
  deleteNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    console.log("Deleted notification:", notificationId);
  }

  // Workflow-specific notification methods
  notifyQuoteSent(quoteId: string, insurerName: string, salesProcessId: string) {
    this.sendNotification({
      type: 'info',
      title: 'Quote Sent to Insurer',
      message: `Quote ${quoteId} has been sent to ${insurerName} for review`,
      actionUrl: `/sales/processes/${salesProcessId}`,
      actionLabel: 'View Process',
      category: 'sales',
      priority: 'medium'
    });
  }

  notifyQuoteResponded(quoteId: string, insurerName: string, response: string) {
    this.sendNotification({
      type: 'success',
      title: 'Quote Response Received',
      message: `${insurerName} has ${response} quote ${quoteId}`,
      actionUrl: '/sales/processes',
      actionLabel: 'View Quotes',
      category: 'sales',
      priority: 'high'
    });
  }

  notifyClientSelectedQuote(quoteId: string, insurerName: string, salesProcessId: string) {
    this.sendNotification({
      type: 'success',
      title: 'Client Selected Quote',
      message: `Client has selected the quote from ${insurerName}. Policy creation will begin.`,
      actionUrl: `/sales/processes/${salesProcessId}`,
      actionLabel: 'View Process',
      category: 'sales',
      priority: 'high'
    });
  }

  notifyPolicyImported(policyNumber: string, salesProcessId: string) {
    this.sendNotification({
      type: 'success',
      title: 'Policy Imported Successfully',
      message: `Policy ${policyNumber} has been imported and is ready for review`,
      actionUrl: `/policies/${policyNumber}`,
      actionLabel: 'Review Policy',
      category: 'policies',
      priority: 'high'
    });
  }

  notifyPolicyFinalized(policyNumber: string) {
    this.sendNotification({
      type: 'success',
      title: 'Policy Finalized',
      message: `Policy ${policyNumber} has been successfully finalized and is now active`,
      actionUrl: `/policies/${policyNumber}`,
      actionLabel: 'View Policy',
      category: 'policies',
      priority: 'medium'
    });
  }

  notifyPolicySentToClient(policyNumber: string) {
    this.sendNotification({
      type: 'info',
      title: 'Policy Sent to Client',
      message: `Policy ${policyNumber} has been sent to client for signature`,
      actionUrl: `/policies/${policyNumber}`,
      actionLabel: 'View Policy',
      category: 'policies',
      priority: 'medium'
    });
  }

  notifySignedPolicyUploaded(policyNumber: string) {
    this.sendNotification({
      type: 'success',
      title: 'Signed Policy Uploaded',
      message: `Client has signed policy ${policyNumber} and returned it`,
      actionUrl: `/policies/${policyNumber}`,
      actionLabel: 'Review Signature',
      category: 'policies',
      priority: 'high'
    });
  }

  notifyPolicySentToInsurer(policyNumber: string) {
    this.sendNotification({
      type: 'info',
      title: 'Policy Sent to Insurer',
      message: `Signed policy ${policyNumber} has been sent to insurer for final approval`,
      actionUrl: `/policies/${policyNumber}`,
      actionLabel: 'View Policy',
      category: 'policies',
      priority: 'medium'
    });
  }

  notifyPolicyApproved(policyNumber: string) {
    this.sendNotification({
      type: 'success',
      title: 'Policy Approved by Insurer',
      message: `Policy ${policyNumber} has been approved and is now fully valid`,
      actionUrl: `/policies/${policyNumber}`,
      actionLabel: 'View Policy',
      category: 'policies',
      priority: 'high'
    });
  }

  notifyClaimSubmitted(claimId: string, policyNumber: string) {
    this.sendNotification({
      type: 'info',
      title: 'New Claim Submitted',
      message: `A new claim has been submitted for policy ${policyNumber}`,
      actionUrl: '/claims',
      actionLabel: 'View Claims',
      category: 'claims',
      priority: 'medium'
    });
  }

  notifyPaymentOverdue(policyNumber: string, amount: number) {
    this.sendNotification({
      type: 'warning',
      title: 'Payment Overdue',
      message: `Payment of ${amount} RSD is overdue for policy ${policyNumber}`,
      actionUrl: `/policies/${policyNumber}`,
      actionLabel: 'View Policy',
      category: 'policies',
      priority: 'high'
    });
  }

  notifyPolicyExpiring(policyNumber: string, daysUntilExpiry: number) {
    this.sendNotification({
      type: 'warning',
      title: 'Policy Expiring Soon',
      message: `Policy ${policyNumber} expires in ${daysUntilExpiry} days`,
      actionUrl: `/policies/${policyNumber}`,
      actionLabel: 'Renew Policy',
      category: 'policies',
      priority: 'medium'
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;