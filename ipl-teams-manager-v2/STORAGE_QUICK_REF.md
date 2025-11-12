# ⚡ Data Storage - Quick Answer

## Where is Data Stored?

### **In-Memory XML** (Browser RAM)

```
File: js/data-manager.js
Location: window.sharedDataManager.xmlDoc
Type: DOM Parser XML object
```

---

## Storage Breakdown

| Item | Location | When Lost |
|------|----------|-----------|
| Teams | XML in memory | Page refresh |
| Players added | XML in memory | Page refresh |
| Form data | Browser RAM | Page refresh |
| Export files | Your downloads | Manual delete |

---

## Important ⚠️

❌ **NOT saved to:**
- Database
- Server
- Files
- Cloud

✅ **ONLY in:**
- Browser memory
- Active session

---

## How to Save Data

```
1. Add players in admin panel
2. Go to Export/Debug tab
3. Click "Export XML" or "Export JSON"
4. File downloads to your computer
5. Keep the file for later
```

---

## Data Flow

```
Add Player → Stored in XML object → Display in UI
              ↓ (Page refresh)
          All data lost ❌
```

---

**See `DATA_STORAGE_GUIDE.md` for complete details!**
