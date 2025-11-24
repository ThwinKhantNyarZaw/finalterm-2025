# Admin Features Documentation

## Overview

This document describes all administrative features available in the Digital Wallet for Student Points system.

## Admin Dashboard Tabs

The Admin Dashboard (`/src/pages/AdminRewards.tsx`) contains three main tabs:

### 1. Point Requests Tab

**Purpose**: Approve or reject student point requests

**Features**:

- View all pending point requests from students
- See student details, requested points, and reason for request
- Approve requests (adds points to student account + creates transaction)
- Reject requests (notifies student, no points added)
- Real-time updates after actions

**Location**: `src/components/PendingRequests.tsx`

**Usage**:

```typescript
// Admins can approve/reject with a single click
await mockApi.approvePointRequest(requestId, adminId);
await mockApi.rejectPointRequest(requestId, adminId);
```

---

### 2. Student Points Tab

**Purpose**: View and manually adjust student points balances

**Features**:

- View all students in a table format
- See student ID, name, email, and current points balance
- Adjust points (add or deduct) for any student
- Quick action buttons: -50, -10, +10, +50
- Require reason for every adjustment (audit trail)
- Preview new balance before confirming
- All adjustments create transaction records

**Location**: `src/components/StudentPointsManagement.tsx`

**Usage Scenarios**:

- **Bonus Points**: Award students for excellent behavior (+50 for community service)
- **Penalties**: Deduct points for rule violations (-10 for late submission)
- **Corrections**: Fix errors from previous transactions
- **Special Events**: Award participation points

**Adjustment Modal Fields**:

- **Adjustment Amount**: Positive (add) or negative (subtract) integer
- **Reason**: Required text field for audit purposes
- **New Balance Preview**: Shows current + adjustment = new total

**API Method**:

```typescript
await mockApi.adjustUserPoints(
  userId: string,
  adjustment: number,  // Can be positive or negative
  reason: string,
  adminId: string
);
```

---

### 3. Rewards Management Tab

**Purpose**: Create, edit, and delete reward items

**Features**:

#### Create Rewards

- Click "+ Create Reward" button
- Fill in reward details:
  - Title (e.g., "Free Coffee Voucher")
  - Cost in points (e.g., 100)
  - Quantity available (e.g., 50)
  - Description (optional)
- Creates new reward instantly

#### Edit Rewards

- Click "✏️ Edit" button on any reward card
- Modal pre-fills with existing reward data
- Modify any field (title, cost, quantity, description)
- Click "Update Reward" to save changes

#### Delete Rewards

- Click "🗑️ Delete" button on any reward card
- Confirmation dialog appears: "Are you sure you want to delete this reward? This action cannot be undone."
- Confirm to permanently remove the reward
- Note: This does NOT affect already redeemed rewards in transaction history

**Location**: `src/pages/AdminRewards.tsx` (main logic), `src/components/RewardModal.tsx` (form UI)

**API Methods**:

```typescript
// Create
await mockApi.createReward(newReward);

// Update
await mockApi.updateReward(rewardId, updatedReward);

// Delete
await mockApi.deleteReward(rewardId);
```

---

## Admin Access

### Default Admin Account

```
Email: admin@gmail.com
Password: admin123
```

### Creating Additional Admins

Currently, admin accounts must be created manually in the seed data (`src/lib/seed.ts`).

To add a new admin:

1. Open `src/lib/seed.ts`
2. Add a new user object with `role: 'ADMIN'`
3. Ensure password is hashed properly (currently using plain text for demo)
4. Run `window.resetData()` in browser console to reseed

Example:

```typescript
{
  id: generateUID(),
  name: 'Jane Admin',
  email: 'jane@admin.com',
  password: 'securepassword',
  role: 'ADMIN',
  studentId: 'N/A',
  points: 0,
  createdAt: new Date().toISOString()
}
```

---

## Security Considerations

### Access Control

- All admin functions check user role before execution
- Student users cannot access admin dashboard routes
- API methods verify admin role before sensitive operations

### Audit Trail

All admin actions create transaction records:

- **Point Approvals**: Transaction type "EARN" with description "Point request approved"
- **Point Adjustments**: Transaction type "EARN" (positive) or "REDEEM" (negative) with admin-provided reason
- **Reward Redemptions**: Transaction type "REDEEM" with reward details

### Data Validation

- All forms require valid inputs
- Points adjustments require reasons (minimum length check)
- Confirmation dialogs prevent accidental deletions
- Quantity checks prevent over-redemption of rewards

---

## Future Enhancements

### Potential Admin Features:

1. **User Management**: Block/unblock students, reset passwords
2. **Analytics Dashboard**: Charts showing point distribution, redemption trends
3. **Bulk Operations**: Adjust points for multiple students at once
4. **Export Reports**: Download transaction history as CSV/PDF
5. **Role Management**: Create custom admin roles with specific permissions
6. **Notification System**: Send announcements to all students
7. **Reward Categories**: Organize rewards by type (food, merchandise, experiences)
8. **Automated Rules**: Auto-approve requests meeting certain criteria
9. **Activity Logs**: View detailed audit logs of all admin actions
10. **Student Search/Filter**: Find students by name, ID, or points range

---

## Technical Architecture

### Component Hierarchy

```
AdminRewards (page)
├── Tab Navigation
├── PendingRequests (component)
│   └── Request approval logic
├── StudentPointsManagement (component)
│   └── Adjustment modal
└── Rewards Section
    └── RewardModal (component)
        ├── Create mode
        └── Edit mode
```

### State Management

- All admin components use local state (useState)
- Data persists in localStorage via mockApi
- No global state management (Redux/Context) currently used
- Re-fetches data after mutations for fresh state

### API Layer

All operations go through `src/lib/mockApi.ts`:

- Promise-based asynchronous operations
- Simulated network delays (300-700ms)
- Console logging for debugging
- Error handling with try-catch
- localStorage as persistence layer

---

## Testing Admin Features

### Manual Test Checklist

#### Point Requests

- [ ] Student submits point request
- [ ] Request appears in admin "Point Requests" tab
- [ ] Admin approves request → student receives points
- [ ] Admin rejects request → student receives notification
- [ ] Request disappears from pending list after action

#### Student Points Management

- [ ] All students visible in table
- [ ] Click "Adjust Points" opens modal
- [ ] Quick buttons (-50, -10, +10, +50) work correctly
- [ ] Positive adjustment adds points
- [ ] Negative adjustment subtracts points
- [ ] Reason field is required
- [ ] New balance preview is accurate
- [ ] Points balance updates after submission

#### Rewards Management

- [ ] Create new reward with all fields
- [ ] Reward appears in grid immediately
- [ ] Edit reward pre-fills form correctly
- [ ] Updated reward reflects changes
- [ ] Delete confirmation shows for delete action
- [ ] Reward removed after confirmation
- [ ] Students can redeem available rewards
- [ ] Quantity decreases after redemption

---

## Common Admin Tasks

### Scenario 1: Student Claims Points for Event Participation

1. Student fills out point request form: "Attended charity event - 50 points"
2. Admin navigates to "Point Requests" tab
3. Admin reviews request details
4. Admin clicks "✅ Approve"
5. Student receives 50 points
6. Transaction recorded in student's history

### Scenario 2: Correcting Accidental Point Award

1. Admin navigates to "Student Points" tab
2. Find the affected student in the table
3. Click "Adjust Points" button
4. Enter negative adjustment (e.g., -50)
5. Provide reason: "Correcting duplicate point award"
6. Click "Adjust Points"
7. Points deducted, transaction logged

### Scenario 3: Creating Limited-Time Reward

1. Admin navigates to "Rewards Management" tab
2. Click "+ Create Reward"
3. Fill in details:
   - Title: "Holiday Special: Premium Snack Pack"
   - Cost: 150 points
   - Quantity: 20
   - Description: "Available until Dec 31 only"
4. Click "Create Reward"
5. Reward appears immediately for students to redeem

### Scenario 4: Updating Out-of-Stock Reward

1. Admin notices a reward is running low
2. Click "✏️ Edit" on the reward card
3. Update quantity from 2 to 50 (restocked)
4. Optionally update description or cost
5. Click "Update Reward"
6. Changes saved, students see updated quantity

### Scenario 5: Removing Expired Reward

1. Admin identifies expired seasonal reward
2. Click "🗑️ Delete" on the reward card
3. Confirmation dialog appears
4. Admin confirms deletion
5. Reward removed from catalog
6. Past redemptions remain in transaction history

---

## Troubleshooting

### Issue: "Admin can't see pending requests"

**Solution**: Check that requests have status "PENDING". Approved/rejected requests are filtered out.

### Issue: "Point adjustment not working"

**Solutions**:

- Ensure reason field is filled in
- Check adjustment is not zero
- Verify admin is logged in (check localStorage `fb_session`)
- Check browser console for errors

### Issue: "Reward edit modal doesn't pre-fill"

**Solution**: Ensure `reward` prop is passed to RewardModal and useEffect dependency is set correctly.

### Issue: "Deleted reward still appears for students"

**Solution**:

- Refresh the page
- Check that mockApi.deleteReward() is being called
- Verify localStorage `dw_rewards` has been updated

### Issue: "Students not appearing in Student Points tab"

**Solutions**:

- Ensure users have role "STUDENT" (not "ADMIN")
- Check that seed data has been loaded (`window.resetData()`)
- Verify mockApi.getUsers() is fetching correctly

---

## API Reference

### mockApi.adjustUserPoints()

```typescript
adjustUserPoints(
  userId: string,        // Target student's ID
  adjustment: number,    // Positive (add) or negative (subtract)
  reason: string,        // Required audit reason
  adminId: string        // Admin performing the action
): Promise<void>
```

**Behavior**:

- Validates user exists
- Checks new balance wouldn't go negative
- Creates transaction record with:
  - Type: "EARN" (positive) or "REDEEM" (negative)
  - Amount: Absolute value of adjustment
  - Description: Admin's reason
  - Related user/admin IDs
- Updates user's points balance
- Saves to localStorage

**Error Handling**:

- Throws error if user not found
- Throws error if negative balance would result
- Throws error if reason is empty

---

### mockApi.deleteReward()

```typescript
deleteReward(rewardId: string): Promise<void>
```

**Behavior**:

- Filters out reward from rewards array
- Saves updated array to localStorage
- Does NOT delete related transactions (preserves history)

**Error Handling**:

- Silent if reward doesn't exist (idempotent)

---

### mockApi.updateReward()

```typescript
updateReward(
  rewardId: string,
  updatedReward: Reward
): Promise<void>
```

**Behavior**:

- Finds existing reward by ID
- Replaces entire reward object with updated data
- Preserves reward ID
- Saves to localStorage

**Error Handling**:

- Throws error if reward not found

---

## Data Models

### Transaction (for point adjustments)

```typescript
{
  id: string;
  userId: string;         // Student receiving adjustment
  type: 'EARN' | 'REDEEM';
  amount: number;         // Absolute value
  description: string;    // Admin's reason
  timestamp: string;      // ISO date string
  relatedEntityId?: string;  // Admin ID
  relatedEntityType?: 'admin' | 'reward' | 'request';
}
```

### Reward

```typescript
{
  id: string;
  title: string;
  description: string;
  cost: number; // Points required
  quantity: number; // Available stock
}
```

---

## Conclusion

The admin dashboard provides comprehensive tools for managing the student points ecosystem. With point request approval, direct balance adjustments, and full reward lifecycle management, administrators have complete control while maintaining transparency through audit trails.

For questions or feature requests, contact the development team.
