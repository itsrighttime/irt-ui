# 1. INPUT (what you feed into `buildWorkspace`)

The entry point is:

```ts
buildWorkspace(root, activePath, memory)
```

So the input has **3 parts**:

## A. `root: WorkspaceNode[]`

This is your **full navigation tree**.

Each node looks like:

```ts
{
  id: "home",
  tab: TabConfig,
  route?: "/home",
  children?: WorkspaceNode[],
  layout?: {
    role?: "primary" | "secondary" | "tertiary",
    axis?: "horizontal" | "vertical",
    weight?: number
  }
}
```

### Think of it as:

A **nested menu / app structure**

Example:

```
home
 ├── dashboard
 ├── analytics
 └── settings
```

## B. `activePath: string[]`

This is the **current navigation path (like breadcrumbs)**.

Example:

```ts
["home", "dashboard", "reports"]
```

Meaning:

> User is currently inside `home → dashboard → reports`

## C. `memory: LayoutMemory`

This is your **behavior history engine**:

```ts
{
  visits: { nodeId: number },
  lastVisitedAt: { nodeId: timestamp },
  transitions: { fromId: { toId: count } }
}
```

### It answers:

* How often did user open this node?
* When was it last used?
* How does user move between nodes?

# 2. PROCESSING PIPELINE (what happens inside)

## Step 1 — `resolvePath()`

```ts
const chain = resolvePath(root, activePath);
```

### Output: `chain`

This extracts the **actual node chain along the active path**.

Example:

If path is:

```ts
["home", "dashboard"]
```

Output:

```ts
[
  homeNode,
  dashboardNode
]
```

## Step 2 — `collectVisibleNodes(chain)`

```ts
const visible = collectVisibleNodes(chain);
```

### Output: `visible nodes`

This expands beyond the path:

It includes:

* Nodes in the current path
* PLUS their siblings

### So instead of just:

```
home → dashboard
```

You get:

```
home
 ├── dashboard
 ├── analytics   ← siblings included
 └── settings    ← siblings included
```

👉 This is how the UI gets “context-aware navigation”

## Step 3 — `scoreNode()`

Each node gets a **priority score**:

```ts
score += structure priority
score += role importance
score += usage frequency
score += recency boost
```

### Example scoring logic:

* deeper nodes → lower score
* `primary` role → +50
* frequently used → higher score
* recently used → boosted

## Step 4 — `assignRegions()`

Nodes are bucketed into layout regions:

```ts
primary
secondary
tertiary
sidebar
```

Based on score thresholds:

```ts
> 120 → primary
> 80  → secondary
> 50  → tertiary
else → sidebar
```

## Step 5 — `toWorkspaceConfig()`

This converts regions into UI config:

### Output shape:

```ts
WorkspaceConfig = {
  topPrimary,
  topSecondary,
  leftPrimary,
  leftSidebar
}
```

### Example mapping:

| Region    | UI Slot      |
| --------- | ------------ |
| primary   | topPrimary   |
| secondary | topSecondary |
| tertiary  | leftPrimary  |
| sidebar   | leftSidebar  |

## Step 6 — `buildTransitionPlan()`

Compares **previous vs next visible nodes**.

It outputs actions:

```ts
enter   → new node appeared
exit    → node removed
move    → changed position
update  → same node updated
```

⚠️ In your current code:

```ts
buildTransitionPlan(visible, visible)
```

So:
👉 it always compares itself → so transitions are meaningless right now (always “update/no-op-like” behavior)

# 3. OUTPUT (what you get back)

Final return:

```ts
{
  config,
  transition
}
```

## A. `config: WorkspaceConfig`

This is the **UI layout configuration**

Example:

```ts
{
  topPrimary: {
    start: [TabConfig, TabConfig]
  },
  topSecondary: {
    start: [...]
  },
  leftSidebar: [
    SidebarItem,
    SidebarItem
  ]
}
```

### Meaning:

This is what renders your app layout:

* top bar tabs
* sidebars
* grouped navigation

## B. `transition: TransitionPlan`

Example:

```ts
{
  moves: [
    {
      id: "dashboard",
      action: "enter",
      to: "primary"
    }
  ]
}
```

This is used for:

* animations
* UI diffing
* smooth layout transitions

# 4. BIG PICTURE (how it works conceptually)

You can think of the system as:

```
TREE (root)
   ↓
PATH (activePath)
   ↓
VISIBLE CONTEXT (chain + siblings)
   ↓
SCORING ENGINE (memory + structure)
   ↓
REGION ASSIGNMENT (primary/sidebar/etc)
   ↓
UI CONFIG (WorkspaceConfig)
   ↓
RENDERED WORKSPACE
```

# 5. SIMPLE ANALOGY

Think of it like a smart OS launcher:

* `root` = all apps installed
* `activePath` = where you currently are
* `memory` = your habits
* system decides:

  * which apps go in dock (primary)
  * which go in side menu (sidebar)
  * which are less important (tertiary)

Then outputs:

> “Here is your dynamically arranged desktop UI”

If you want, I can also:

* visualize this as a diagram
* or point out architectural issues (there are a few important ones, especially transition + scoring depth bug)
* or suggest improvements for real-world scalability
