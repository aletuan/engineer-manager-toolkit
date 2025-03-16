# Database Design Documentation

## Overview
This document outlines the database schema design for the Engineer Manager Toolkit application. The design focuses on managing squads, tasks, stakeholders, and incident rotations effectively.

## Core Entities

### User
```sql
Users {
  id: uuid [pk]
  email: varchar [unique]
  password_hash: varchar
  created_at: timestamp
  updated_at: timestamp
}
```

### Squad
```sql
Squads {
  id: uuid [pk]
  name: varchar
  code: varchar [unique]
  description: text [null]
  created_at: timestamp
  updated_at: timestamp
}
```

### SquadMember
```sql
SquadMembers {
  id: uuid [pk]
  squad_id: uuid [ref: > Squads.id]
  user_id: uuid [ref: > Users.id, unique]
  pid: varchar [unique]
  full_name: varchar
  email: varchar [unique]
  phone: varchar [null]
  position: varchar [null]
  avatar_url: varchar [null]
  status: enum [ACTIVE, INACTIVE, ON_LEAVE]
  created_at: timestamp
  updated_at: timestamp
}
```

### Task
```sql
Tasks {
  id: uuid [pk]
  title: varchar
  description: text
  status: enum [TODO, IN_PROGRESS, DONE]
  priority: enum [LOW, MEDIUM, HIGH]
  due_date: timestamp
  feature_id: varchar
  assigned_to_id: uuid [ref: > SquadMembers.id]
  created_by_id: uuid [ref: > SquadMembers.id]
  tags: varchar[]
  attachments: jsonb
  created_at: timestamp
  updated_at: timestamp
}
```

### TaskComment
```sql
TaskComments {
  id: uuid [pk]
  content: text
  task_id: uuid [ref: > Tasks.id]
  created_by_id: uuid [ref: > SquadMembers.id]
  created_at: timestamp
}
```

### TaskNote
```sql
TaskNotes {
  id: uuid [pk]
  content: text
  task_id: uuid [ref: > Tasks.id]
  author_id: uuid [ref: > SquadMembers.id]
  created_at: timestamp
  updated_at: timestamp
}
```

### TaskAssignee
```sql
TaskAssignees {
  id: uuid [pk]
  task_id: uuid [ref: > Tasks.id]
  member_id: uuid [ref: > SquadMembers.id]
  role: enum [PRIMARY, SECONDARY, REVIEWER]
  created_at: timestamp
}
```

### TaskStakeholder
```sql
TaskStakeholders {
  id: uuid [pk]
  task_id: uuid [ref: > Tasks.id]
  stakeholder_id: uuid [ref: > Stakeholders.id]
  created_at: timestamp
}
```

### TaskDependency
```sql
TaskDependencies {
  id: uuid [pk]
  task_id: uuid [ref: > Tasks.id]
  dependent_task_id: uuid [ref: > Tasks.id]
  dependency_type: enum [BLOCKS, BLOCKED_BY, RELATES_TO]
  created_at: timestamp
}
```

### Stakeholder
```sql
Stakeholders {
  id: uuid [pk]
  code: varchar [unique]
  name: varchar
  description: text [null]
  contact_name: varchar [null]
  contact_email: varchar [null]
  contact_phone: varchar [null]
  group_name: varchar [null]
  created_at: timestamp
  updated_at: timestamp
}
```

### Role
```sql
Roles {
  id: uuid [pk]
  name: varchar [unique]
  description: text [null]
  permissions: varchar[]
  created_at: timestamp
  updated_at: timestamp
}
```

### RoleAssignment
```sql
RoleAssignments {
  id: uuid [pk]
  squad_id: uuid [ref: > Squads.id]
  member_id: uuid [ref: > SquadMembers.id]
  role_id: uuid [ref: > Roles.id]
  assigned_by: varchar
  created_at: timestamp
  updated_at: timestamp
}
```

### IncidentRotation
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

### RotationSwap
```sql
RotationSwaps {
  id: uuid [pk]
  rotation_id: uuid [ref: > IncidentRotations.id]
  requester_id: uuid [ref: > SquadMembers.id]
  accepter_id: uuid [ref: > SquadMembers.id]
  swap_date: timestamp
  status: varchar
  created_at: timestamp
  updated_at: timestamp
}
```

### SprintReport
```sql
SprintReports {
  id: uuid [pk]
  squad_id: uuid [ref: > Squads.id]
  sprint_number: integer
  start_date: timestamp
  end_date: timestamp
  total_points: integer
  completed_points: integer
  member_metrics: jsonb
  stakeholder_metrics: jsonb
  created_at: timestamp
}
```

### ActivityLog
```sql
ActivityLogs {
  id: uuid [pk]
  user_id: uuid [ref: > Users.id]
  entity_type: varchar
  entity_id: varchar
  action: varchar
  details: jsonb
  created_at: timestamp
}
```

## Relationships

### User
- One-to-One with SquadMember

### Squad
- One-to-Many with SquadMember
- One-to-Many with IncidentRotation
- One-to-Many with SprintReport
- One-to-Many with RoleAssignment

### SquadMember
- Many-to-One with Squad
- Many-to-One with User
- One-to-Many with Task (assignedTo)
- One-to-Many with Task (createdBy)
- One-to-Many with TaskComment
- One-to-Many with TaskNote
- One-to-Many with TaskAssignee
- One-to-Many with IncidentRotation (primaryMember)
- One-to-Many with IncidentRotation (secondaryMember)
- One-to-Many with RotationSwap (requester)
- One-to-Many with RotationSwap (accepter)
- One-to-Many with RoleAssignment

### Task
- Many-to-One with SquadMember (assignedTo)
- Many-to-One with SquadMember (createdBy)
- One-to-Many with TaskComment
- One-to-Many with TaskNote
- One-to-Many with TaskAssignee
- One-to-Many with TaskStakeholder
- One-to-Many with TaskDependency (task)
- One-to-Many with TaskDependency (dependentTask)

### TaskComment
- Many-to-One with Task
- Many-to-One with SquadMember

### TaskNote
- Many-to-One with Task
- Many-to-One with SquadMember

### TaskAssignee
- Many-to-One with Task
- Many-to-One with SquadMember

### TaskStakeholder
- Many-to-One with Task
- Many-to-One with Stakeholder

### TaskDependency
- Many-to-One with Task (task)
- Many-to-One with Task (dependentTask)

### Stakeholder
- One-to-Many with TaskStakeholder

### Role
- One-to-Many with RoleAssignment

### RoleAssignment
- Many-to-One with Squad
- Many-to-One with SquadMember
- Many-to-One with Role

### IncidentRotation
- Many-to-One with Squad
- Many-to-One with SquadMember (primaryMember)
- Many-to-One with SquadMember (secondaryMember)
- One-to-Many with RotationSwap

### RotationSwap
- Many-to-One with IncidentRotation
- Many-to-One with SquadMember (requester)
- Many-to-One with SquadMember (accepter)

### SprintReport
- Many-to-One with Squad

### ActivityLog
- Many-to-One with User

## Indices

### User
- `email` (unique)

### Squad
- `code` (unique)

### SquadMember
- `squad_id`
- `user_id` (unique)
- `pid` (unique)
- `email` (unique)

### Task
- `assigned_to_id`
- `created_by_id`
- `feature_id`

### TaskComment
- `task_id`
- `created_by_id`

### TaskNote
- `task_id`
- `author_id`

### TaskAssignee
- `task_id`
- `member_id`

### TaskStakeholder
- `task_id`
- `stakeholder_id`

### TaskDependency
- `task_id`
- `dependent_task_id`

### Stakeholder
- `code` (unique)

### Role
- `name` (unique)

### RoleAssignment
- `squad_id`
- `member_id`
- `role_id`

### IncidentRotation
- `squad_id`
- `primary_member_id`
- `secondary_member_id`

### RotationSwap
- `rotation_id`
- `requester_id`
- `accepter_id`

### SprintReport
- `squad_id`

### ActivityLog
- `user_id`

## Future Considerations
1. Partitioning strategy for large tables (e.g., ActivityLogs)
2. Archival strategy for historical data
3. Caching strategy for frequently accessed data
4. Backup and recovery procedures
5. Data retention policies 