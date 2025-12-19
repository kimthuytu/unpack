# Git Practice Guide

This guide will walk you through common git operations step by step. Follow along and practice each command!

## Prerequisites
Make sure git is installed:
```bash
git --version
```

## Practice Session 1: Basic Git Operations

### Step 1: Initialize a Repository (if not already initialized)
```bash
cd /Users/thuy/Desktop/Unpack
git init
```

### Step 2: Check Status
```bash
git status
```
This shows you:
- Which files are tracked/untracked
- Which files have changes
- Current branch

### Step 3: Configure Git (if not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Add Files to Staging Area
```bash
# Add a specific file
git add README.md

# Add all files in current directory
git add .

# Add all files matching a pattern
git add *.md
```

### Step 5: Create Your First Commit
```bash
git commit -m "Initial commit: Add project files"
```

### Step 6: View Commit History
```bash
# View commit log
git log

# View compact log
git log --oneline

# View log with graph
git log --oneline --graph --all
```

## Practice Session 2: Working with Branches

### Step 1: Create a New Branch
```bash
git branch feature-practice
```

### Step 2: Switch to the Branch
```bash
git checkout feature-practice
# OR (newer syntax)
git switch feature-practice
```

### Step 3: Create and Switch in One Command
```bash
git checkout -b feature-practice
# OR
git switch -c feature-practice
```

### Step 4: List All Branches
```bash
git branch          # Local branches
git branch -a       # All branches (local + remote)
git branch -r       # Remote branches only
```

### Step 5: Make Changes and Commit
```bash
# Make a small change to a file
echo "# Practice Change" >> practice.txt
git add practice.txt
git commit -m "Add practice file"
```

### Step 6: Switch Back to Main Branch
```bash
git checkout main
# OR
git checkout master
```

### Step 7: Merge the Branch
```bash
git merge feature-practice
```

### Step 8: Delete the Branch
```bash
git branch -d feature-practice
```

## Practice Session 3: Undoing Changes

### Step 1: Unstage Files
```bash
git reset HEAD <file>
# OR (newer syntax)
git restore --staged <file>
```

### Step 2: Discard Changes in Working Directory
```bash
git checkout -- <file>
# OR (newer syntax)
git restore <file>
```

### Step 3: Amend Last Commit
```bash
# Make changes, then:
git add <file>
git commit --amend -m "Updated commit message"
```

### Step 4: Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Step 5: Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

## Practice Session 4: Working with Remotes

### Step 1: Add a Remote Repository
```bash
git remote add origin https://github.com/username/repo.git
```

### Step 2: View Remotes
```bash
git remote -v
```

### Step 3: Fetch from Remote
```bash
git fetch origin
```

### Step 4: Pull Changes
```bash
git pull origin main
```

### Step 5: Push Changes
```bash
git push origin main
```

### Step 6: Set Upstream Branch
```bash
git push -u origin main
```

## Practice Session 5: Advanced Operations

### Step 1: Stash Changes
```bash
# Save current changes temporarily
git stash

# List stashes
git stash list

# Apply stash
git stash apply

# Apply and remove stash
git stash pop

# Drop stash
git stash drop
```

### Step 2: View Differences
```bash
# See changes in working directory
git diff

# See staged changes
git diff --staged
# OR
git diff --cached

# See differences between commits
git diff HEAD~1 HEAD
```

### Step 3: Tagging
```bash
# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Version 1.0.0"

# List tags
git tag

# Push tags
git push origin v1.0.0
# OR push all tags
git push origin --tags
```

### Step 4: Rebase (Interactive)
```bash
# Rebase last 3 commits
git rebase -i HEAD~3
```

## Practice Session 6: Common Workflows

### Workflow 1: Feature Branch Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push branch to remote
git push -u origin feature/new-feature

# 4. Switch back to main and pull latest
git checkout main
git pull origin main

# 5. Merge feature branch
git merge feature/new-feature

# 6. Push merged changes
git push origin main

# 7. Delete feature branch
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### Workflow 2: Fixing Mistakes
```bash
# Scenario: Committed wrong file
git reset HEAD~1
# Fix the issue
git add correct-file.txt
git commit -m "Fixed: Add correct file"

# Scenario: Wrong commit message
git commit --amend -m "Correct commit message"

# Scenario: Forgot to add a file
git add forgotten-file.txt
git commit --amend --no-edit
```

## Practice Exercises

### Exercise 1: Basic Workflow
1. Create a new file called `practice.txt`
2. Add it to git
3. Commit it with message "Add practice file"
4. View the commit log

### Exercise 2: Branching
1. Create a branch called `practice-branch`
2. Switch to it
3. Modify `practice.txt`
4. Commit the change
5. Switch back to main
6. Merge the branch
7. Delete the branch

### Exercise 3: Undoing
1. Make a change to a file
2. Stage it with `git add`
3. Unstage it with `git reset`
4. Discard the change with `git restore`

### Exercise 4: Stashing
1. Make changes to a file
2. Stash the changes
3. Switch branches
4. Switch back
5. Apply the stash

## Quick Reference

| Task | Command |
|------|---------|
| Initialize repo | `git init` |
| Check status | `git status` |
| Add file | `git add <file>` |
| Commit | `git commit -m "message"` |
| View log | `git log` |
| Create branch | `git branch <name>` |
| Switch branch | `git checkout <name>` |
| Merge branch | `git merge <branch>` |
| Pull changes | `git pull` |
| Push changes | `git push` |
| View diff | `git diff` |
| Stash changes | `git stash` |
| View remotes | `git remote -v` |

## Tips

1. **Always check status first**: `git status` is your friend
2. **Commit often**: Small, frequent commits are better than large ones
3. **Write good commit messages**: Be descriptive and clear
4. **Pull before push**: Always pull latest changes before pushing
5. **Use branches**: Don't commit directly to main/master
6. **Review before commit**: Use `git diff` to see what you're committing

## Common Mistakes to Avoid

1. ❌ Committing directly to main/master
2. ❌ Not pulling before pushing
3. ❌ Vague commit messages
4. ❌ Committing too many changes at once
5. ❌ Forgetting to add files before committing
6. ❌ Using `git reset --hard` without being sure

## Next Steps

Once you're comfortable with these basics, explore:
- Git hooks
- Git submodules
- Git rebase workflows
- Git bisect (for finding bugs)
- Git cherry-pick
- GitHub/GitLab specific features (Pull Requests, Issues, etc.)

Happy practicing! 🚀


