# Database Design Documentation

## Overview
This document outlines the database schema design for the Engineer Manager Toolkit application. The design focuses on managing squads, tasks, stakeholders, and incident rotations effectively.

## Core Entities

### Users
```sql
Users {
  id: uuid [pk]
  email: varchar [unique]
  password_hash: varchar
  created_at: timestamp
  updated_at: timestamp
}
```

### Squads
```sql
Squads {
  id: uuid [pk]
  name: varchar
  code: varchar [unique] -- e.g., "SONIC", "TROY"
  description: text
  created_at: timestamp
  updated_at: timestamp
}
```

### SquadMembers
```sql
SquadMembers {
  id: uuid [pk]
  squad_id: uuid [ref: > Squads.id]
  user_id: uuid [ref: > Users.id]
  pid: varchar [unique] -- employee ID
  full_name: varchar
  email: varchar
  phone: varchar
  position: varchar
  avatar_url: varchar
  status: enum [active, inactive]
  created_at: timestamp
  updated_at: timestamp
}
```

### Stakeholders
```sql
Stakeholders {
  id: uuid [pk]
  code: varchar [unique] -- e.g., "FRAUD", "BEB", "ECOM"
  name: varchar
  description: text
  contact_name: varchar
  contact_email: varchar
  contact_phone: varchar
  group_name: varchar -- e.g., "Business", "Technical", "Operations"
  created_at: timestamp
  updated_at: timestamp
}
```

### Tasks
```sql
Tasks {
  id: uuid [pk]
  feature_id: varchar
  title: varchar
  description: text
  start_date: timestamp
  end_date: timestamp
  points: integer
  priority: enum [high, medium, low]
  status: enum [not_started, in_progress, completed, blocked]
  progress: integer -- 0-100
  created_by: uuid [ref: > Users.id]
  squad_id: uuid [ref: > Squads.id]
  created_at: timestamp
  updated_at: timestamp
}
```

### TaskStakeholders
```sql
TaskStakeholders {
  task_id: uuid [ref: > Tasks.id]
  stakeholder_id: uuid [ref: > Stakeholders.id]
  created_at: timestamp
}
```

## Supporting Entities

### TaskAssignees
```sql
TaskAssignees {
  task_id: uuid [ref: > Tasks.id]
  member_id: uuid [ref: > SquadMembers.id]
  role: enum [primary, secondary]
  created_at: timestamp
}
```

### TaskDependencies
```sql
TaskDependencies {
  task_id: uuid [ref: > Tasks.id]
  dependent_task_id: uuid [ref: > Tasks.id]
  dependency_type: enum [blocks, blocked_by]
  created_at: timestamp
}
```

### TaskNotes
```sql
TaskNotes {
  id: uuid [pk]
  task_id: uuid [ref: > Tasks.id]
  author_id: uuid [ref: > Users.id]
  content: text
  created_at: timestamp
  updated_at: timestamp
}
```

### IncidentRotations
```sql
IncidentRotations {
  id: uuid [pk]
  squad_id: uuid [ref: > Squads.id]
  primary_member_id: uuid [ref: > SquadMembers.id]
  secondary_member_id: uuid [ref: > SquadMembers.id]
  start_date: timestamp
  end_date: timestamp
  sprint_number: integer
  created_at: timestamp
}
```

### RotationSwaps
```sql
RotationSwaps {
  id: uuid [pk]
  rotation_id: uuid [ref: > IncidentRotations.id]
  requester_id: uuid [ref: > SquadMembers.id]
  accepter_id: uuid [ref: > SquadMembers.id]
  swap_date: timestamp
  status: enum [pending, approved, rejected]
  created_at: timestamp
  updated_at: timestamp
}
```

## Monitoring & Analytics

### ActivityLogs
```sql
ActivityLogs {
  id: uuid [pk]
  user_id: uuid [ref: > Users.id]
  entity_type: varchar -- e.g., "Task", "SquadMember"
  entity_id: uuid
  action: varchar -- e.g., "create", "update", "delete"
  details: jsonb
  created_at: timestamp
}
```

### SprintReports
```sql
SprintReports {
  id: uuid [pk]
  squad_id: uuid [ref: > Squads.id]
  sprint_number: integer
  start_date: timestamp
  end_date: timestamp
  total_points: integer
  completed_points: integer
  member_metrics: jsonb -- Detailed metrics per member
  stakeholder_metrics: jsonb -- Metrics per stakeholder
  created_at: timestamp
}
```

## Indexes and Constraints

### Primary Keys
- All tables use UUID as primary keys for better distribution and scalability
- UUIDs also make it easier to merge data from different environments

### Foreign Keys
- All relationships are enforced through foreign key constraints
- Cascade delete is not used to prevent accidental data loss
- Use soft deletes where appropriate

### Unique Constraints
- `Users.email`
- `Squads.code`
- `SquadMembers.pid`
- `Stakeholders.code`

### Indexes
To be added:
- Indexes on foreign key columns
- Indexes on frequently queried columns
- Composite indexes for common query patterns

## Future Considerations
1. Partitioning strategy for large tables (e.g., ActivityLogs)
2. Archival strategy for historical data
3. Caching strategy for frequently accessed data
4. Backup and recovery procedures
5. Data retention policies 