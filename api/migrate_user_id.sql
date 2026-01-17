-- SQL Migration: Populate user_id for existing todos
-- Run this in your PostgreSQL database (Neon console or psql)

-- Step 1: Check current state
SELECT
    COUNT(*) as total_todos,
    COUNT(user_id) as todos_with_user_id,
    COUNT(*) - COUNT(user_id) as todos_without_user_id
FROM todos;

-- Step 2: Get the first user ID from Better Auth
-- (You'll need to get this from web/auth.db)
-- Example user_id: aGRzkzQOC5zrmPkVnnC9EAcw92UbSkyp

-- Step 3: Update todos with NULL user_id
-- Replace 'YOUR_USER_ID_HERE' with actual user ID from Better Auth database
UPDATE todos
SET user_id = 'aGRzkzQOC5zrmPkVnnC9EAcw92UbSkyp'  -- Replace with your user ID
WHERE user_id IS NULL;

-- Step 4: Verify the update
SELECT
    COUNT(*) as total_todos,
    COUNT(user_id) as todos_with_user_id,
    COUNT(*) - COUNT(user_id) as todos_without_user_id
FROM todos;

-- Step 5: Check todos by user
SELECT user_id, COUNT(*) as todo_count
FROM todos
GROUP BY user_id;
