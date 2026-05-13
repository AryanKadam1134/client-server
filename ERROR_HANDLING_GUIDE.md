# Error Handling Implementation Guide

## Quick Reference

This guide explains how error handling with notifications is implemented throughout the Portfolio SAAS project.

## The Pattern

```javascript
import { useNotify } from "../../../context/NotificationContext";

export default function MyComponent() {
  const { notify } = useNotify();

  const myAsyncFunction = async () => {
    try {
      // Attempt operation
      const res = await apiEndpoints.someOperation();
      
      // Show success
      notify.msgSuccess("Operation Successful!");
    } catch (error) {
      // Log for debugging
      console.error("Error occurred: ", error);
      
      // Extract error message and show to user
      const errorMessage = error?.message || "Operation failed";
      notify.msgError(errorMessage);
    }
  };
}
```

## API Error Format

The backend returns errors in this format:

```javascript
{
  message: "User with this email already exists",
  statusCode: 409,
  error: "Conflict"
}
```

The frontend extracts `message` automatically.

## Error Message Guidelines

When adding new operations, use this pattern:

### For Create Operations
```javascript
catch (error) {
  const errorMessage = error?.message || "Failed to create item";
  notify.msgError(errorMessage);
}
```

### For Update Operations
```javascript
catch (error) {
  const errorMessage = error?.message || "Failed to update item";
  notify.msgError(errorMessage);
}
```

### For Delete Operations
```javascript
catch (error) {
  const errorMessage = error?.message || "Failed to delete item";
  notify.msgError(errorMessage);
}
```

### For Fetch/Load Operations
```javascript
catch (error) {
  const errorMessage = error?.message || "Failed to load item";
  notify.msgError(errorMessage);
}
```

### For File Upload Operations
```javascript
catch (error) {
  const errorMessage = error?.message || "Failed to upload file";
  notify.msgError(errorMessage);
}
```

## Full Working Example

Here's a complete example with proper error handling:

```javascript
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { apiEndpoints } from "../../../api";
import { useNotify } from "../../../context/NotificationContext";

export default function MyForm() {
  const { notify } = useNotify();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiEndpoints.getData();
      // Process data
      console.log("Data fetched:", res.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      const errorMessage = error?.message || "Failed to load data";
      notify.msgError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Create item
  const onCreate = async (formData) => {
    try {
      const res = await apiEndpoints.createItem(formData);
      notify.msgSuccess("Item created successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error("Error creating item: ", error);
      const errorMessage = error?.message || "Failed to create item";
      notify.msgError(errorMessage);
    }
  };

  // Update item
  const onUpdate = async (id, formData) => {
    try {
      const res = await apiEndpoints.updateItem(id, formData);
      notify.msgSuccess("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item: ", error);
      const errorMessage = error?.message || "Failed to update item";
      notify.msgError(errorMessage);
    }
  };

  // Delete item
  const onDelete = async (id) => {
    try {
      await apiEndpoints.deleteItem(id);
      notify.msgSuccess("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item: ", error);
      const errorMessage = error?.message || "Failed to delete item";
      notify.msgError(errorMessage);
    }
  };

  // File upload
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await apiEndpoints.uploadFile(formData);
      notify.msgSuccess("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file: ", error);
      const errorMessage = error?.message || "Failed to upload file";
      notify.msgError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onCreate)}>
      {/* Form fields */}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

## Notification Methods

```javascript
const { notify } = useNotify();

// Simple notifications (auto-dismiss in 2 seconds)
notify.msgSuccess("Operation successful!");
notify.msgError("Operation failed!");
notify.msgWarning("Warning message");
notify.msgInfo("Info message");

// Detailed notifications (appear in bottom-right, auto-dismiss in 3 seconds)
notify.success(
  "Success Title",
  "More detailed description of success",
  null,  // icon (optional)
  {}     // config (optional)
);

notify.error(
  "Error Title", 
  "More detailed error description",
  null,  // icon (optional)
  {}     // config (optional)
);
```

## Best Practices

### DO ✅

1. **Always extract the error message**
   ```javascript
   const errorMessage = error?.message || "Operation failed";
   notify.msgError(errorMessage);
   ```

2. **Provide context-specific default messages**
   ```javascript
   // Good - tells user what operation failed
   const errorMessage = error?.message || "Failed to update profile";
   
   // Bad - too generic
   const errorMessage = error?.message || "Error";
   ```

3. **Log to console for debugging**
   ```javascript
   catch (error) {
     console.error("Failed operation: ", error);
     // Then show to user
   }
   ```

4. **Handle finally blocks properly**
   ```javascript
   try {
     // operation
   } catch (error) {
     // show error
   } finally {
     setLoading(false); // Always reset state
   }
   ```

### DON'T ❌

1. **Don't show raw error objects**
   ```javascript
   // Bad - confuses users
   notify.msgError(JSON.stringify(error));
   ```

2. **Don't ignore errors**
   ```javascript
   // Bad - silent failure
   catch (error) {
     console.error(error);
     // No notification shown!
   }
   ```

3. **Don't show different notifications than backend intends**
   ```javascript
   // Bad - contradicts backend message
   const errorMessage = "Something went wrong";
   notify.msgError(errorMessage); // Should use error?.message
   ```

4. **Don't forget to set loading state**
   ```javascript
   // Bad - button stays disabled
   try {
     // operation
   } catch (error) {
     // Handle error but forgot to set loading = false in finally
   }
   ```

## Testing Error Scenarios

To test error handling:

1. **Network Error**: Disconnect internet during operation
2. **Validation Error**: Submit form with invalid data
3. **Duplicate Entry**: Try to create with duplicate values
4. **Permission Error**: Try to modify item you don't own
5. **Server Error**: Manually trigger error in backend
6. **Timeout**: Simulate slow network in DevTools

## Common Error Messages

These error messages come from the backend:

```
"Username is already taken"
"Email already registered"
"Skill name is already in use"
"Category not found"
"Unauthorized access"
"Invalid file type"
"File size exceeds limit"
"Required field missing"
"Invalid email format"
```

## Adding New Pages

When creating a new page with API calls:

1. Import `useNotify` hook
2. Add `const { notify } = useNotify();` at component start
3. Wrap all async operations in try-catch
4. In catch blocks: extract error message and show notification
5. Test with various error scenarios

## Debugging

If notifications aren't showing:

1. Check that `useNotify()` is imported and initialized
2. Verify `notify.msgError()` is called (not `msgSuccess` by mistake)
3. Check browser console for errors
4. Ensure the component is wrapped in `NotificationsProvider` (usually in App layout)
5. Test with simple message first: `notify.msgError("Test message")`

## Related Files

- **Context**: `src/context/NotificationContext.jsx` - Notification system setup
- **Hook**: `src/context/NotificationContext.jsx` - `useNotify()` hook
- **Usage Examples**: All pages in `src/pages/` demonstrate the pattern

## Questions?

Refer to existing pages for implementation examples:
- `src/pages/private/skills/AddEditSkills.jsx` - CRUD example
- `src/pages/private/Dashboard.jsx` - File upload example
- `src/pages/authentication/Authentication.jsx` - Auth example
