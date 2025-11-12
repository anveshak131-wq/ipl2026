#!/bin/bash
# IPL Teams Manager v2 - Pre-Deployment Verification Script
# Checks that all required files exist and have proper content

echo "🔍 IPL Teams Manager v2 - Verification Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0
WARNINGS=0

# Function to check file exists
check_file() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description ($file)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $description ($file) - MISSING"
        ((FAILED++))
    fi
}

# Function to check directory exists
check_dir() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description ($dir)"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $description ($dir) - MISSING"
        ((FAILED++))
    fi
}

# Function to check file size
check_size() {
    local file=$1
    local min_size=$2
    local description=$3
    
    if [ -f "$file" ]; then
        local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$size" -gt "$min_size" ]; then
            echo -e "${GREEN}✓${NC} $description (${size} bytes)"
            ((PASSED++))
        else
            echo -e "${RED}✗${NC} $description - File too small (${size} bytes)"
            ((FAILED++))
        fi
    fi
}

echo "📂 Checking HTML Files..."
check_file "index.html" "Homepage"
check_file "team.html" "Team detail page"
echo ""

echo "🎨 Checking CSS Files..."
check_dir "css" "CSS directory"
check_file "css/styles.css" "Global styles"
check_file "css/teams.css" "Teams styling"
check_file "css/team-page.css" "Team page styling"
echo ""

echo "📜 Checking JavaScript Files..."
check_dir "js" "JavaScript directory"
check_file "js/data-manager.js" "Data management module"
check_file "js/ui-renderer.js" "UI rendering module"
check_file "js/app.js" "Application logic"
echo ""

echo "⚙️ Checking Configuration Files..."
check_file "wrangler.toml" "Cloudflare Pages config"
check_file ".gitignore" "Git ignore rules"
check_file "package.json" "NPM package config"
echo ""

echo "🚀 Checking Deployment Files..."
check_dir ".github" "GitHub workflows directory"
check_file ".github/workflows/deploy.yml" "GitHub Actions workflow"
echo ""

echo "📚 Checking Documentation..."
check_file "README.md" "User guide"
check_file "DEVELOPER.md" "Developer reference"
check_file "QUICKSTART.md" "Quick start guide"
check_file "INSTALL.md" "Installation guide"
check_file "PROJECT_STATUS.md" "Project status"
check_file "INDEX.md" "Documentation index"
echo ""

echo "📏 Checking File Sizes..."
check_size "css/styles.css" 20000 "styles.css (should be >20KB)"
check_size "css/teams.css" 15000 "teams.css (should be >15KB)"
check_size "js/data-manager.js" 10000 "data-manager.js (should be >10KB)"
check_size "js/ui-renderer.js" 8000 "ui-renderer.js (should be >8KB)"
check_size "js/app.js" 12000 "app.js (should be >12KB)"
echo ""

echo "🔐 Checking HTML Content..."
if grep -q "id=\"teamsGrid\"" index.html; then
    echo -e "${GREEN}✓${NC} Teams grid container found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Teams grid container NOT found"
    ((FAILED++))
fi

if grep -q "id=\"adminLink\"" index.html; then
    echo -e "${GREEN}✓${NC} Admin link found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Admin link NOT found"
    ((FAILED++))
fi

if grep -q "id=\"adminModal\"" index.html; then
    echo -e "${GREEN}✓${NC} Admin modal found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Admin modal NOT found"
    ((FAILED++))
fi
echo ""

echo "🔐 Checking JavaScript Content..."
if grep -q "class DataManager" js/data-manager.js; then
    echo -e "${GREEN}✓${NC} DataManager class found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} DataManager class NOT found"
    ((FAILED++))
fi

if grep -q "class UIRenderer" js/ui-renderer.js; then
    echo -e "${GREEN}✓${NC} UIRenderer class found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} UIRenderer class NOT found"
    ((FAILED++))
fi

if grep -q "class App" js/app.js; then
    echo -e "${GREEN}✓${NC} App class found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} App class NOT found"
    ((FAILED++))
fi
echo ""

echo "🎨 Checking CSS Variables..."
if grep -q "--color-primary:" css/styles.css; then
    echo -e "${GREEN}✓${NC} CSS variables defined"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} CSS variables NOT found"
    ((FAILED++))
fi

if grep -q "--mi-color:" css/teams.css; then
    echo -e "${GREEN}✓${NC} Team colors defined"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Team colors NOT found"
    ((FAILED++))
fi
echo ""

echo "📦 Checking Dependencies..."
if ! grep -q "\"dependencies\"" package.json || grep -q "\"dependencies\": {}" package.json; then
    echo -e "${GREEN}✓${NC} No external dependencies (as expected)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} External dependencies found"
    ((WARNINGS++))
fi
echo ""

# Summary
echo "=============================================="
echo "📊 Verification Summary"
echo "=============================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed:${NC} $FAILED"
fi
if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix before deployment.${NC}"
    exit 1
fi
