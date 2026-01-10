# XP Backend Sync Implementation

## Overview
This document describes the implementation of real-time XP synchronization between the frontend and backend, enabling the leaderboard to update continuously/dynamically as players earn XP.

## Problem Statement
Previously, player XP was only stored in localStorage (frontend), which meant:
- The leaderboard displayed stale data from the backend database
- Players' XP changes weren't reflected in real-time on the leaderboard
- No synchronization between frontend state and backend database

## Solution

### 1. Backend API Update (`backend/app.py`)
**Modified the `/api/addxp` endpoint:**
- Changed from URL parameter (`/api/addxp/<int:xp>`) to request body
- Now accepts `user_id` and `xp` (delta) in the request body
- Properly calculates new XP by fetching current XP and adding delta
- Ensures XP never goes negative with `max(0, current_xp + xp_delta)`

```python
@app.route("/api/addxp", methods=["POST"])
def add_xp():
    data = request.json
    user_id = data.get("user_id")
    xp_delta = data.get("xp", 0)
    
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    
    try:
        # Get current XP
        resp = supabase.table("profiles").select("xp").eq("id", user_id).single().execute()
        current_xp = resp.data["xp"] if resp.data else 0
        new_xp = max(0, current_xp + xp_delta)

        # Update XP in database
        supabase.table("profiles").update({
            "xp": new_xp
        }).eq("id", user_id).execute()

        return jsonify({"xp": new_xp}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
```

### 2. Frontend API Update (`lib/api.ts`)
**Updated the `addXP` function:**
- Now accepts `userId` and `xp` parameters
- Sends data in request body instead of URL
- Matches the new backend API structure

```typescript
export async function addXP(userId: string, xp: number): Promise<{ xp: number }> {
  const response = await fetch(`${API_BASE_URL}/api/addxp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, xp }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to add XP");
  }

  return await response.json();
}
```

### 3. Level Components Update
**Modified all level components (`Level1.tsx`, `Level3.tsx`, `Level4.tsx`):**
- Updated `handleXpChange` to sync XP to backend
- Uses "fire and forget" pattern to avoid blocking UI
- Dynamic import to prevent circular dependencies
- Maintains local state and localStorage for immediate UI updates

```typescript
const handleXpChange = useCallback(async (delta: number) => {
  if (levelCompleted) {
    return;
  }

  setXp(prev => {
    const newXp = Math.max(0, prev + delta);
    
    const storedUser = localStorage.getItem('finstinct-user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.xp = newXp;
      localStorage.setItem('finstinct-user', JSON.stringify(user));
      
      // Sync to backend (fire and forget - don't block UI)
      import('@/lib/api').then(({ addXP }) => {
        addXP(user.user_id, delta).catch(err => {
          console.error('Failed to sync XP to backend:', err);
        });
      });
    }
    
    return newXp;
  });
}, [levelCompleted]);
```

### 4. Auto-Refresh Leaderboard
**Added polling to dashboard and leaderboard pages:**
- Fetches leaderboard data every 10 seconds
- Updates only the leaderboard state (not entire page)
- Properly cleans up interval on component unmount

```typescript
// Set up polling to refresh leaderboard every 10 seconds
const intervalId = setInterval(() => {
  const refreshLeaderboard = async () => {
    try {
      const leaderboardRes = await fetch(`${API_BASE_URL}/api/leaderboard`);
      if (!leaderboardRes.ok) return;
      
      const leaderboardData = await leaderboardRes.json();
      const formattedLeaderboard: LeaderboardEntry[] = leaderboardData.map(
        (entry: any, index: number) => ({
          name: entry.username,
          xp: entry.xp,
          leaderboard_position: index + 1,
        })
      );
      
      if (isMounted) {
        setLeaderboard(formattedLeaderboard);
      }
    } catch (err) {
      console.error("Failed to refresh leaderboard:", err);
    }
  };
  
  refreshLeaderboard();
}, 10000); // Refresh every 10 seconds

return () => {
  isMounted = false;
  clearInterval(intervalId);
};
```

## Files Modified

### Backend
- `backend/app.py` - Updated `/api/addxp` endpoint

### Frontend
- `lib/api.ts` - Updated `addXP` function signature
- `components/Level1.tsx` - Added backend sync to `handleXpChange`
- `components/Level3.tsx` - Added backend sync to `handleXpChange`
- `components/Level4.tsx` - Added backend sync to `handleXpChange`
- `app/dashboard/page.tsx` - Added auto-refresh polling
- `app/leaderboard/page.tsx` - Added auto-refresh polling

## How It Works

1. **Player earns XP in a game:**
   - Game component calls `onXpChange(delta)`
   - Level component updates local state immediately (for instant UI feedback)
   - Level component updates localStorage (for persistence)
   - Level component calls backend API asynchronously (for database sync)

2. **Backend updates database:**
   - Receives `user_id` and `xp` delta
   - Fetches current XP from database
   - Calculates new XP
   - Updates database with new XP value

3. **Leaderboard updates:**
   - Every 10 seconds, dashboard and leaderboard pages poll the backend
   - Fetch latest leaderboard data
   - Update UI with new rankings
   - Players see real-time changes in rankings

## Benefits

1. **Real-time Updates:** Leaderboard reflects XP changes within 10 seconds
2. **No Page Refresh:** Players don't need to refresh the page to see updated rankings
3. **Data Consistency:** XP is synchronized between frontend and backend
4. **Smooth UX:** XP updates don't block the UI (fire and forget pattern)
5. **Error Handling:** Failed backend syncs are logged but don't break the game

## Future Improvements

1. **WebSocket Integration:** Replace polling with WebSocket for true real-time updates
2. **Optimistic Updates:** Show leaderboard changes immediately before backend confirms
3. **Retry Logic:** Add exponential backoff for failed XP sync attempts
4. **Batch Updates:** Combine multiple XP changes into a single API call
5. **Rate Limiting:** Prevent excessive API calls during rapid XP changes
